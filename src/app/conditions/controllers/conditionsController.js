function conditionsController($scope, $state, $stateParams, artifactsMetadata, $vamp) {
  var $ctrl = this;

  $ctrl.conditions = [];
  $ctrl.config = artifactsMetadata;
  var path = '/conditions';

  $ctrl.add = function () {
    $state.go('.add');
  };

  $ctrl.onView = function (condition) {
    $state.go('.one', {
      name: condition.name
    });
  };

  $ctrl.delete = function (condition) {
    $vamp.remove(path + '/' + condition.name, angular.toJson(condition));
  };

  // $scope event listenters

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      peek();
    }
  });

  $scope.$on(path, function (e, response) {
    angular.copy(_.orderBy(response.data, 'name'), $ctrl.conditions);
  });

  $scope.$on('/events/stream', function (e, response) {
    if (_.includes(response.data.tags, 'conditions')) {
      peek();
    }
  });

  function peek() {
    $vamp.peek(path);
  }

  peek();
}

conditionsController.$inject = ['$scope', '$state', '$stateParams', 'artifactsMetadata', '$vamp'];
angular.module('vamp-ui').controller('conditionsController', conditionsController);
