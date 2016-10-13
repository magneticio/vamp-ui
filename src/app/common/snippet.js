angular.module('app').component('snippet', {
  templateUrl: 'app/common/snippet.html',
  bindings: {
    resolve: '<',
    close: '&'
  },
  controller: function () {
    var $ctrl = this;
    this.$onInit = function () {
      $ctrl.title = $ctrl.resolve.title;
      $ctrl.message = $ctrl.resolve.message;
    };
  }
}).factory('snippet', ['$uibModal', function ($uibModal) {
  return {
    show: function (title, message, size) {
      $uibModal.open({
        size: size,
        animation: true,
        component: 'snippet',
        resolve: {
          title: function () {
            return title;
          },
          message: function () {
            return message;
          }
        }
      }).result.then();
    }
  };
}]);
