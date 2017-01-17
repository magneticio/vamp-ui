angular.module('app').component('header', {
  templateUrl: 'app/common/header.html',
  bindings: {
    title: '@',
    clazz: '@'
  },
  transclude: {
    toggle: '?viewToggle',
    message: '?message',
    buttons: '?buttons'
  }
});
