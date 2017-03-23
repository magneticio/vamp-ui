function workflowWebPortService() {
  this.webport = {
    url: null
  };

  this.selectPort = function (path) {
    this.webport.url = path;
  };

  this.clearSelected = function () {
    this.webport.url = null;
  };
}

angular.module('vamp-ui').service('workflowWebPortService', workflowWebPortService);
