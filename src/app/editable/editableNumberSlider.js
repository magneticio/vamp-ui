angular.module('app').component('editableNumberSlider', {
  templateUrl: 'app/editable/editableNumberSlider.html',
  controller: function () {
    var $ctrl = this;
    $ctrl.getParsedNumber = function () {
      return parseInt($ctrl.number, 10);
    };
    $ctrl.change = 0;
    $ctrl.editMode = false;
    $ctrl.sliderOptions = {
      floor: $ctrl.min,
      ceil: $ctrl.max,
      translate: function (value) {
        return value + $ctrl.postfix;
      }
    };
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
    min: '=',
    max: '=',
    number: '=',
    active: '=',
    edited: '&',
    postfix: '@'
  },
  transclude: true
});
