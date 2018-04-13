angular.module('vamp-ui').controller('infoController', InfoController);

function InfoController($scope, $timeout, $vamp, artifact) {
  var $ctrl = this;
  $ctrl.editor = artifact.editor;
  $ctrl.source = '';

  $ctrl.get = function load() {
    $vamp.get('/info', {}, 'YAML')
      .then(function (res) {
        $timeout(function () {
          $ctrl.source = res.data || '';
        }, 0);
      });
  };

  $ctrl.get();
}
