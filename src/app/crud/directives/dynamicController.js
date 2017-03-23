angular.module('vamp-ui').directive('dynamicControllerAs', ['$compile', '$interpolate',
  function ($compile, $interpolate) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 5000,
      link: function (scope, elem, attrs) {
        var ctrlName = $interpolate(attrs.dynamicControllerAs)(scope);
        elem.removeAttr('dynamic-controller-as');

        var aliasName = attrs.dynamicControllerAlias || '$ctrl';

        if (ctrlName) {
          elem.attr('ng-controller', ctrlName + ' as ' + aliasName);
        }

        $compile(elem)(scope);
      }
    };
  }]);
