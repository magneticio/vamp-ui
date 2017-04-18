function scalesController($scope, $state, $stateParams, artifactsMetadata, $vamp) {
  var $ctrl = this;

  $ctrl.scales = [];
  $ctrl.config = artifactsMetadata;
  var path = '/scales';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (scale) {
    $state.go('.one', {
      name: scale.name
    });
  };

  $ctrl.delete = function (scale) {
    $vamp.remove(path + '/' + scale.name, angular.toJson(scale));
  };

  // $scope event listenters

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      peek();
    }
  });

  $scope.$on(path, function (e, response) {
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.scales);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'scales')) {
      peek();
    }
  });

  function peek() {
    $vamp.peek(path);
  }

  peek();
}

scalesController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp'];
angular.module('vamp-ui').controller('scalesController', scalesController);
