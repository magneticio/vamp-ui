angular.module('vamp-ui').directive('gridView', [function () {
  return {
    restrict: 'E',
    require: '^^itemExplorer',
    templateUrl: 'app/common/templates/gridView.html'
  };
}]);
