describe('liveBarChart component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('liveBarChart', function () {
      return {
        templateUrl: 'app/liveBarChart.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<liveBarChart></liveBarChart>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
