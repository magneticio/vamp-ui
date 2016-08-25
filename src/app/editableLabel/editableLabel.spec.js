describe('editableLabel component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('editableLabel', function () {
      return {
        templateUrl: 'app/editableLabel.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<editableLabel></editableLabel>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
