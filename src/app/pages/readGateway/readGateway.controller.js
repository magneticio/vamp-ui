'use strict';

angular.module('inspinia')
    .controller('ReadGatewayController', function (Api, $uibModal, $scope, $interval, $stateParams) {

        var vm = this;
        vm.instance = {};
        vm.currentHealth = 0;


        refreshGateway();
        $interval(refreshGateway, 5000);

        function refreshGateway() {
          Api.read('gateways', $stateParams.id).then(deploymentLoaded, error);
        }


        function deploymentLoaded(data) {
            vm.instance = data;
        }

        function error() {
            console.log('error');
        }


        $interval(function() {
          vm.currentHealth = Math.floor(Math.random()*100);
        }, 3000);
    });
