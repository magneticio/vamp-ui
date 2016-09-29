describe('readAllGateways component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readAllGateways', function () {
      return {
        templateUrl: 'app/readAllGateways.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readAllGateways></readAllGateways>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
