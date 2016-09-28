function Environment() {
}

Environment.prototype.endpoint = function () {
  return 'http://localhost:9090/api/v1/';
};

Environment.prototype.origin = function () {
  return 'localhost:9090';
};

Environment.prototype.mixpanel = function () {
  return '';
};

Environment.prototype.version = function () {
  return '0.9.0-10-ga8b48ff';
};

Environment.prototype.debug = function () {
  return true;
};

angular.module('app').service('Environment', Environment);
