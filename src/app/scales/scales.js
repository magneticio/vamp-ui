angular.module('app').controller('ScalesController', function ($scope) {
  this.scale = $scope.$parent.$parent.artifact;
  this.cpu = this.scale.cpu;
  this.instances = this.scale.instances;
  this.memory = parseInt(this.scale.memory, 10);
});
