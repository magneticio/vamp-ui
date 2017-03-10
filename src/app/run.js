angular.module('app').run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState) {
    if (toState.name === 'artifacts.one') {
      var result = toState.data.allowedKinds.indexOf(toParams.kind);

      if (result === -1) {
        e.preventDefault();

        if (fromState && fromState.name.indexOf('artifacts.one.source') !== -1) {
          $state.go('artifacts', toParams);
        } else {
          $state.go('artifacts.one.source.view', toParams);
        }
      }
    }
  });
});
