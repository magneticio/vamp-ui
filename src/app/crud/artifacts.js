angular.module('app').component('artifacts', {
  restrict: 'E',
  controller: ArtifactsController,
  templateUrl: 'app/crud/artifacts.html'
});

function ArtifactsController($rootScope, $attrs, vamp) {
  var self = this;

  this.kind = $attrs.kind;
  this.artifacts = [];

  $rootScope.$on('vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      vamp.peek('/' + self.kind);
    }
  });

  $rootScope.$on('/' + this.kind, function (e, artifacts) {
    self.artifacts = artifacts;
  });

  // selections

  this.selected = [];

  this.toggleSelection = function () {
    var all = self.isSelectedAll();
    self.selected.length = 0;
    if (!all) {
      _.forEach(self.artifacts, function (a) {
        self.selected.push(a);
      });
    }
  };

  this.isSelectedAll = function () {
    return self.artifacts.length === self.selected.length;
  };

  this.isSelected = function (artifact) {
    return _.find(self.selected, function (a) {
      return a.name === artifact.name;
    });
  };

  this.updateSelection = function ($event, artifact) {
    _.remove(self.selected, function (a) {
      return a.name === artifact.name;
    });
    if ($event.target.checked) {
      self.selected.push(artifact);
    }
  };
}
