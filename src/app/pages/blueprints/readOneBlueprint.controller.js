(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('ReadOneBlueprint', ReadOneBlueprint);

  /** @ngInject */
  function ReadOneBlueprint($state, $stateParams, Artifacts, Deployments, Poller) {
    console.info( 'Initiated ReadOneBlueprint' );

    var vm = this;
    vm.state = 'READ';

    vm.dropdownActions = [
      {
        name: 'Deploy',
        onClick: function() {
          vm.state = 'DEPLOY';
          deployBlueprint($stateParams.id);
        },
        default: true
      },
      {
        icon: 'plus',
        name: 'Add to deployment',
        onClick: function() {
          console.log('click add to deployment');
        }
      },
      {
        icon: 'times',
        name: 'Remove from deployment',
        onClick: function() {
          console.log('click remove from deployment');
        }
      }
    ];



    function deployBlueprint(blueprintId) {
      Artifacts.read('blueprints', blueprintId).then(createDeploymentWithBlueprint, function(){})

      function createDeploymentWithBlueprint(data) {
        Deployments.create(data).then(function(deployments){console.log(deployments), function(){}});
      }
    }




    Poller(pollResource);

    function pollResource() {
      Artifacts.read('blueprints', $stateParams.id, {getAs: 'YAML'}).then(success, function(){})
    }

    function success(data) {
        vm.data = data;
    }



  }
})();
