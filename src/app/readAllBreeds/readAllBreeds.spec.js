describe('readAllBreeds component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readAllBreeds', function () {
      return {
        templateUrl: 'app/readAllBreeds.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readAllBreeds></readAllBreeds>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
