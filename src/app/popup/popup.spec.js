describe('Popup service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (Popup) {
    expect(Popup.getData()).toEqual(3);
  }));
});
