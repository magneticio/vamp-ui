angular.module('app').component('alert', {
  templateUrl: 'app/common/alert.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;

    $ctrl.$onInit = function () {
      $ctrl.title = $ctrl.resolve.title;
      $ctrl.message = $ctrl.resolve.message;
      $ctrl.button1 = $ctrl.resolve.button1;
      $ctrl.button2 = $ctrl.resolve.button2;
      $ctrl.button1Class = $ctrl.resolve.button1Class;
      $ctrl.button2Class = $ctrl.resolve.button2Class;
    };

    $ctrl.ok = function () {
      $ctrl.close();
    };

    $ctrl.cancel = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };
  }
}).factory('alert', ['$uibModal', function ($uibModal) {
  return {
    show: function (title, message, button1, button2, button1Click, button2Click, button1Class, button2Class) {
      $uibModal.open({
        animation: true,
        component: 'alert',
        resolve: {
          title: function () {
            return title;
          },
          message: function () {
            return message;
          },
          button1: function () {
            return button1;
          },
          button2: function () {
            return button2;
          },
          button1Class: function () {
            return button1Class ? button1Class : 'btn-primary';
          },
          button2Class: function () {
            return button2Class ? button2Class : 'btn-warning';
          }
        }
      }).result.then(function () {
        if (button1Click) {
          button1Click();
        }
      }, function () {
        if (button2Click) {
          button2Click();
        }
      });
    }
  };
}]);
