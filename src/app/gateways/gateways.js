angular
  .module('app')
  .controller('GatewaysController', function ($scope, $vamp, namifyFilter, $controller) {
    var $ctrl = this;

    $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope});

    // Namifying the Routes
    $ctrl.onDataResponse = function () {
      angular.forEach($ctrl.artifacts, function (a) {
        a.routes = namifyFilter(a.routes);
      });
    };

    $ctrl.onStreamEvent = function (response) {
      if (_.includes(response.data.tags, 'synchronization') ||
        (_.includes(response.data.tags, 'gateways:' + $ctrl.gateway.name) && (_.includes(response.data.tags, 'deployed') || _.includes(response.data.tags, 'undeployed')))) {
        $ctrl.peek();
      }
    };
  })
  .factory('slider', [function () {
    return new SliderService();
  }]);

function SliderService() {
  this.weightOptions = {
    floor: 0,
    ceil: 100,
    showSelectionBar: true,
    translate: function (value) {
      return value + '%';
    }
  };
}
