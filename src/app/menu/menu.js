/* global _*/
function menuController($rootScope, $interval, Api, $mixpanel) {
  var self = this;
  self.toggleSettings = toggleSettings;
  self.jvmData = {};

  $mixpanel.track('UI loaded');

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
    $mixpanel.track('Options pane toggled');
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
    }
  ];

  Api.readAll('info', {on: 'jvm'}).then(jvmDataLoaded);
  $interval(function () {
    Api.readAll('info', {on: 'jvm'}).then(jvmDataLoaded);
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

