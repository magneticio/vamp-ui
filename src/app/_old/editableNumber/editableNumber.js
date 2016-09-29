function editableNumberController() {
  var self = this;
  self.getParsedNumber = function () {
    return parseInt(self.number, 10);
  };

  self.tempNumber = 0;

  self.editMode = false;

  self.sliderOptions = {
    floor: self.min,
    ceil: self.max,
    translate: function (value) {
      return value + self.postfix;
    }
  };

  self.setEditModeActive = function () {
    self.tempNumber = self.getParsedNumber();
    self.editMode = true;
  };

  self.setEditModeInactive = function () {
    self.editMode = false;
    self.tempNumber = '';
  };
}

angular
  .module('app')
  .component('editableNumber', {
    templateUrl: 'app/editableNumber/editableNumber.html',
    controller: editableNumberController,
    bindings: {
      min: '=',
      max: '=',
      number: '=',
      active: '=',
      edited: '&',
      postfix: '@'
    }
  });

