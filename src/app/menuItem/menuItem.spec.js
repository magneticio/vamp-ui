describe('menuItem component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('menuItem', function () {
      return {
        templateUrl: 'app/menuItem.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<menuItem></menuItem>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
