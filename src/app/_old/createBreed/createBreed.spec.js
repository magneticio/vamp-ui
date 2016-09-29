describe('createBreed component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('createBreed', function () {
      return {
        templateUrl: 'app/createBreed.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<createBreed></createBreed>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
