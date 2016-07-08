describe('pageHeader component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('pageHeader', function () {
      return {
        templateUrl: 'app/pageHeader.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<pageHeader></pageHeader>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
