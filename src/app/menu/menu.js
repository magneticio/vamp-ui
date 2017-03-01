/* global Artifacts */
/* eslint dot-notation: ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }] */
angular.module('app').component('menu', {
  templateUrl: 'app/menu/templates/menu-v2.html',
  controller: MenuController
});

function MenuController() {
  var $ctrl = this;

  $ctrl.artifacts = Artifacts.prototype.all();
}
