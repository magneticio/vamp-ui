describe('IntervalManager service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (IntervalManager) {
    expect(IntervalManager.getData()).toEqual(3);
  }));
});
