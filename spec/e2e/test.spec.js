describe('VAMP UI', function(){

	var optionsIcon = element(by.css('.navigation-options img')),
			optionsPane = element(by.css('.options-pane')),
			apiUrlField = element(by.css('[name=vamp_uri]')),
			welcomeMessage = element(by.css('.options-form h3'));

	var addNewButton = element(by.css('#toolbar .add-button')),
			addArtefactForm = element(by.css('.add-artefact-box')),
			artefactTextarea = element(by.css('.add-artefact-box textarea'));

	var blueprintListItem = element(by.css('#blueprints-list .list-item')),
			deployButton = element(by.css('#blueprints-list .list-controls .button-ghost'));

  it('should have a title', function(){
    browser.get('/');
    expect(browser.getTitle()).toEqual('Vamp');
  });

  it('starts up correctly', function(){
    optionsIcon.click();
    browser.sleep(100).then(function(){
			expect(optionsPane.isDisplayed()).toBeTruthy();
      expect(welcomeMessage.getText()).toEqual("Hi, I'm Vamp! How are you?");
    });
	});

  // it('should accept a valid blueprint', function(){
  // 	browser.get('/');
		// expect(addNewButton.isDisplayed()).toBeTruthy();
		// addNewButton.click();
  // 	browser.sleep(500).then(function(){
		// 	expect(artefactTextarea.isDisplayed()).toBeTruthy();
		// 	artefactTextarea.sendKeys('{"name":"testBlueprint:1.2","endpoints":{"frontend.port":"9010/http"},"clusters":{"frontend":{"services":[{"breed":{"name":"monarch_front:0.1","deployable":"magneticio/monarch:0.1","ports":{"port":"8080/http"},"environment_variables":{"backend[BACKEND]":"http://$backend.host:$backend.ports.port/api/message"},"dependencies":{"backend":"monarch_backend:0.1"}},"routing":{"weight":50,"filters":null},"scale":{"cpu":0.5,"memory":256,"instances":1}},{"breed":{"name":"monarch_front:0.2","deployable":"magneticio/monarch:0.2","ports":{"port":"8080/http"}},"routing":{"weight":50,"filters":null},"scale":{"cpu":0.5,"memory":256,"instances":1}}]},"backend":{"services":{"breed":{"name":"monarch_backend:0.1","deployable":"magneticio/monarch:0.2","ports":{"port":"8080/http"}}}}}}');
		// 	addArtefactForm.submit();
		// 	browser.sleep(1000).then(function(){
		// 		expect(artefactTextarea.isDisplayed()).toBeFalsy();
		// 		expect(blueprintListItem.isDisplayed()).toBeTruthy();
		// 	});
  // 	});
  // });

// it('should deploy a valid blueprint', function(){
// 		deployButton.click();
//   	browser.sleep(5000).then(function(){
			
//   	});
//   });
  

	describe('Test', function() {     

    it('successfully makes ajax call and renders correctly', function() {

    	var errorMessage = element(by.css('.container-status-message.error-status-message'));
      browser.get('/');
      expect(errorMessage.isDisplayed()).toBeFalsy();
    
	  });
	});

});