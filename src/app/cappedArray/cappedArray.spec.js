describe('CappedArray service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (CappedArray) {
    expect(CappedArray.getData()).toEqual(3);
  }));
});
