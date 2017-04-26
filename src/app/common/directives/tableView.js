angular.module('vamp-ui').directive('tableView', [function () {
  return {
    restrict: 'E',
    require: '^^itemExplorer',
    templateUrl: 'app/common/templates/tableView.html'
  };
}]);
