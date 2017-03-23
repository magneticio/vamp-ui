angular
  .module('vamp-ui')
  .controller('GatewaysController', function ($scope, artifactsMetadata, $vamp, namifyFilter, $controller) {
    var $ctrl = this;

    $controller('BaseArtifactsController', {$ctrl: $ctrl, $scope: $scope, artifactsMetadata: artifactsMetadata});

    // Namifying the Routes
    $ctrl.onDataResponse = function () {
      angular.forEach($ctrl.artifacts, function (a) {
        a.routes = namifyFilter(a.routes);
      });
    };

    $ctrl.onStreamEvent = function (response) {
      if (_.includes(response.data.tags, 'synchronization') ||
        (_.includes(response.data.tags, 'gateways:') && (_.includes(response.data.tags, 'deployed') || _.includes(response.data.tags, 'undeployed')))) {
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
