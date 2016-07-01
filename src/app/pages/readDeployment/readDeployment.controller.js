'use strict';

angular.module('inspinia')
    .controller('ReadDeploymentController', function (Api, $uibModal, $scope, $interval, $stateParams) {

        var vm = this;
        vm.instance = {};
        vm.currentHealth = 0;


        refreshDeployment();
        $interval(refreshDeployment, 5000);

        function refreshDeployment() {
          Api.read('deployments', $stateParams.id).then(deploymentLoaded, error);
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
