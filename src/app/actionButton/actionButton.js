function actionButtonController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('actionButton', {
    templateUrl: 'app/actionButton/actionButton.html',
    controller: actionButtonController
  });

