function menuController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('menu', {
    templateUrl: 'app/menu/menu.html',
    controller: menuController
  });

