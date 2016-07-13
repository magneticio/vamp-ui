function actionButtonController($timeout) {
  var self = this;
  self.buttonClicked = buttonClicked;

  self.busy = false;


  function buttonClicked() {
    if(self.async) {
      console.log('Action is Async')
      self.busy = true;

      $timeout(function() {
        return self.onClick(self.data).then(done, done);
      }, 500);

      function done() {
        self.busy = false;
      }

    } else {
      console.log('Action is not Async. Doing action');
      console.log(self);
      self.onClick(self.data);
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
      data: '<'
    }
  });

