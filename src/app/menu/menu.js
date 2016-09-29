/* eslint dot-notation: ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }] */
angular.module('app').component('menu', {
  templateUrl: 'app/menu/menu.html',
  controller: MenuController
});

function MenuController($rootScope, $scope, $interval, vamp) {
  var activeTable = {
    blueprints: [
      'list'
    ]
    // ,
    // deployments: [
    //   'readAllDeployments',
    //   'readOneDeployment'
    // ],
    // gateways: [
    //   'readAllGateways',
    //   'createGateway',
    //   'readOneGateway',
    //   'updateGateway'
    // ],
    // breeds: [
    //   'readAllBreeds',
    //   'createBreed',
    //   'readOneBreed',
    //   'updateBreed'
    // ]
  };

  $rootScope.$on('$stateChangeStart', stateChanged);

  function stateChanged(event, toState) {
    for (var activeState in activeTable) {
      if (_.includes(activeTable[activeState], toState.name)) {
        self.active = activeState;
      }
    }
  }

  $scope.connected = false;

  $scope.toggleSettings = function () {
    $rootScope.infoPanelActive = !$rootScope.infoPanelActive;
  };

  $scope.menuItems = [
    {
      text: 'Blueprints',
      activeState: 'list',
      goToState: 'list'
    }
    // ,
    // {
    //   text: 'Deployments',
    //   activeState: 'deployments',
    //   goToState: 'readAllDeployments'
    // },
    // {
    //   text: 'Gateways',
    //   activeState: 'gateways',
    //   goToState: 'readAllGateways'
    // },
    // {
    //   text: 'Breeds',
    //   activeState: 'breeds',
    //   goToState: 'readAllBreeds'
    // }
  ];

  function info() {
    vamp.peek('/info', {on: 'jvm'});
  }

  var polling;

  $rootScope.$on('vamp:connection', function (event, connection) {
    if (connection === 'opened') {
      info();
      if (!polling) {
        polling = $interval(info, 15000);
      }
      $scope.connected = true;
    } else {
      $scope.connected = false;
      $interval.cancel(polling);
      polling = undefined;
    }
  });

  $rootScope.$on('/info', function (event, info) {
    $scope.jvm = {
      systemLoad: info.jvm['operating_system']['system_load_average'],
      heapCurrent: info.jvm.memory.heap.used / (1024 * 1024),
      heapMax: info.jvm.memory.heap.max / (1024 * 1024)
    };
  });
}
