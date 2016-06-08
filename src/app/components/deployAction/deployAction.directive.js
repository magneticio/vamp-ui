(function() {
  'use strict';

  angular
    .module('revampUi')
    .directive('deployAction', DeployAction);

  /** @ngInject */
  function DeployAction() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/deployAction/deployAction.html',
      scope: {

      },
      controller: DeployActionController,
      controllerAs: 'vm',
      bindToController: true,
      replace: true
    };

    return directive;

    /** @ngInject */
    function DeployActionController($http, $interval) {
      var vm = this;
      vm.deploy = deploy;

      function deploy(blueprint) {
        alert('DEPLOOOOOY!');
      }
    }
  }

})();
