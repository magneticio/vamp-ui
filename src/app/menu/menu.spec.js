describe('menu component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('menu', function () {
      return {
        templateUrl: 'app/menu.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<menu></menu>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
