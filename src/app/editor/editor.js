/* global sprintf, YAML*/
function editorController() {
  var self = this;
  var defaultStatus = {
    type: 'SUCCESS',
    message: 'YAML is parsed correctly'
  };

  self.data = {};
  self.change = change;
  self.status = angular.copy(defaultStatus);
  self.canBeParsed = false;

  self.editorConfig = {
    useWrapMode: true,
    showGutter: true,
    theme: 'twilight',
    mode: 'yaml',
    firstLineNumber: 1
  };

  function change(changedSourceCode) {
    try {
      self.data = YAML.parse(changedSourceCode);
      self.status = angular.copy(defaultStatus);
      self.canBeParsed = true;
    } catch (error) {
      self.status = {
        type: 'ERROR',
        message: sprintf('Not able to parse YAML. Check that the YAML syntax is correctly formatted. Line #%s [%s]', error.parsedLine, error.snippet)
      };
      self.canBeParsed = false;
    }
  }
}

angular
  .module('app')
  .component('editor', {
    templateUrl: 'app/editor/editor.html',
    controller: editorController,
    bindings: {
      sourceCode: '@',
      data: '=',
      canBeParsed: '='

    }
  });

