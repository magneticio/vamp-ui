/* global vampPluginsLoader*/
angular.module('vamp-ui').directive('placeholder', ['$placeholders', '$compile', function ($placeholders, $compile) {
  return {
    restrict: 'E',
    link: function (scope, elem, attrs) {
      var directiveName = $placeholders.getPlaceholderDirective(attrs.name);
      if (!directiveName) {
        return;
      }

      var placeholderContent = '<' + directiveName + '></' + directiveName + '>';

      elem.append($compile(placeholderContent)(scope));
    },
    controllerAs: '$placeholder'
  };
}]).service('$placeholders', function () {
  var placeholdersMap = {};
  vampPluginsLoader.plugins.forEach(function (plugin) {
    _.extend(placeholdersMap, plugin.placeholders);
  });

  this.getPlaceholderDirective = function (name) {
    return placeholdersMap[name];
  };
});
