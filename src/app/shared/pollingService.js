(function() {
  'use strict';

  angular
    .module('revampUi')
    .factory('Poller', Poller);

  function Poller ( $interval ) {

    var intervalTime = 30000,
        pollingCache = null;

    return function( pollingFn , timeout ) {
      if ( pollingCache ) {
        $interval.cancel( pollingCache );
      }

      pollingFn();
      pollingCache = $interval( pollingFn , timeout || intervalTime );
    }

  };

})();
