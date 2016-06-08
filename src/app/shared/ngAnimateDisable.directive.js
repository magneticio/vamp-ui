(function() {
  'use strict';

  angular
    .module('revampUi')
    .directive('ngAnimateDisable', ngAnimateDisable);

  function ngAnimateDisable ( $animate ) {
    return function ( $scope , $element ) {
      $animate.enabled( false , $element );
    }
  }

})();
