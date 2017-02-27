/* global Artifacts */
/* eslint dot-notation: ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }] */
angular.module('app').component('menu', {
  templateUrl: 'app/menu/templates/menu-v2.html',
  controller: MenuController
});

function MenuController($rootScope, $scope) {
  var $ctrl = this;

  // menu

  this.artifacts = Artifacts.prototype.all();

  this.isActive = function (item) {
    var route = item.kind || item;
    return $ctrl.active ? $ctrl.active.startsWith(route) : false;
  };

  $scope.$on('$stateChangeSuccess', function (event, state) {
    $ctrl.active = state.name;
  });

  // info panel
}
