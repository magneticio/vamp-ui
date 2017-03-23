/* global Environment */
/* eslint camelcase: ["error", {properties: "never"}] */
angular.module('vamp-ui')
  .config(function ($mixpanelProvider) {
    if (Environment.prototype.mixpanel()) {
      $mixpanelProvider.apiKey(Environment.prototype.mixpanel());
    }
  })
  .factory('$analytics', ['$injector', '$rootScope', '$log', function ($injector, $rootScope, $log) {
    return new Analytics($injector, $rootScope, $log);
  }])
  .run(['$analytics', function ($analytics) {
    if (Environment.prototype.mixpanel()) {
      $analytics.run();
    }
  }]);

function Analytics($injector, $rootScope, $log) {
  var $this = this;
  var $mixpanel;
  var info = {};

  this.run = function () {
    $mixpanel = $injector.get('$mixpanel');

    $rootScope.$on('/info', function (event, data) {
      data = data.data;
      if (!data.container_driver) {
        return;
      }
      info.uuid = data.uuid;
      info.version = data.version;
      info.ui_version = Environment.prototype.version();
      info.container_driver = data.container_driver.type;
      info.key_value_store = data.key_value.type;
      info.persistence = data.persistence.database.type === 'key-value' ? data.key_value.type : data.persistence.database.type;

      if ($mixpanel) {
        $mixpanel.identify(info.uuid);
        $mixpanel.people.set({
          $distinct_id: info.uuid
        });
      }
    });

    $rootScope.$on('/events/stream', function (e, response) {
      if (_.includes(response.data.tags, 'archive')) {
        var type;
        var archive;
        _.forEach(response.data.tags, function (tag) {
          if (!type && tag.indexOf(':') === -1 && tag.indexOf('-') === -1 && tag !== 'archive') {
            type = tag;
          }
          if (!archive && tag.indexOf('archive:') === 0) {
            archive = tag.substring('archive:'.length);
          }
        });
        if (archive && type) {
          $this.track(type + ':' + archive);
        }
      }
    });
  };

  this.track = function (event) {
    if ($mixpanel) {
      $mixpanel.track(event, info);
      $log.debug('mixpanel: ' + JSON.stringify({event: event, info: info}));
    }
  };
}
