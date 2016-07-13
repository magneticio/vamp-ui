function pageHeaderController() {
  console.log(this.title);
  console.log(this.titleAddition);
  console.log(this.actions);
}

angular
  .module('app')
  .component('pageHeader', {
    templateUrl: 'app/pageHeader/pageHeader.html',
    controller: pageHeaderController,
    bindings: {
      title: '@',
      titleAddition: '@',
      actions: '<' 
    },
    transclude: {
      buttons: '?buttons'
    }
  });

