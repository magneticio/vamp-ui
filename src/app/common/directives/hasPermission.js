angular.module('vamp-ui').directive('hasPermission', ['$injector', '$interpolate', function ($injector, $interpolate) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var allowedRoles = attrs.hasPermission;
      element.removeAttr('has-permission');

      if (!allowedRoles || !$injector.has('authenticationService')) {
        return;
      }

      var authenticationService = $injector.get('authenticationService');

      allowedRoles = $interpolate(allowedRoles)(scope).trim().split(',');

      if (authenticationService.isInAnyRole(allowedRoles)) {
        return;
      }

      element.remove();
    }
  };
}]);
