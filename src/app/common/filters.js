angular.module('app')
  .filter('capitalize', function () {
    return function (input) {
      return input ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
  })
  .filter('encodeName', function () {
    return function (input) {
      return input ? input.replace(/\//g, '~2F') : '';
    };
  })
  .filter('decodeName', function () {
    return function (input) {
      return input ? input.replace(/~2F/g, '/') : '';
    };
  })
  .filter('isEmpty', function () {
    return function (obj) {
      return _.isEmpty(obj);
    };
  });
