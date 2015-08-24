describe('VAMP UI', function(){

	var optionsIcon = element(by.css('.navigation-options img')),
			optionsPane = element(by.css('.options-pane')),
			welcomeMessage = element(by.css('.options-form h3'));

	var addNewButton = element(by.css('#toolbar .add-button')),
			addArtefactForm = element(by.css('.add-artefact-box')),
			artefactTextarea = element(by.css('.add-artefact-box textarea'));

  it('should have a title', function(){
    browser.get('http://192.168.59.103:8080');
    expect(browser.getTitle()).toEqual('Vamp');
  });

  it('starts up correctly', function(){
    optionsIcon.click();
    browser.sleep(100).then(function(){
			expect(optionsPane.isDisplayed()).toBeTruthy();
      expect(welcomeMessage.getText()).toEqual("Hi, I'm Vamp! How are you?");
    });
	});

  it('should accept a valid blueprint', function(){
  	browser.get('http://192.168.59.103:8080/#/blueprints');
		expect(addNewButton.isDisplayed()).toBeTruthy();
		addNewButton.click();
  	browser.sleep(500).then(function(){
			expect(artefactTextarea.isDisplayed()).toBeTruthy();
			artefactTextarea.sendKeys('{"name":"monarchs:1.2","endpoints":{"frontend.port":"9010/http"},"clusters":{"frontend":{"services":[{"breed":{"name":"monarch_front:0.1","deployable":"magneticio/monarch:0.1","ports":{"port":"8080/http"},"environment_variables":{"backend[BACKEND]":"http://$backend.host:$backend.ports.port/api/message"},"dependencies":{"backend":"monarch_backend:0.1"}},"routing":{"weight":50,"filters":null},"scale":{"cpu":0.5,"memory":256,"instances":1}},{"breed":{"name":"monarch_front:0.2","deployable":"magneticio/monarch:0.2","ports":{"port":"8080/http"}},"routing":{"weight":50,"filters":null},"scale":{"cpu":0.5,"memory":256,"instances":1}}]},"backend":{"services":{"breed":{"name":"monarch_backend:0.1","deployable":"magneticio/monarch:0.2","ports":{"port":"8080/http"}}}}}}');
			addArtefactForm.submit();
			browser.sleep(2000).then(function(){
				expect(artefactTextarea.isDisplayed()).toBeFalsy();
			});
  	});
  });

});