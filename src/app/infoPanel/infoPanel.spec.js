describe('infoPanel component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('infoPanel', function () {
      return {
        templateUrl: 'app/infoPanel.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<infoPanel></infoPanel>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
