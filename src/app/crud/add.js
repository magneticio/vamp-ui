angular.module('app').component('add', {
  restrict: 'E',
  controller: ArtifactAddController,
  templateUrl: 'app/crud/edit.html'
});

function ArtifactAddController($scope, $attrs, $location, toastr, alert, vamp) {
  var $ctrl = this;

  this.kind = $attrs.kind;
  this.title = 'create new';

  var path = '/' + this.kind;

  this.headerClass = '';
  this.headerMessage = '';

  this.editor = {
    useWrapMode: false,
    showGutter: true,
    theme: 'chrome',
    mode: 'yaml',
    firstLineNumber: 1,
    onLoad: function (editor) {
      editor.focus();
      editor.$blockScrolling = 'Infinity';
    }
  };

  this.source = null;
  this.ignoreUpdate = false;

  $scope.$on(path, function (e, response) {
    if (response.content === 'JSON') {
      if (response.status === 'ERROR') {
        $ctrl.headerClass = 'error';
        $ctrl.headerMessage = response.data.message;
      } else {
        $ctrl.headerClass = '';
        $ctrl.headerMessage = '';
      }
    }
  });

  this.validate = _.debounce(function (data) {
    vamp.put(path, data, {validate_only: true}, 'JSON');
  }, 1500);

  this.isModified = function () {
    return $ctrl.source;
  };

  this.cancel = function () {
    if ($ctrl.isModified()) {
      alert.show('Warning', 'If you proceed, all changes will be lost.', 'Proceed', 'Cancel', goBack);
    } else {
      goBack();
    }
  };

  this.save = function () {
    $ctrl.ignoreUpdate = true;

    vamp.await(function () {
      vamp.put(path, $ctrl.source, {}, 'JSON');
    }).then(function () {
      goBack();
      toastr.success('Artifact has been successfully created.');
    }).catch(function (response) {
      $ctrl.ignoreUpdate = false;
      if (response) {
        toastr.error(response.data.message, 'Creation failed.');
      } else {
        toastr.error('Server timeout.', 'Creation failed.');
      }
    });
  };

  function goBack() {
    $location.path($ctrl.kind);
  }
}
