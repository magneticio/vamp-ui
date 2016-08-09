/* global sprintf*/
function Modal() {
}

Modal.prototype.create = function (templateName, resolves) {
  // Creating resolve functions UIModal needs
  var resolveFunctions = {};

  function createResolveFunction(text) {
    return function () {
      return text;
    };
  }

  for (var resolveKey in resolves) {
    if (resolveKey) {
      resolveFunctions[resolveKey] = createResolveFunction(resolves[resolveKey]);
    }
  }

  // Create the config object of the modal
  var templateConfig = {
    animation: true,
    templateUrl: sprintf('app/%s/%s.html', templateName, templateName),
    controller: templateName,
    size: 'sm',
    resolve: resolveFunctions
  };

  return templateConfig;
};

angular
  .module('app')
  .service('Modal', Modal);

