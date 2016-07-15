describe('readOneGateway component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readOneGateway', function () {
      return {
        templateUrl: 'app/readOneGateway.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readOneGateway></readOneGateway>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
