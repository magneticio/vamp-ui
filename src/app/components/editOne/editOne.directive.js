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
          sourceCode: '@',
          editAction: '&'
      },
      controller: EditOneController,
      controllerAs: 'vm',
      bindToController: true,
      replace: true
    };

    return directive;

    /** @ngInject */
    function EditOneController($http, $interval) {

      var vm = this;
      vm.edit = edit;

      vm.aceOptions = {
        useWrapMode : true,
        showGutter: true,
        theme:'twilight',
        mode: 'yaml',
        firstLineNumber: 1
      }

      function edit(data) {
        vm.editAction({data: data});
      }

    }
  }

})();
