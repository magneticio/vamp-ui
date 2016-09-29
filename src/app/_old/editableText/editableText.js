function editableTextController() {
  var self = this;
  self.editMode = false;
  self.tempText = '';

  self.setEditModeActive = function () {
    self.editMode = true;
    self.tempText = angular.copy(self.text);
  };

  self.setEditModeInactive = function () {
    self.editMode = false;
    self.tempText = '';
  };
}

angular
  .module('app')
  .component('editableText', {
    templateUrl: 'app/editableText/editableText.html',
    controller: editableTextController,
    bindings: {
      active: '=',
      text: '@',
      edited: '&'
    }
  });

