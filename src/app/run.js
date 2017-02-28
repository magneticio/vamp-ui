angular.module('app').run(function ($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState) {
    if (toState.name === 'artifacts.view') {
      var result = toState.data.allowedKinds.indexOf(toParams.kind);

      if (result === -1) {
        e.preventDefault();

        if (fromState && fromState.name === "artifacts.view.source") {
          $state.go('artifacts', toParams);
        } else {
          $state.go('artifacts.view.source', toParams);
        }
      }
    }
  });
});
