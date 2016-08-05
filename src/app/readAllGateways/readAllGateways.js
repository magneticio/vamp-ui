function readAllGatewaysController(Api, toastr, NgTableParams, $interval, $uibModal) {
  /* eslint camelcase: ["error", {properties: "never"}]*/
  var self = this;
  self.openDeleteModal = openDeleteModal;

  self.tableParams = new NgTableParams({page: 1, count: 10}, {counts: [], getData: getData});
  function getData(params) {
    return Api.readAll('gateways', {page: params.page(), per_page: 10}).then(function (response) {
      params.total(response.headers()['x-total-count']);
      return response.data;
    });
  }
  function refresh() {
    self.tableParams.reload();
  }

  function openDeleteModal(gatewayId) {
    var theGatewayId = gatewayId;

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/deleteResourceModal/deleteResourceModal.html',
      controller: 'deleteResourceModal',
      size: 'sm',
      resolve: {
        id: function () {
          return theGatewayId;
        },
        title: function () {
          return 'Are you sure?';
        },
        text: function () {
          return 'You are about to delete [' + theGatewayId + ']. Confirm the deletion.';
        },
        buttonText: function () {
          return 'DELETE';
        }
      }
    });

    modalInstance.result.then(function (id) {
      Api.delete('gateways', id).then(gatewayDeleted, gatewayDeletedFailed);

      function gatewayDeleted() {
        toastr.success(id + ' has been deleted.', 'Gateway deleted');
      }

      function gatewayDeletedFailed() {
        toastr.error('Gateway ' + id + ' could not be deleted', 'Gateway not deleted');
      }
    });
  }

  $interval(refresh, 5000);
}

angular
  .module('app')
  .component('readAllGateways', {
    templateUrl: 'app/readAllGateways/readAllGateways.html',
    controller: readAllGatewaysController
  });

