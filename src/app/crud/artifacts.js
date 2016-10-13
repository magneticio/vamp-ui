angular.module('app').component('artifacts', {
  restrict: 'E',
  controller: ArtifactsController,
  templateUrl: 'app/crud/artifacts.html',
  transclude: {
    body: '?div'
  }
});

function ArtifactsController($scope, $filter, $location, $attrs, toastr, alert, $vamp) {
  var $ctrl = this;

  this.kind = $attrs.kind;
  this.artifacts = [];

  var path = '/' + this.kind;

  this.peek = function () {
    $vamp.peek(path);
  };

  this.peek();

  $scope.$on('$vamp:connection', function (e, connection) {
    if (connection === 'opened') {
      $ctrl.peek();
    }
  });

  $scope.$on(path, function (e, response) {
    $ctrl.artifacts = _.sortBy(response.data, ['name']);
  });

  $scope.$on('/events/stream', function (e, response) {
    if ((_.includes(response.data.tags, 'archive') ||
      _.includes(response.data.tags, 'deployed') ||
      _.includes(response.data.tags, 'undeployed')) && _.includes(response.data.tags, $ctrl.kind)) {
      $ctrl.peek();
    }
  });

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

  this.isSelectedAny = function () {
    return $ctrl.selected.length > 0;
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

  // operations

  this.add = function () {
    $location.path($ctrl.kind + '/add');
  };

  this.view = function (artifact) {
    $location.path($ctrl.kind + '/view/' + $filter('encodeName')(artifact.name));
  };

  this.deleteSelected = function () {
    var names = _.map(_.sortBy($ctrl.selected, ['name']), function (a) {
      return a.name;
    });

    var bracketNames = _.map(names, function (name) {
      return '\'' + name + '\'';
    });

    if ($ctrl.isSelectedAny()) {
      alert.show('Warning', 'Are you sure you want to delete: ' + bracketNames.join(', ') + '?', 'Delete', 'Cancel', function () {
        $ctrl.selected.length = 0;

        _.forEach(names, function (name) {
          $vamp.await(function () {
            var artifact = _.find($ctrl.artifacts, function (artifact) {
              return artifact.name === name;
            });
            $vamp.remove(path + '/' + name, angular.toJson(artifact));
          }).then(function () {
            toastr.success('\'' + name + '\' has been successfully deleted.');
          }).catch(function (response) {
            if (response) {
              toastr.error(response.data.message, 'Deletion of \'' + name + '\' failed.');
            } else {
              toastr.error('Server timeout.', 'Deletion of \'' + name + '\' failed.');
            }
          });
        });
      });
    }
  };
}
