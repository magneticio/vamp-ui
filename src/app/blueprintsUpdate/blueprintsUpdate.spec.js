describe('blueprintsUpdate component', function () {
  beforeEach(module('app', function ($provide) {
    $provide.factory('blueprintsUpdate', function () {
      return {
        templateUrl: 'app/blueprintsUpdate.html'
      };
    });
  }));

  it('should...', angular.mock.inject(function ($rootScope, $compile) {
    var element = $compile('<blueprintsUpdate></blueprintsUpdate>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
