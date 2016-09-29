describe('updateDeployment component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('updateDeployment', function () {
      return {
        templateUrl: 'app/updateDeployment.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<updateDeployment></updateDeployment>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
