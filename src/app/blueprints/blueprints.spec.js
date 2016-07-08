describe('blueprints component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('blueprints', function () {
      return {
        templateUrl: 'app/blueprints.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<blueprints></blueprints>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
