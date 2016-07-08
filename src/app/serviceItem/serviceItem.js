function serviceItemController() {
  console.log('Service data', this.serviceData);
}

angular
  .module('app')
  .component('serviceItem', {
    templateUrl: 'app/serviceItem/serviceItem.html',
    controller: serviceItemController,
    bindings: {
      serviceData: '<'
    }
  });

