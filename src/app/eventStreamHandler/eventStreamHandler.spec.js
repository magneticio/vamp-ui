describe('EventStreamHandler service', function () {
  beforeEach(module('app'));
  it('should', angular.mock.inject(function (EventStreamHandler) {
    expect(EventStreamHandler.getData()).toEqual(3);
  }));
});
