describe('createBlueprint component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('createBlueprint', function () {
      return {
        templateUrl: 'app/createBlueprint.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<createBlueprint></createBlueprint>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
