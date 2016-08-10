angular
  .module('app')
  .config(pluginsConfig);

function pluginsConfig(toastrConfig) {
  // Configuration of the angular-toastr plugin. See: https://github.com/Foxandxss/angular-toastr
  angular.extend(toastrConfig, {
    autoDismiss: false,
    allowHtml: false,
    closeButton: true,
    extendedTimeOut: 1000,
    progressBar: false,
    tapToDismiss: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true
  });
}
