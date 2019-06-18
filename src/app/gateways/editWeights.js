angular.module('vamp-ui').component('editWeights', {
  restrict: 'E',
  templateUrl: 'app/gateways/editWeights.html',
  controller: EditWeights,
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  }
});

/** @ngInject */
function EditWeights($scope, slider) {
  var $ctrl = this;

  $scope.sliderOptions = slider.weightOptions;

  $scope.total = function () {
    return _.reduce($scope.weights, function (sum, weight) {
      return sum + weight;
    }, 0);
  };

  $scope.valid = function () {
    return $scope.total() === 100;
  };

  this.save = function () {
    $ctrl.close({
      $value: _.reduce($scope.weights, function (weights, weight, route) {
        weights[route] = weight + '%';
        return weights;
      }, {})
    });
  };

  var first = null;
  var second = null;

  $scope.$watch('weights', function (newValue, oldValue) {
    if ($scope.routeCount === 2) {
      if (newValue[first] === oldValue[first]) {
        $scope.weights[first] = 100 - $scope.weights[second];
      } else {
        $scope.weights[second] = 100 - $scope.weights[first];
      }
    }
  }, true);

  this.$onInit = function () {
    var gateway = this.resolve.gateway;

    $scope.routeCount = _.size(gateway.routes);

    $scope.weights = _.reduce(gateway.routes, function (weights, route, name) {
      weights[name] = parseInt(route.weight, 10);
      return weights;
    }, {});

    if ($scope.routeCount === 2) {
      _.forEach(gateway.routes, function (v, name) {
        if (first === null) {
          first = name;
        } else {
          second = name;
        }
      });
    }
  };
}
