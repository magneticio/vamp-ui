/* global Environment */
angular
  .module('app')
  .config(pluginsConfig);

function pluginsConfig(toastrConfig, $mixpanelProvider) {
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

  $mixpanelProvider.apiKey(Environment.prototype.mixpanelApiKey());
}
angular
  .module('app')
  .run(function (editableOptions, editableThemes) {
    editableOptions.theme = 'default';
    editableThemes.default.submitTpl = '<button type="submit"><i class="fa fa-check"></i></button>';
    editableThemes.default.cancelTpl = '<button type="button"  ng-click="$form.$cancel()"><i class="fa fa-times"></i></button>';
  });
