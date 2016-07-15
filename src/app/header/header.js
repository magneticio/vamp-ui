function headerController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('header', {
    templateUrl: 'app/header/header.html',
    controller: headerController
  });

