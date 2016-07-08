function deploymentController($scope, Api) {
  var self = this;

  self.text = 'test';

  self.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  self.series = ['Health'];

  self.data = [
    [65, 59, 80, 81, 56, 55, 20]
  ];

  // setInterval(getRandom, 2000);

  // // function getRandom() {
  // //   self.labels.push('test');
  // //   self.data[0].push(Math.floor(Math.random() * 300));
  // //   console.log(self.data[0]);
  // //   self.text += 's';
  // // }

  Api.read('deployments', 'sava:1.2').then(success);

  function success(data) {
    self.deployment = data;
  }
}

angular
  .module('app')
  .component('deployment', {
    templateUrl: 'app/deployment/deployment.html',
    controller: deploymentController
  });

