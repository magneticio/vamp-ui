(function() {
  'use strict';

  angular
    .module('revampUi')
    .filter('keySearch', keySearch);

  function keySearch () {
    return function( items , key , value ) {
      if ( ! value ) {
        return items;
      }

      return items.filter(function( object ) {
        return object[ key ].indexOf( value ) !== -1;
      });
    };
  };

})();
