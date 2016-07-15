describe('updateBlueprint component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('updateBlueprint', function () {
      return {
        templateUrl: 'app/updateBlueprint.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<updateBlueprint></updateBlueprint>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
