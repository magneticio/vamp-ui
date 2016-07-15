function menuController() {
  var self = this;
  self.menuItems = [
    {
      text: 'Blueprints',
      goToState: 'readAllBlueprints'
    },
    {
      text: 'Deployments',
      goToState: 'readAllDeployments'
    },
    {
      text: 'Gateways',
      goToState: 'readAllGateways'
    }
  ]
}

angular
  .module('app')
  .component('menu', {
    templateUrl: 'app/menu/menu.html',
    controller: menuController
  });

