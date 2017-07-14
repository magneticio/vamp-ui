/* global VAMP */
/* eslint dot-notation: ["error", { "allowPattern": "^[a-z]+(_[a-z]+)+$" }] */
angular.module('vamp-ui').component('menu', {
  templateUrl: 'app/menu/templates/menu-v3.html',
  controller: MenuController
});

function MenuController(uiStatesFactory, $state, $timeout) {
  var $ctrl = this;

  $ctrl.leftPanelState = uiStatesFactory.viewStates.left;
  $ctrl.artifacts = VAMP.Artifacts.prototype.all();

  $ctrl.toggleSidebar = function () {
    if ($ctrl.leftPanelState === uiStatesFactory.STATE_ENUM.COLLAPSED) {
      uiStatesFactory.setLeftPanelViewState(uiStatesFactory.STATE_ENUM.EXPANDED);
    } else if ($ctrl.leftPanelState === uiStatesFactory.STATE_ENUM.EXPANDED) {
      uiStatesFactory.setLeftPanelViewState(uiStatesFactory.STATE_ENUM.COLLAPSED);
    }
    $ctrl.leftPanelState = uiStatesFactory.viewStates.left;
    $('.icon-label').toggleClass('hidden-xs').toggleClass('visible-xs');
    if (!$ctrl.isPanelExpanded() && $ctrl.adminSubMenu) {
      $ctrl.toggleAdminSubMenu();
    }
  };

  $ctrl.isPanelExpanded = function () {
    return $ctrl.leftPanelState === uiStatesFactory.STATE_ENUM.EXPANDED;
  };

  $ctrl.toggleAdminSubMenu = function () {
    $ctrl.adminSubMenu = !$ctrl.adminSubMenu;
    if ($ctrl.adminSubMenu && !$ctrl.isPanelExpanded()) {
      $ctrl.toggleSidebar();
    }
  };

  $timeout(function () {
    $ctrl.adminSubMenu = $state.includes('admin');
  });
}
