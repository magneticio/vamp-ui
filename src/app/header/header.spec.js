describe('header component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('header', function () {
      return {
        templateUrl: 'app/header.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<header></header>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
