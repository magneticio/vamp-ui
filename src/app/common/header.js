angular.module('app').component('header', {
  templateUrl: 'app/common/header.html',
  bindings: {
    title: '@',
    clazz: '@'
  },
  transclude: {
    message: '?message',
    buttons: '?buttons'
  }
});
