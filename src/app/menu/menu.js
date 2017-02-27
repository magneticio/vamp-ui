/* global Artifacts */
/* eslint dot-notation: ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }] */
angular.module('app').component('menu', {
  templateUrl: 'app/menu/templates/menu-v2.html',
  controller: MenuController
});

function MenuController($rootScope, $scope, uiStatesFactory) {
  var $ctrl = this;

  // menu
  this.leftPanelState = uiStatesFactory.viewStates.left;
  this.artifacts = Artifacts.prototype.all();
  this.subMenu = null;

  this.isActive = function (item) {
    var route = item.kind || item;
    return $ctrl.active ? $ctrl.active.startsWith(route) : false;
  };

  this.openSubMenu = function(menu) {
    var nextSubmenu = menu;
    if (menu == this.subMenu) {
      nextSubmenu = null
    }
    this.subMenu = nextSubmenu;
  }

  $scope.$on('$stateChangeSuccess', function (event, state) {
    $ctrl.active = state.name;
  });

  // info panel
}
