describe('readOneDeployment component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readOneDeployment', function () {
      return {
        templateUrl: 'app/readOneDeployment.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readOneDeployment></readOneDeployment>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
