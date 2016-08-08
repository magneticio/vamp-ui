describe('DataManager service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (DataManager) {
    expect(DataManager.getData()).toEqual(3);
  }));
});
