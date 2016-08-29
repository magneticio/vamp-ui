describe('editableNumber component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('editableNumber', function () {
      return {
        templateUrl: 'app/editableNumber.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<editableNumber></editableNumber>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
