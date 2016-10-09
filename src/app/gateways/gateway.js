angular.module('app').controller('GatewayController', GatewayController);

/** @ngInject */
function GatewayController($scope, $filter, $stateParams, $location, vamp, alert, toastr) {
  var $ctrl = this;
  var path = '/gateways/' + $stateParams.name;

  this.gateway = null;
  this.title = $filter('decodeName')($stateParams.name);

  this.edit = function () {
    var encoded = $filter('encodeName')(this.gateway.name);
    $location.path('/gateways/edit/' + encoded).search({back: '/gateways/view/' + encoded});
  };

  this.delete = function () {
    alert.show('Warning', 'Are you sure you want to delete gateway \'' + $ctrl.gateway.name + '\'?', 'Delete', 'Cancel', function () {
      vamp.await(function () {
        vamp.remove(path);
      }).then(function () {
        $location.path('/gateways');
        toastr.success('Gateway \'' + $ctrl.gateway.name + '\' has been successfully deleted.');
      }).catch(function (response) {
        if (response) {
          toastr.error(response.data.message, 'Deletion of gateway \'' + $ctrl.gateway.name + '\' failed.');
        } else {
          toastr.error('Server timeout.', 'Deletion of gateway \'' + $ctrl.gateway.name + '\' failed.');
        }
      });
    });
  };

  function peek() {
    vamp.peek(path);
  }

  peek();

  $scope.$on(path, function (e, response) {
    $ctrl.gateway = response.data;
  });

  $scope.$on('/events/stream', function (e, response) {
    if ($ctrl.gateway && _.includes(response.data.tags, 'gateways:' + $ctrl.gateway.name)) {
      if (_.includes(response.data.tags, 'archive:delete')) {
        alert.show('Warning', '\'' + $ctrl.gateway.name + '\' has been deleted in background.', 'Leave', 'Stay', function () {
          $location.path('/gateways');
        });
      } else if (_.includes(response.data.tags, 'archive:update')) {
        peek();
      }
    }
  });
}
