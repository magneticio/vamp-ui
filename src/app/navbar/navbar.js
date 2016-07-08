function navbarController(NavbarService) {
  this.navbarItems = NavbarService.getNavbarItems();
}

angular
  .module('app')
  .component('navbar', {
    templateUrl: 'app/navbar/navbar.html',
    controller: navbarController
  });

