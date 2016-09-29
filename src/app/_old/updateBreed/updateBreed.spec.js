describe('updateBreed component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('updateBreed', function () {
      return {
        templateUrl: 'app/updateBreed.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<updateBreed></updateBreed>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
