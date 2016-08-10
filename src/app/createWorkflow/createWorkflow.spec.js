describe('createWorkflow component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('createWorkflow', function () {
      return {
        templateUrl: 'app/createWorkflow.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<createWorkflow></createWorkflow>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
