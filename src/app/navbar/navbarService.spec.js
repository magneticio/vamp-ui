describe('NavbarService service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (NavbarService) {
    expect(NavbarService.getData()).toEqual(3);
  }));
});
