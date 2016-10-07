angular.module('app').component('header', {
  templateUrl: 'app/common/header.html',
  bindings: {
    title: '@',
    message: '@',
    clazz: '@'
  },
  transclude: {
    buttons: '?buttons'
  }
});
