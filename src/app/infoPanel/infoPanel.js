/* global Environment */
function infoPanelController(Api, $rootScope) {
  var self = this;

  $rootScope.$watch('infoPanelActive', function (newValue) {
    self.infoPanelActive = newValue;
  });

  Api.readAll('info').then(infoLoaded, infoLoadedFailed);

  function infoLoaded(response) {
    /* eslint camelcase: ["error", {properties: "never"}]*/
    var data = response.data;
    var info = {};
    info.message = data.message;
    info.running_since = data.running_since;
    info.version = data.version;
    info.ui_version = Environment.prototype.version();
    info.persistence = data.persistence.database.type;
    info.key_value_store = data.key_value.type;
    info.gateway_driver = 'haproxy ' + data.gateway_driver.marshaller.haproxy;
    info.container_driver = data.container_driver.type;
    info.workflow_driver = '';

    for (var name in data.workflow_driver) {
      if (name) {
        info.workflow_driver += info.workflow_driver === '' ? name : ', ' + name;
      }
    }

    self.info = info;
  }

  function infoLoadedFailed() {

  }
}

angular
  .module('app')
  .component('infoPanel', {
    templateUrl: 'app/infoPanel/infoPanel.html',
    controller: infoPanelController
  });

