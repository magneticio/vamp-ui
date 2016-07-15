function menuItemController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('menuItem', {
    templateUrl: 'app/menuItem/menuItem.html',
    controller: menuItemController
  });

