angular.module('app').component('list', {
  templateUrl: 'app/crud/list.html',
  controller: CrudList
});

function CrudList($rootScope, $scope, vamp) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  $scope.blueprints = [];

  $rootScope.$on('vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      vamp.peek('/blueprints');
    }
  });

  $rootScope.$on('/blueprints', function (e, blueprints) {
    $scope.blueprints = blueprints;
  });
}
