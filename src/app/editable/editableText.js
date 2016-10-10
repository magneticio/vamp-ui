angular.module('app').component('editableText', {
  templateUrl: 'app/editable/editableText.html',
  controller: function () {
    var $ctrl = this;
    $ctrl.editMode = false;
    $ctrl.change = '';
    $ctrl.setEditModeActive = function () {
      $ctrl.editMode = true;
      $ctrl.change = angular.copy($ctrl.text);
    };
    $ctrl.setEditModeInactive = function () {
      $ctrl.editMode = false;
      $ctrl.change = '';
    };
  },
  bindings: {
    active: '=',
    text: '@',
    edited: '&'
  },
  transclude: true
});
