describe('Events service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (Events) {
    expect(Events.getData()).toEqual(3);
  }));
});
