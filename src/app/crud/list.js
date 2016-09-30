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

  $scope.artifacts = [
    {
      name: 'test 1'
    },
    {
      name: 'test 2'
    },
    {
      name: 'test 3'
    }
  ];

  $rootScope.$on('vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      vamp.peek('/' + $scope.list);
    }
  });

  $rootScope.$on('/' + $scope.list, function (e, artifacts) {
    $scope.artifacts = artifacts;
  });
}
