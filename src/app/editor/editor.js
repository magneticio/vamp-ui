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
    onLoad: aceLoaded,
    onChange: aceChanged
  }
  self.actions = [];

  self.sourceCode = '#type your code here';
  self.data = {};

  self.mainAction = Action.create(self.action.text, function() {
    self.action.onClick(self.sourceCode);
  }, self.action.icon);
  self.actions.push(self.mainAction);

  function change(changedSourceCode) {
    try {
      self.data = YAML.parse(changedSourceCode);
      self.status = angular.copy(defaultStatus);
    }
    catch (error) {
      console.log(error);

      self.status = {
        type: 'ERROR',
        message: sprintf('Not able to parse YAML. Check that the YAML syntax is correctly formatted. Line #%s [%s]', error.parsedLine, error.snippet)
      }
    }
  }



  function aceLoaded() {

  }

  function aceChanged(e) {

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

