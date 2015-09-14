// Options pane
describe('\nOptions pane', function(){

  var optionsIcon = element(by.css('.navigation-options img')),
			optionsPane = element(by.css('.options-pane')),
			optionsForm = element(by.css('.options-form')),
			apiUrlField = element(by.css('[name=vamp_uri]')),
			welcomeMessage = element(by.css('.options-form h3')),
			errorMessage = element(by.css('.container-status-message.error-status-message'));

  it('should show the welcome message', function(){
  	browser.get('/');
    optionsIcon.click();
    browser.sleep(100).then(function(){
			expect(optionsPane.isDisplayed()).toBeTruthy();
      expect(welcomeMessage.getText()).toEqual("Hi, I'm Vamp! How are you?");
    });
	});

	it('should be able to change the API endpoint URI', function(){
		apiUrlField.clear();
		apiUrlField.sendKeys('http://localhost:1212');
		optionsForm.submit();
	});

	it('should display an error message when endpoint is unreachable', function(){
		expect(errorMessage.isDisplayed()).toBeTruthy();
	});

	it('should dismiss the error when enpoint responds', function(){
		apiUrlField.clear();
		apiUrlField.sendKeys('http://localhost:4000');
		optionsForm.submit();
		optionsIcon.click();
		browser.sleep(500).then(function(){
			expect(errorMessage.isDisplayed()).toBeFalsy();
		});
	});
});