angular.module('app').component('tag', {
  bindings: {
    value: '=',
    hasProgress: '<',
    success: '=',
    inProgress: '=',
    paused: '=',
    error: '='
  },
  controllerAs: '$tag',
  templateUrl: 'app/crud/templates/tag.html',
  controller: function () {
  }
}).filter('interpolate', function () {
  return function (expression, context) {
    if (expression === undefined) {
      return undefined;
    }

    var value = context.$eval(expression);
    return value;
  };
});
