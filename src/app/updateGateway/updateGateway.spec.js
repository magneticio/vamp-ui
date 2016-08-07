describe('updateGateway component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('updateGateway', function () {
      return {
        templateUrl: 'app/updateGateway.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<updateGateway></updateGateway>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
