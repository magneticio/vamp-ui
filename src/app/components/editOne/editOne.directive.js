(function() {
  'use strict';

  angular
    .module('revampUi')
    .directive('editOne', EditOne);

  /** @ngInject */
  function EditOne() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/editOne/editOne.html',
      scope: {
          resource: '@',
          yaml: '@'
      },
      controller: EditOneController,
      controllerAs: 'vm',
      bindToController: true,
      replace: true,
      link: function(scope, element, attrs) {
        if(attrs.resource) {
          scope.resource = attrs.resource;
        }
      
      }
    };

    return directive;

    /** @ngInject */
    function EditOneController($http, $interval) {

      var vm = this;
      vm.aceOptions = {
        useWrapMode : true,
        showGutter: true,
        theme:'twilight',
        mode: 'yaml',
        firstLineNumber: 1
      }

      
 
    
    }
  }

})();
