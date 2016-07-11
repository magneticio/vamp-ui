describe('blueprintsCreate component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('blueprintsCreate', function () {
      return {
        templateUrl: 'app/blueprintsCreate.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<blueprintsCreate></blueprintsCreate>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
