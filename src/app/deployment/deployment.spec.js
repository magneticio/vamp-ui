describe('deployment component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('deployment', function () {
      return {
        templateUrl: 'app/deployment.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<deployment></deployment>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
