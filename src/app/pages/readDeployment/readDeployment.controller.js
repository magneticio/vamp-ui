'use strict';

angular.module('inspinia')
    .controller('ReadDeploymentController', function (Api, $uibModal, $scope, $timeout, $stateParams) {

        var vm = this;
        vm.instance = {};

        Api.read('deployments', $stateParams.id).then(deploymentLoaded, error);

        function deploymentLoaded(data) {
            vm.instance = data;
        }

        function error() {
            console.log('error');
        }


    });
