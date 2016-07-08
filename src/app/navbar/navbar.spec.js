describe('navbar component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('navbar', function () {
      return {
        templateUrl: 'app/navbar.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<navbar></navbar>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
