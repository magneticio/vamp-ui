angular.module('vamp-ui').controller('addController',

function ($scope, $state, $stateParams, $breadcrumb, $timeout, $element, $vamp, artifact, toastr, alert) {
  var $ctrl = this;

  $ctrl.kind = $stateParams.kind;
  // naive singularization
  $ctrl.singular = $ctrl.kind.substring(0, $ctrl.kind.length - 1);
  $ctrl.title = 'New ' + $ctrl.singular;

  var path = '/' + $ctrl.kind;

  $ctrl.errorClass = '';
  $ctrl.errorMessage = '';
  $ctrl.restOfMessage = '';
  $ctrl.expandError = false;
  $ctrl.editor = artifact.editor;

  $ctrl.source = $stateParams.importData || null;

  $ctrl.valid = true;
  $ctrl.inEdit = true;
  var validation = true;
  var ignoreChange = false;

  function init() {
    $timeout(function () {
      $($element).find('#editor textarea').focus();
    });
  }

  function transformErrorMessage(message) {
    $ctrl.errorMessage = message;

    var newLineIndex = message.indexOf('\n');
    if (newLineIndex !== -1) {
      $ctrl.errorMessage = message.substring(0, newLineIndex);
      $ctrl.restOfMessage = message.substring(newLineIndex + 1);
      $ctrl.expandError = false;
    }
  }

  $scope.$on(path, function (e, response) {
    if (response.content === 'JSON') {
      if (response.status === 'ERROR') {
        $ctrl.valid = false;
        $ctrl.errorClass = 'error';
        transformErrorMessage(response.data.message);
        $ctrl.expandError = false;
      } else {
        $ctrl.valid = true;
        $ctrl.errorClass = '';
        $ctrl.errorMessage = '';
        $ctrl.restOfMessage = '';
        $ctrl.expandError = false;
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
    return $ctrl.source !== null && $ctrl.source !== '';
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

  this.isBlueprint = function () {
    return this.kind === 'blueprints';
  };

  function goBack() {
    validation = false;
    ignoreChange = true;
    $state.go('artifacts', {kind: $ctrl.kind});
  }

  init();
});
