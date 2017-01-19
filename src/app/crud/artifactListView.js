angular.module('app')
  .controller('listViewController', function ($scope, $element, util) {
    var $lv = this;

    $lv.getKeyValue = function (item, key) {
      var value = util.getValueByString(item, key);
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
  /* .directive('trImage', function() {
    return {
      restrict: 'A',
      scope: {
        trImage: '@',
        colspan: '<'
      },
      link: function(scope, element, attrs) {
        var demiTr = '<tr class="demi-row" ><td colspan="' + scope.colspan + '"><div style="background-image:url(\'' + scope.trImage + '\')"  >&nbsp;</div></td></tr>';
        $(element).before(demiTr);
      }
    }
  });*/
