describe('Modal service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (Modal) {
    expect(Modal.getData()).toEqual(3);
  }));
});
