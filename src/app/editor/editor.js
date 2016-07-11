function editorController(Action) {
  var defaultStatus = {
    type: 'SUCCESS',
    message: 'YAML is parsed correctly'
  };

  var self = this;
  self.actionBusy = false;
  self.change = change;
  self.status = angular.copy(defaultStatus);



  self.editorConfig = {
    useWrapMode: true,
    showGutter: true,
    theme: 'twilight',
    mode: 'yaml',
    firstLineNumber: 1,
  }

  self.actions = [];

  self.sourceCode = '#type your code here';
  self.data = {};

  self.mainAction = Action.createAsync(self.action.text, function() {
    self.action.onClick(self.data);
  }, self.action.icon);

  self.actions.push(self.mainAction);

  function change(changedSourceCode) {
    try {
      self.data = YAML.parse(changedSourceCode);
      self.status = angular.copy(defaultStatus);
    }
    catch (error) {
      self.status = {
        type: 'ERROR',
        message: sprintf('Not able to parse YAML. Check that the YAML syntax is correctly formatted. Line #%s [%s]', error.parsedLine, error.snippet)
      }
    }
  }
}

angular
  .module('app')
  .component('editor', {
    templateUrl: 'app/editor/editor.html',
    controller: editorController,
    bindings: {
      title: '@',
      titleAddition: '@',
      action: '<'
    }
  });

