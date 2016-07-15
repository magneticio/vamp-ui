describe('readAllBlueprints component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readAllBlueprints', function () {
      return {
        templateUrl: 'app/readAllBlueprints.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readAllBlueprints></readAllBlueprints>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
