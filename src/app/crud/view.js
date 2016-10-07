angular.module('app').component('view', {
  restrict: 'E',
  controller: ArtifactViewController,
  templateUrl: 'app/crud/view.html'
});

function ArtifactViewController($scope, $attrs, $stateParams, $location, toastr, alert, vamp) {
  var $ctrl = this;

  this.kind = $attrs.kind;
  this.name = $stateParams.name;

  this.headerClass = '';
  this.headerMessage = '';

  var path = '/' + this.kind + '/' + this.name;

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

  this.base = null;
  this.source = null;

  vamp.peek(path, {}, 'YAML');

  $scope.$on(path, function (e, response) {
    if ($ctrl.base === null && response.status === 'OK' && response.content === 'YAML') {
      $ctrl.base = $ctrl.source = response.data;
    }
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

  this.validate = function (data) {
    vamp.put(path, data, {validate_only: true}, 'JSON');
  };

  this.isModified = function () {
    return !($ctrl.base === null || $ctrl.base === $ctrl.source);
  };

  this.cancel = function () {
    if ($ctrl.isModified()) {
      alert.show('Warning', '\'' + $ctrl.name + '\' has been changed. If you proceed, all changes will be lost.', 'Proceed', 'Cancel', goBack);
    } else {
      goBack();
    }
  };

  this.save = function () {
    vamp.await(function () {
      vamp.put(path, $ctrl.source, {}, 'JSON');
    }).then(function () {
      goBack();
      toastr.success('\'' + $ctrl.name + '\' has been successfully saved.');
    }).catch(function (response) {
      if (response) {
        toastr.error(response.data.message, 'Save failed.');
      } else {
        toastr.error('Server timeout.', 'Save failed.');
      }
    });
  };

  function goBack() {
    $location.path($ctrl.kind);
  }
}
