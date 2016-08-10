describe('updateWorkflow component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('updateWorkflow', function () {
      return {
        templateUrl: 'app/updateWorkflow.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<updateWorkflow></updateWorkflow>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
