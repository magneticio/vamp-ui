angular.module('vamp-ui').component('editableDropDown', {
  templateUrl: 'app/editable/editableDropDown.html',
  controller: function () {
    var $ctrl = this;
    $ctrl.editMode = false;
    $ctrl.toggle = function () {
      $ctrl.editMode = !$ctrl.editMode;
    };
  },
  bindings: {
    active: '=',
    values: '=',
    selected: '&'
  },
  transclude: true
});
