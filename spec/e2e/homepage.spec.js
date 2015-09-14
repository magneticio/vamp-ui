// Homepage
describe('\nVamp Homepage', function(){

	var	errorMessage = element(by.css('.container-status-message.error-status-message'));

  it('should have a title', function(){
    browser.get('/');
    expect(browser.getTitle()).toEqual('Vamp');
  });

	it('successfully makes ajax call', function() {
    expect(errorMessage.isDisplayed()).toBeFalsy();
  });
});