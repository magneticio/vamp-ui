function list($rootScope, $scope, vamp) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  $scope.breeds = [];

  vamp.peek('/breeds');

  $rootScope.$on('/breeds', function (event, breeds) {
    $scope.breeds = breeds;
  });
}

angular.module('app').component('list', {
  templateUrl: 'app/crud/list.html',
  controller: list
});
