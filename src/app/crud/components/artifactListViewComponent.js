angular.module('app')
  .controller('listViewController', function ($scope, $element, util, interpolateFilter) {
    var $lv = this;

    $lv.getKeyValue = function (item, key) {
      var value = util.getValueByString(item, key);
      return value;
    };

    $lv.getArrayTypeValue = function (item, field, context) {
      var value = (item[field.valuePath] || item);

      if (field.expression) {
        value = interpolateFilter(field.expression, context);
      }

      return value;
    };

    $lv.onItemClick = function (item) {
      $lv.artifactsCtrl.view(item);
    };

    $lv.performAction = function (action, artifact, $event) {
      $event.stopPropagation();

      $lv.artifactsCtrl[action](artifact, $event);
    };
  })
  .component('artifactListView', {
    bindings: {
      items: '<',
      artifactData: '<',
      artifactsCtrl: '<'
    },
    templateUrl: 'app/crud/templates/listView.html',
    controller: 'listViewController',
    controllerAs: '$lv'
  });
