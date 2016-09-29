function editableLabelController() {
  var self = this;
  self.clicked = clicked;

  function clicked() {
    if (self.active) {
      self.onClick();
    }
  }
}

angular
  .module('app')
  .component('editableLabel', {
    templateUrl: 'app/editableLabel/editableLabel.html',
    controller: editableLabelController,
    bindings: {
      active: '=',
      onClick: '&'
    },
    transclude: true
  });

