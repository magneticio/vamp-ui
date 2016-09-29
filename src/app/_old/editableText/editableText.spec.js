describe('editableText component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('editableText', function () {
      return {
        templateUrl: 'app/editableText.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<editableText></editableText>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
