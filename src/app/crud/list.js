angular.module('app').component('list', {
  restrict: 'E',
  scope: {
    artifact: '@'
  },
  controller: CrudList,
  templateUrl: 'app/crud/list.html'
});

function CrudList($rootScope, $attrs, vamp) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;

  this.artifact = $attrs.artifact;

  // naive pluralization
  this.list = this.artifact + 's';

  $rootScope.$on('vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      vamp.peek('/' + self.list);
    }
  });

  $rootScope.$on('/' + this.list, function (e, artifacts) {
    self.artifacts = artifacts;
  });
}
