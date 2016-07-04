'use strict';

angular.module('inspinia')
    .controller('ReadAllGatewaysController', function (Api, $uibModal, $scope, $timeout) {

        var vm = this;
        vm.list = [];

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
    });
