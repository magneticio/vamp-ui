/* global Environment */
angular.module('app').config(function ($logProvider, toastrConfig) {
  $logProvider.debugEnabled(Environment.prototype.debug());

  // Configuration of the angular-toastr plugin. See: https://github.com/Foxandxss/angular-toastr
  angular.extend(toastrConfig, {
    autoDismiss: true,
    timeOut: 5000,
    extendedTimeOut: 0,
    allowHtml: false,
    closeButton: true,
    tapToDismiss: true,
    positionClass: 'toast-top-right',
    preventOpenDuplicates: true
  });
});
