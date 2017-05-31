angular.module('vamp-ui').controller('infoController', InfoController);

function InfoController($scope, $timeout, $vamp, artifact) {
  var $ctrl = this;
  $ctrl.editor = artifact.editor;
  $ctrl.source = '';

  $ctrl.peek = function load() {
    $vamp.get('/info', null, 'YAML')
      .then(function (res) {
        $timeout(function () {
          $ctrl.source = res.data || '';
        }, 0);
      });
  };

  $scope.$on('$vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      $ctrl.peek();
    }
  });

  $ctrl.peek();
}
