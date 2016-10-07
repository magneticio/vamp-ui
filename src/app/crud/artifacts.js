angular.module('app').component('artifacts', {
  restrict: 'E',
  controller: ArtifactsController,
  templateUrl: 'app/crud/artifacts.html'
});

function ArtifactsController($rootScope, $location, $attrs, vamp) {
  var $ctrl = this;

  this.kind = $attrs.kind;
  this.artifacts = [];

  var path = '/' + this.kind;

  vamp.peek(path);

  $rootScope.$on('vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      vamp.peek(path);
    }
  });

  $rootScope.$on(path, function (e, response) {
    $ctrl.artifacts = response.data;
  });

  // view

  this.view = function (artifact) {
    $location.path($ctrl.kind + '/view/' + artifact.name);
  };

  // selections

  this.selected = [];

  this.toggleSelection = function () {
    var all = $ctrl.isSelectedAll();
    $ctrl.selected.length = 0;
    if (!all) {
      _.forEach($ctrl.artifacts, function (a) {
        $ctrl.selected.push(a);
      });
    }
  };

  this.isSelectedAll = function () {
    return $ctrl.artifacts.length > 0 && $ctrl.artifacts.length === $ctrl.selected.length;
  };

  this.isSelected = function (artifact) {
    return _.find($ctrl.selected, function (a) {
      return a.name === artifact.name;
    });
  };

  this.updateSelection = function ($event, artifact) {
    $event.stopPropagation();
    _.remove($ctrl.selected, function (a) {
      return a.name === artifact.name;
    });
    if ($event.target.checked) {
      $ctrl.selected.push(artifact);
    }
  };
}
