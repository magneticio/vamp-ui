function Popup($uibModal) {
  this.$uibModal = $uibModal;
}

Popup.prototype.openConfirmation = function (title, text, action) {
  //Open the popup
  console.log('THISSS', this);

  var modalInstance = this.$uibModal.open({
    animation: true,
    templateUrl: 'app/popup/confirmation/confirmation.html',
    controller: 'ConfirmationController',
    size: 'sm',
    resolve: {
      title: function() {return title;},
      text: function() {return text;},
      action: function() {return action;}
    }

  });

  modalInstance.result.then(function () {
    console.log('gelukt');
  }, function () {
    console.log('Modal dismissed at: ' + new Date());
  });

};

angular
  .module('app')
  .service('Popup', Popup);

