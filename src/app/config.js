/* global Environment */
angular.module('vamp-ui').config(function ($logProvider, $compileProvider, toastrConfig, $uibTooltipProvider) {
  $logProvider.debugEnabled(Environment.prototype.debug());
  $compileProvider.debugInfoEnabled(Environment.prototype.debug());

  $uibTooltipProvider.options({
    appendToBody: true
  });

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
