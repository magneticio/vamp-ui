'use strict';

angular.module('inspinia')
    .controller('ReadAllDeploymentsController', function (Api, $uibModal, $scope, $timeout) {

        var vm = this;
        vm.list = [];
        vm.createDeployment = createDeployment;
        vm.undeploy = undeploy;
        vm.busyUndeploying = false;

        refreshDeployments();
        setInterval(refreshDeployments, 10000);
        
        function refreshDeployments() {
            Api.readAll('deployments').then(success, error);
        }

        function success(data) {
            vm.list = data;
        }

        function error(data) {
            console.log(error);
        }

        function undeploy(id) {
            vm.busyUndeploying = true;

            //Get deployment as blueprint
            Api.read('deployments', id, {'as_blueprint': true}).then(blueprintGenerated, error);

            function blueprintGenerated(blueprint) {
                Api.delete('deployments', id, blueprint).then(undeployed, error);

            }

            function undeployed(data) {
                $timeout(function(){
                    vm.busyUndeploying = false;
                    refreshDeployments();
                }, 2000);
            }
            
        }

        function error(data) {
            vm.busyUndeploying = false;
        }

        function createDeployment() {
          var createDeploymentModalConfig = {
            templateUrl: 'app/pages/readAllDeployments/createDeployment.modal.html',
            controller: 'CreateDeploymentModalController as createDeployment',
            // resolve: {
            //     id: function () {
            //         return id;
            //     }
            // }
          }

          var modalInstance = $uibModal.open(createDeploymentModalConfig);
        }

        // function deleteBlueprint(id) {
        //     var modalInstance = $uibModal.open({
        //         templateUrl: 'app/pages/readAllDeployments/deleteBlueprint.modal.html',
        //         controller: 'DeleteBlueprintModalController as deleteBlueprint',
        //         resolve: {
        //             id: function () {
        //                 return id;
        //             }
        //         }
        //     });

        //     //Refresh the list when the blueprint is removed.
        //     modalInstance.result.then(function() {
        //         console.log('test');
        //         refreshDeployments();
        //     });
        // }

    });
