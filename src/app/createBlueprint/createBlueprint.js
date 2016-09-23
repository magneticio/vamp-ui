function createBlueprintController($state, DataManager, $uibModal, $mixpanel) {
  var self = this;
  self.data = {};
  self.canBeParsed = true;

  self.create = create;

  $mixpanel.track('Create blueprint button clicked');

  function create(blueprintData) {
    var blueprintsResource = DataManager.resource('blueprints');
    // Check if there is a blueprint already with this name
    blueprintsResource.subscribe(currentResources).poll();
    function currentResources(blueprints) {
      blueprintsResource.unsubscribe();

      if (_.find(blueprints, {name: blueprintData.name})) {
        var blueprintExistModal = new Modal('blueprintNameExistsModal', replaceBlueprint, {name: blueprintData.name});
        blueprintExistModal.open();
      } else {
        blueprintsResource.create(blueprintData, blueprintCreated);
      }
    }

    function replaceBlueprint() {
      blueprintsResource.create(blueprintData, blueprintCreated);
    }
  }

  function blueprintCreated() {
    $mixpanel.track('New blueprint added');
    $state.go('readAllBlueprints');
  }

  function Modal(templateName, resultCallback, resolves) {
    var self = this;

    self.modalData = {
      animation: true,
      controller: templateName,
      templateUrl: 'app/' + templateName + '/' + templateName + '.html',
      size: 'md',
      resolve: {}
    };

    if (resolves) {
      for (var attribute in resolves) {
        self.modalData.resolve[attribute] = function () {
          return resolves[attribute];
        };
      }
    }

    self.open = function () {
      self.instance = $uibModal.open(self.modalData);
      self.instance.result.then(resultCallback);
    };
  }
}

angular
  .module('app')
  .component('createBlueprint', {
    templateUrl: 'app/createBlueprint/createBlueprint.html',
    controller: createBlueprintController
  });

