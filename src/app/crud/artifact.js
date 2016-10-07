angular.module('app').component('artifact', {
  require: {
    artifacts: '^artifacts'
  },
  templateUrl: 'app/crud/artifact.html',
  bindings: {
    artifact: '<'
  }
});
