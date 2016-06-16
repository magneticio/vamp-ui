(function() {
  'use strict';

  angular
    .module('revampUi')
    .controller('ReadOneBlueprint', ReadOneBlueprint);

  /** @ngInject */
  function ReadOneBlueprint($state, $stateParams, Artifacts, Poller) {
    console.info( 'Initiated ReadOneBlueprint' );

    var vm = this;

    vm.dropdownActions = [
      {
        name: 'Deploy',
        onClick: function() {
          console.log('click deploy');
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




    Poller(pollResource);

    function pollResource() {
      Artifacts.read('blueprints', $stateParams.id, {getAs: 'YAML'}).then(success, function(){})
    }

    function success(data) {
        vm.data = data;
    }

  }
})();
