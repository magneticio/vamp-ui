angular.module('app').component('header', {
  scope: {
    title: '@'
  },
  transclude: {
    buttons: '?buttons'
  },
  templateUrl: 'app/common/header.html',
  controller: function ($scope, $attrs) {
    $scope.title = $attrs.title;
  }
});
