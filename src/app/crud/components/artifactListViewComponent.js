angular.module('app')
  .controller('listViewController', function ($scope, $element, util, interpolateFilter) {
    var $ctrl = this;

    $ctrl.getKeyValue = function (item, key) {
      var value = util.getValueByString(item, key);
      return value;
    };

    $ctrl.getArrayTypeValue = function (item, field, context) {
      var value = (item[field.valuePath] || item);

      if (field.expression) {
        value = interpolateFilter(field.expression, context);
      }

      return value;
    };

    $ctrl.onItemClick = function (item) {
      $ctrl.artifactsCtrl.view(item);
    };

    $ctrl.performAction = function (action, artifact, $event) {
      $event.stopPropagation();

      $ctrl.artifactsCtrl[action](artifact, $event);
    };
  })
  .component('artifactListView', {
    bindings: {
      items: '<',
      artifactsMetadata: '<',
      artifactsCtrl: '<'
    },
    templateUrl: 'app/crud/templates/listView.html',
    controller: 'listViewController',
    controllerAs: '$ctrl'
  });
