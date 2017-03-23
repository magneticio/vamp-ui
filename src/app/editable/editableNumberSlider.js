angular.module('vamp-ui').component('editableNumberSlider', {
  templateUrl: 'app/editable/editableNumberSlider.html',
  controller: function () {
    var $ctrl = this;
    $ctrl.getParsedNumber = function () {
      return parseInt($ctrl.number, 10);
    };
    $ctrl.change = 0;
    $ctrl.editMode = false;
    $ctrl.sliderOptions = $ctrl.options;
    $ctrl.setEditModeActive = function () {
      $ctrl.change = $ctrl.getParsedNumber();
      $ctrl.editMode = true;
    };
    $ctrl.setEditModeInactive = function () {
      $ctrl.editMode = false;
      $ctrl.change = '';
    };
  },
  bindings: {
    options: '=',
    number: '=',
    active: '=',
    edited: '&'
  },
  transclude: true
});
