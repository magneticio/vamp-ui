angular.module('app').component('header', {
  templateUrl: 'app/common/header.html',
  bindings: {
    title: '@'
  },
  transclude: {
    buttons: '?buttons'
  }
});
