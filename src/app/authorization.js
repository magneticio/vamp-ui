angular.module('vamp-ui').factory('$authorization', ['$rootScope', '$vamp', function ($rootScope, $vamp) {
  return new AuthorizationService($rootScope, $vamp);
}]);

function AuthorizationService($rootScope, $vamp) {
  var $this = this;

  this.action = {
    read: 'READ',
    write: 'WRITE',
    publish_event: 'PUBLISH_EVENT'
  };

  this.readOnly = function (artifacts) {
    return !$this.authorized(artifacts, $this.action.write);
  };

  this.authorized = function (artifacts, action) {
    if (!$rootScope.session || !$rootScope.session.user || $rootScope.session.user.role) {
      return true;
    }
    var access = '/' + $vamp.getRequestNamespace() + '/' + artifacts;
    var rights = $rootScope.session.user.rights || {};
    var available = rights[access] || [];
    var found = _.find(available, function (a) {
      return a === action;
    });
    return Boolean(found);
  };
}
