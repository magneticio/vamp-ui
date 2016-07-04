'use strict';

angular.module('inspinia')
    .controller('ReadAllGatewaysController', function (Api, $uibModal, $scope, $timeout) {

        var vm = this;
        vm.list = [];
        vm.deleteGateway = deleteGateway;

        refreshGatways();
        setInterval(refreshGatways, 10000);
        
        function refreshGatways() {
            Api.readAll('gateways').then(success, error);
        }

        function success(data) {
            vm.list = data;
        }

        function error(data) {
            console.log(error);
        }

        function deleteGateway(id) {
            var deleteGatewayModalConfig = {
              templateUrl: 'app/pages/readAllGateways/deleteGateway.modal.html',
              controller: 'DeleteGatewayModalController as deleteGateway',
              resolve: {
                id: function() {
                  return id;
                }
              }
            }

            //Open the modal
            var blueprintModalInstance = $uibModal.open(deleteGatewayModalConfig);
        }
    });
