angular.module('app').component('editable', {
  templateUrl: 'app/editable/editable.html',
  controller: function () {
    var $ctrl = this;
    $ctrl.clicked = function () {
      if ($ctrl.active) {
        $ctrl.onClick();
      }
    };
  },
  bindings: {
    active: '=',
    onClick: '&'
  },
  transclude: true
});
