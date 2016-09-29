describe('editor component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('editor', function () {
      return {
        templateUrl: 'app/editor.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<editor></editor>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
