angular.module('vamp-ui').directive('hasPermission', ['$injector', '$interpolate', function ($injector, $interpolate) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var allowedRoles = attrs.hasPermission;
      element.removeAttr('has-permission');

      if (!allowedRoles || !$injector.has('principal')) {
        return;
      }

      var principal = $injector.get('principal');

      allowedRoles = $interpolate(allowedRoles)(scope).trim().split(',');

      if (principal.isInAnyRole(allowedRoles)) {
        return;
      }

      element.remove();
    }
  };
}]);
