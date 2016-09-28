describe('readAllEvents component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readAllEvents', function () {
      return {
        templateUrl: 'app/readAllEvents.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readAllEvents></readAllEvents>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
