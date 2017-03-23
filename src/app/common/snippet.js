angular.module('vamp-ui').component('snippet', {
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
      $ctrl.data = $ctrl.resolve.data;
    };
  }
}).factory('snippet', ['$uibModal', function ($uibModal) {
  return {
    show: function (title, message, size, data) {
      $uibModal.open({
        size: size,
        animation: true,
        backdrop: 'static',
        component: 'snippet',
        resolve: {
          title: function () {
            return title;
          },
          message: function () {
            return message;
          },
          data: function () {
            return data;
          }
        }
      }).result.then();
    }
  };
}]);
