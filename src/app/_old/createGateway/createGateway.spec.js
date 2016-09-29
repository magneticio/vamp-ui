describe('createGateway component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('createGateway', function () {
      return {
        templateUrl: 'app/createGateway.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<createGateway></createGateway>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
