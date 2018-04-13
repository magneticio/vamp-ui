/* global Ui */
PaginationController.$inject = ['$ctrl', '$vamp', '$scope', 'artifactsMetadata', '$stateParams'];

function PaginationController($ctrl, $vamp, $scope, artifactsMetadata, $stateParams) {
  $ctrl.parseHeaders = function (response) {
    var headers = response.headers();
    $ctrl.total = headers['x-total-count'];
  };

  $ctrl.refresh = function () {
    var params = {};
    params.page = $stateParams.page;
    params.per_page = Ui.config.itemsPerPage;
    $vamp.emit($ctrl.path, params);
  };
}

angular.module('vamp-ui').controller('PaginationController', PaginationController);
