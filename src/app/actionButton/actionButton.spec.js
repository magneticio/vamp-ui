describe('actionButton component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('actionButton', function () {
      return {
        templateUrl: 'app/actionButton.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<actionButton></actionButton>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
