angular
  .module('app')
  .controller('GatewaysController', function ($scope) {
    var $ctrl = this;
    var $parent = $scope.$parent.$parent.$ctrl;
    this.gateway = $scope.$parent.$parent.artifact;
    $scope.$on('/events/stream', function (e, response) {
      if (_.includes(response.data.tags, 'synchronization') ||
        (_.includes(response.data.tags, 'gateways:' + $ctrl.gateway.name) && (_.includes(response.data.tags, 'deployed') || _.includes(response.data.tags, 'undeployed')))) {
        $parent.peek();
      }
    });
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
