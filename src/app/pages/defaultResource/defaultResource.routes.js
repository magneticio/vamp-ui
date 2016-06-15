(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig)
    .run(beforeStateChange);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.readall', {
        url: '/:resource',
        templateUrl: 'app/pages/defaultResource/defaultResource.html',
        controller: 'DefaultResourceController as readAllResource'
      })
      .state('root.detail', {
        url: '/:resource/:id',
        templateUrl: 'app/pages/defaultResource/detailDefaultResource.html',
        controller: 'DetailDefaultResourceController as detailResource',
      })
      .state('root.update', {
        url: '/:resource/:id/edit',
        templateUrl: 'app/pages/defaultResource/editDefaultResource.html',
        controller: 'EditDefaultResourceController as editResource',
      });

    $urlRouterProvider.otherwise('/');
  }

  /**
   * When we navigate to a resource we need to check whether we've got custom
   * routes set up for the specified resource. If this is the case we cancel
   * the ui-router transition to the defaultResource state and reroute it to
   * the state of the specified resource.
   */
  function beforeStateChange($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function( event , toState , toParams ) {
      // We only need this logic on states with one dot like root.blueprints.
      if ( toState.name.split('.').length === 2 ) {
        var checkState = 'root.' + toParams.resource;
        // If the checkState has a configuration, initiate the reroute.
        if ( $state.get( checkState ) ) {
          event.preventDefault();
          $state.go( checkState );
        }
      }
    });
  }

})();
