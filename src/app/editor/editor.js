function editorController() {
  this.text = 'My brand new component!';
}

angular
  .module('app')
  .component('editor', {
    templateUrl: 'app/editor/editor.html',
    controller: editorController
  });

