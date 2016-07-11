describe('Action service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (Action) {
    expect(Action.getData()).toEqual(3);
  }));
});
