angular.module('app').component('info', {
  templateUrl: 'app/system/templates/infoConfiguration.html',
  controller: InfoController
});

function InfoController($scope, $timeout, $vamp, artifact) {
  var $ctrl = this;
  $ctrl.editor = artifact.editor;
  $ctrl.source = '';

  $ctrl.peek = function load() {
    $vamp.await(function () {
      $vamp.peek('info', '', {}, 'YAML');
    }).then(function (response) {
      $timeout(function () {
        $ctrl.source = response.data || '';
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
