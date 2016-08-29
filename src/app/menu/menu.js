/* global _*/
function menuController($rootScope, $interval, Api) {
  var self = this;
  self.toggleSettings = toggleSettings;
  self.jvmData = {};
  
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
    ],
    breeds: [
      'readAllBreeds',
      'createBreed',
      'readOneBreed',
      'updateBreed'
    ],
    workflows: [
      'readAllWorkflows',
      'createWorkflow',
      'readOneWorkflow',
      'updateWorkflow'
    ]
  };

  $rootScope.$on('$stateChangeStart', stateChanged);

  function stateChanged(event, toState) {
    for (var activeState in activeTable) {
      if (_.includes(activeTable[activeState], toState.name)) {
        self.active = activeState;
      }
    }
  }

  function toggleSettings() {
    $rootScope.infoPanelActive = !$rootScope.infoPanelActive;
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
    },
    {
      text: 'Breeds',
      activeState: 'breeds',
      goToState: 'readAllBreeds'
    },
    {
      text: 'Workflows',
      activeState: 'workflows',
      goToState: 'readAllWorkflows'
    }
  ];

  Api.readAll('info', {for: 'jvm'}).then(jvmDataLoaded);
  $interval(function() {
    Api.readAll('info', {for: 'jvm'}).then(jvmDataLoaded);
  }, 30000);

  function jvmDataLoaded(response) {
    self.jvmData = response.data.jvm;
  }
}

angular
  .module('app')
  .component('menu', {
    templateUrl: 'app/menu/menu.html',
    controller: menuController
  });

