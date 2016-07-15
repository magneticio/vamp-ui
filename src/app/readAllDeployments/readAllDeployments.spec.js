describe('readAllDeployments component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readAllDeployments', function () {
      return {
        templateUrl: 'app/readAllDeployments.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readAllDeployments></readAllDeployments>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
