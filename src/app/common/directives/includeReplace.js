angular.module('vamp-ui').directive('includeReplace', ['$compile', function ($compile) {
  return {
    require: 'ngInclude',
    restrict: 'A', /* optional */
    compile: function compile() {
      return function postLink(scope, iElement, iAttrs, controller) {
        iElement.replaceWith($compile(controller.template)(scope));
      };
    }
  };
}]);
