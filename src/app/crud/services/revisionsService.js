function revisionsService() {
  this.revisions = [];
  this.activeRevision = {};

  this.selectRevision = function (id) {
    var index = _.findIndex(this.revisions, {'id' : id});

    if (index > -1) {
      angular.copy(this.revisions[index], this.activeRevision);
    }
  };

  this.clearSelected = function () {
    angular.copy({}, this.activeRevision);
  };

  this.addRevision = function (event) {
    if (_.find(this.revisions, {id: event.id})) {
      return;
    }

    var source = event.value || '';
    if (source) {
      source = JSON.parse(source);
      try {
        source = JSON.stringify(JSON.parse(source), null, '  ');
      } catch (e) {
        source = event.value.replace(/\\n/g, '\n');
        source = source.replace(/\\"/g, '"');
        if (source.charAt(0) === '"') {
          source = source.substring(1);
        }
        if (source.charAt(source.length - 1) === '"') {
          source = source.substring(0, source.length - 1);
        }
      }
    }

    this.revisions.push({
      id: event.id,
      source: source,
      timestamp: event.timestamp
    });
  };

  this.clearRevisions = function () {
    this.revisions = [];
    this.clearSelected();
  };
}

angular.module('app').service('revisionsService', revisionsService);
