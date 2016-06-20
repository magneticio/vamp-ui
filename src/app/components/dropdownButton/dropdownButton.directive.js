(function() {
  'use strict';

  angular
    .module('revampUi')
    .directive('dropdownButton', DropdownButton);

  /** @ngInject */
  function DropdownButton() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/dropdownButton/dropdownButton.html',
      scope: {
          options: '='
      },
      controller: DropdownButtonController,
      controllerAs: 'vm',
      bindToController: true,
      replace: true
    };

    return directive;

    /** @ngInject */
    function DropdownButtonController($scope, $http, $interval) {
      var vm = this;
      vm.dropdownActive = false;
      vm.toggleDropdown = toggleDropdown;
      vm.selectedOptionKey = undefined;
      vm.selectedOption = {};
      vm.dropdownOptions = {};
      vm.clickedFromDropdown = clickedFromDropdown;



      $scope.$watch('vm.options', optionsChanged(vm.options), true);

      function optionsChanged(options) {
        //First transform the array to an object
        for (var i = 0; i < options.length; i++) {
          var key = 'Option-' + i;
          var option = options[i];

          vm.dropdownOptions[key] = option;

          if((!vm.selectedOptionKey || vm.selectedOptionKey === '') && option.default) {
            setSelected(key);
          }
        }
      }

      function setSelected(key) {

        var currentSelected = vm.selectedOption;
        var currentSelectedKey = vm.selectedOptionKey;

        vm.selectedOption = {};
        vm.selectedOptionKey = undefined;

        vm.selectedOption = vm.dropdownOptions[key];
        vm.selectedOptionKey = key;

        delete vm.dropdownOptions[key];

        if(currentSelected && !_.isEmpty(currentSelected)) {
          vm.dropdownOptions[currentSelectedKey] = currentSelected;
        } 
      }

      function toggleDropdown() {
        vm.dropdownActive = !vm.dropdownActive;
      }

      function clickedFromDropdown(key, option) {
        option.onClick();
        setSelected(key);
        toggleDropdown();
      }
    }
  }

})();
