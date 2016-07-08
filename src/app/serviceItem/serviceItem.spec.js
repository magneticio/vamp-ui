describe('serviceItem component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('serviceItem', function () {
      return {
        templateUrl: 'app/serviceItem.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<serviceItem></serviceItem>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
