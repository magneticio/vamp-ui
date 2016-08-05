/* global _*/
function menuController($rootScope, $state) {
  var self = this;
  self.toggleSettings = toggleSettings;

  console.log($state.current.name);

  var activeTable = {
    blueprints: [
      'readAllBlueprints',
      'createBlueprint',
      'updateBlueprint'
    ],
    deployments: [
      'readAllDeployments',
      'readOneDeployment'
    ],
    gateways: [
      'readAllGateways',
      'createGateway',
      'readOneGateway',
      'updateGateway'
    ]
  };

  function toggleSettings() {
    $rootScope.infoPanelActive = !$rootScope.infoPanelActive;
    console.log(!$rootScope.infoPanelActive);
  }

  for (var activeState in activeTable) {
    if (_.includes(activeTable[activeState], $state.current.name)) {
      self.active = activeState;
    }
  }

  self.menuItems = [
    {
      text: 'Blueprints',
      activeState: 'blueprints',
      goToState: 'readAllBlueprints'
    },
    {
      text: 'Deployments',
      activeState: 'deployments',
      goToState: 'readAllDeployments'
    },
    {
      text: 'Gateways',
      activeState: 'gateways',
      goToState: 'readAllGateways'
    }
  ];
}

angular
  .module('app')
  .component('menu', {
    templateUrl: 'app/menu/menu.html',
    controller: menuController
  });

