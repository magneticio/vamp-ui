(function() {
  'use strict';

  angular
    .module('revampUi')
    .config(routerConfig)
    .run(beforeStateChange);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.all', {
        url: '/:resource',
        templateUrl: 'app/pages/defaultResource/defaultResource.html',
        controller: 'DefaultResourceController as readAllResource'
      })
      .state('root.all.read', {
        url: '/:id',
        views: {
          '@root' : {
            templateUrl: 'app/pages/defaultResource/detailDefaultResource.html',
            controller: 'DetailDefaultResourceController as detailResource'
          }
        }
      })
      .state('root.all.update', {
        url: '/:id/edit',
        views: {
          '@root' : {
            templateUrl: 'app/pages/defaultResource/editDefaultResource.html',
            controller: 'EditDefaultResourceController as editResource'
          }
        }
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
      var stateParts = toState.name.split('.');

      // The route config always has a custom route as the second part,
      // therefore we can replace the second index of the array with the resource
      stateParts[1] = toParams.resource;

      var checkState = stateParts.join('.');

      // If the checkState has a configuration, initiate the reroute.
      if ( $state.get( checkState ) ) {
        event.preventDefault();
        $state.go( checkState, toParams );
      }
    });
  }

})();
