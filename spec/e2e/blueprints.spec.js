// Homepage
describe('\nBlueprints', function(){

	var addNewButton = element(by.css('#toolbar .add-button')),
			addArtefactForm = element(by.css('.add-artefact-box')),
			artefactTextarea = element(by.css('.add-artefact-box textarea')),
			blueprintListItem = element(by.css('#blueprints-list .list-item')),
			blueprintListItemCount = element.all(by.css('#blueprints-list .list-item')),
			deployButton = element(by.css('#blueprints-list .list-controls .button-ghost')),
			deleteButton = element.all(by.css('#blueprints-list .list-controls .button-red')).get(0);


  it('should accept a valid blueprint', function(){
  	browser.get('/#/blueprints');
  	//browser.pause();
  	browser.sleep(100).then(function(){
			expect(addNewButton.isDisplayed()).toBeTruthy();
			addNewButton.click();
		});
  	browser.sleep(500).then(function(){
			expect(artefactTextarea.isDisplayed()).toBeTruthy();
			artefactTextarea.sendKeys('{"name":"testBlueprint:1.2","endpoints":{"frontend.port":"9010/http"},"clusters":{"frontend":{"services":[{"breed":{"name":"monarch_front:0.1","deployable":"magneticio/monarch:0.1","ports":{"port":"8080/http"},"environment_variables":{"backend[BACKEND]":"http://$backend.host:$backend.ports.port/api/message"},"dependencies":{"backend":"monarch_backend:0.1"}},"routing":{"weight":50,"filters":null},"scale":{"cpu":0.5,"memory":256,"instances":1}},{"breed":{"name":"monarch_front:0.2","deployable":"magneticio/monarch:0.2","ports":{"port":"8080/http"}},"routing":{"weight":50,"filters":null},"scale":{"cpu":0.5,"memory":256,"instances":1}}]},"backend":{"services":{"breed":{"name":"monarch_backend:0.1","deployable":"magneticio/monarch:0.2","ports":{"port":"8080/http"}}}}}}');
			addArtefactForm.submit();
			browser.sleep(1000).then(function(){
				expect(artefactTextarea.isDisplayed()).toBeFalsy();
			});
  	});
  });

	it('should add new blueprints to the UI', function(){
		expect(blueprintListItemCount.count()).toBe(2);;
	});

	it('should be removed when deleted', function(){
		deleteButton.click();
		browser.sleep(100).then(function(){
			browser.switchTo().alert().accept();
			browser.sleep(500).then(function(){
				deletedBlueprint = blueprintListItemCount.get(0);
				expect(deletedBlueprint.isDisplayed()).toBeFalsy();
			});
		});
	});

	// it('should deploy a valid blueprint', function(){
	// 	deployButton.click();
	// 	browser.sleep(5000).then(function(){
			
	// 	});
	// });
});