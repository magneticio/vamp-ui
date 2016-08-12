describe('readAllWorkflows component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('readAllWorkflows', function () {
      return {
        templateUrl: 'app/readAllWorkflows.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<readAllWorkflows></readAllWorkflows>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
