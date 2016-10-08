angular.module('app')
  .controller('BreedController', BreedController);

/** @ngInject */
function BreedController($scope) {
  this.breed = $scope.$parent.$parent.artifact;
}
