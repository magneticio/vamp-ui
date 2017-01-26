function ArtifactController($scope) {
  var $ctrl = this;

  $ctrl.artifact = $scope.artifact;
  $ctrl.kind = $ctrl.artifact.kind;
}

ArtifactController.$inject = ['$scope'];
angular.module('app').controller('ArtifactController', ArtifactController);

angular.module('app').factory('artifact', ['$vamp', function ($vamp) {
  return new ArtifactService($vamp);
}]);

function ArtifactService($vamp) {
  this.editor = {
    useWrapMode: false,
    showGutter: true,
    theme: 'vamp',
    mode: 'yaml',
    firstLineNumber: 1,
    maxLines: Infinity,
    useSoftTabs: true,
    advanced: {
      tabSize: 2
    },
    onLoad: function (editor) {
      editor.focus();
      editor.$blockScrolling = 'Infinity';

      var heightUpdateFunction = function () {
          // http://stackoverflow.com/questions/11584061/
        var minHeight = 40 * editor.renderer.lineHeight;
        var newHeight =
                    editor.getSession().getScreenLength() *
                    editor.renderer.lineHeight +
                    editor.renderer.scrollBar.getWidth();

        newHeight = newHeight < minHeight ? minHeight : newHeight;
        $('#editor').height(newHeight.toString() + "px");
        $('#editor-section').height(newHeight.toString() + "px");

          // This call is required for the editor to fix all of
          // its inner structure for adapting to a change in size
        editor.resize();
      };

      // Set initial size to match initial content
      heightUpdateFunction();

      // Whenever a change happens inside the ACE editor, update
      // the size again
      editor.getSession().on('change', heightUpdateFunction);
    }
  };

  this.validate = _.throttle(function (path, data, validation) {
    if (validation && data && path) {
      $vamp.put(path, data, {validate_only: true}, 'JSON');
    }
  }, 500, {trailing: true, leading: false});

  this.transformErrorMessage = function (message) {
    var index = message.indexOf('Unexpected in DSL: ');
    if (index === 0) {
      var json = JSON.parse(message.substring('Unexpected in DSL: '.length));
      return 'Unexpected in DSL:\n' + JSON.stringify(json, null, 2);
    }
    return message.split('. ').join('.\n');
  };
}
