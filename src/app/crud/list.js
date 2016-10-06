angular.module('app').component('list', {
  restrict: 'E',
  scope: {
    artifact: '@'
  },
  controller: CrudList,
  templateUrl: 'app/crud/list.html'
});

function CrudList($rootScope, $scope, $attrs, vamp) {
  /* eslint camelcase: ["error", {properties: "never"}]*/

  $scope.artifact = $attrs.artifact;

  // naive pluralization
  $scope.list = $scope.artifact + 's';

  $rootScope.$on('vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      vamp.peek('/' + $scope.list);
    }
  });

  $rootScope.$on('/' + $scope.list, function (e, artifacts) {
    $scope.artifacts = artifacts;
  });
}
