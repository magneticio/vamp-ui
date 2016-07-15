function actionButtonController($timeout, Popup) {
  var self = this;
  self.buttonClicked = buttonClicked;

  self.busy = false;


  function buttonClicked() {
    if(self.confirm) {
      Popup.openConfirmation(self.confirm.title, '', self.onClick, self.data, self.confirm.inputs, self.async);
      return;
    } else {
      if (self.async) {
        console.log('Action is Async')
        self.busy = true;

        $timeout(function () {
          return self.onClick(self.data).then(done, done);
        }, 3000);

        function done() {
          self.busy = false;
        }

      } else {
        console.log('Action is not Async. Doing action');
        console.log('Dit is de button action', self);
        self.onClick(self.data);
      }
    }
  }
}

angular
  .module('app')
  .component('actionButton', {
    templateUrl: 'app/actionButton/actionButton.html',
    controller: actionButtonController,
    bindings: {
      text: '@',
      onClick: '<',
      icon: '@',
      type: '@',
      async: '<',
      data: '<',
      confirm: '<'
    }
  });

