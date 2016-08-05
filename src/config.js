angular
  .module('app')
  .config(pluginsConfig);

function pluginsConfig(toastrConfig) {
  // Configuration of the angular-toastr plugin. See: https://github.com/Foxandxss/angular-toastr
  angular.extend(toastrConfig, {
    allowHtml: false,
    closeButton: true,
    extendedTimeOut: 1000,
    progressBar: true,
    tapToDismiss: true,
    positionClass: 'toast-top-right'
  });
}
