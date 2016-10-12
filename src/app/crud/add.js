angular.module('app').component('add', {
  restrict: 'E',
  controller: ArtifactAddController,
  templateUrl: 'app/crud/edit.html'
});

function ArtifactAddController($scope, $attrs, $location, $state, toastr, alert, $vamp, artifact) {
  var $ctrl = this;

  this.kind = $attrs.kind;
  // naive singularization
  this.singular = this.kind.substring(0, this.kind.length - 1);
  this.title = 'new ' + this.singular;

  var path = '/' + this.kind;

  this.headerClass = '';
  this.headerMessage = '';
  this.editor = artifact.editor;

  this.source = null;

  this.valid = true;
  var validation = true;
  var ignoreChange = false;

  $scope.$on(path, function (e, response) {
    if (response.content === 'JSON') {
      if (response.status === 'ERROR') {
        $ctrl.valid = false;
        $ctrl.headerClass = 'error';
        $ctrl.headerMessage = response.data.message;
      } else {
        $ctrl.valid = true;
        $ctrl.headerClass = '';
        $ctrl.headerMessage = '';
      }
    }
  });

  $scope.$on('$stateChangeStart', function (event, toState, toParams) {
    if (!ignoreChange && $ctrl.isModified()) {
      event.preventDefault();
      alert.show('Warning', 'If you proceed, all changes will be lost.', 'Proceed', 'Cancel', function () {
        $ctrl.base = $ctrl.source = null;
        $state.go(toState, toParams);
      });
    }
  });

  this.validate = function () {
    artifact.validate(path, $ctrl.source, validation);
  };

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
    validation = false;
    ignoreChange = true;

    $vamp.await(function () {
      $vamp.put(path, $ctrl.source, {}, 'JSON');
    }).then(function () {
      goBack();
      toastr.success('New ' + $ctrl.singular + ' has been successfully created.');
    }).catch(function (response) {
      validation = true;
      ignoreChange = false;
      if (response) {
        toastr.error(response.data.message, 'Creation failed.');
      } else {
        toastr.error('Server timeout.', 'Creation failed.');
      }
    });
  };

  function goBack() {
    validation = false;
    ignoreChange = true;
    $location.path($ctrl.kind);
  }
}
