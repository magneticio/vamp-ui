// Homepage
describe('\nDeployments', function(){

	var deploymentListItem = element.all(by.css('#deployments-list .list-item')),
			deploymentLink = element.all(by.css('.item-link')).get(0),
			editButton = element.all(by.css('#toolbar .button-pink')).get(0),
			inputBox = element(by.css('.edit-deployment-box .inputfield')),
			closeButton = element(by.css('#toolbar .cancel-button')),
			weightSetter = element.all(by.css('.weight-setter h3')).get(0),
			clusterOptions = element.all(by.css('.cluster-options-item')).get(0),
			serviceWeight1 = element.all(by.css('.service-weight')).get(0),
			serviceWeight2 = element.all(by.css('.service-weight')).get(1),
			weightSaveButton = element.all(by.css('.cluster-option-actions .button-pink')).get(0),
			weightValue = element.all(by.css('.weight-setter span')).get(0),
			undeployButton = element.all(by.css('.button-red')).get(0);

  it('should be visible when deployed', function(){
  	browser.get('/#/deployments');
  	expect(deploymentListItem.isDisplayed()).toBeTruthy();
  });

	it('should have a detail screen', function(){
		deploymentLink.click();
		browser.sleep(100).then(function(){
			expect(browser.getCurrentUrl()).toEqual('http://localhost:4000/#/deployments/bfac6c59-48ba-4bd9-86c8-522b1f19f8b1');
		});
	});

	it('should be editable', function(){
		editButton.click();
		browser.sleep(4000).then(function(){
			expect(inputBox.isDisplayed()).toBeTruthy();
			closeButton.click();
		});
	});

	it('should have editable service weights', function(){
		weightSetter.click();
		browser.sleep(500).then(function(){
			expect(clusterOptions.isDisplayed()).toBeTruthy();
			serviceWeight1.clear();
			serviceWeight1.sendKeys('25');
			browser.sleep(100).then(function(){
				expect(serviceWeight1.getAttribute('value')).toEqual('25');
				expect(serviceWeight2.getAttribute('value')).toEqual('75');
			});
		});
	});

	it('should save edited service weights', function(){
		weightSaveButton.click();
		browser.sleep(4000).then(function(){
			expect(weightValue.getText()).toEqual('25');
		});
	});

	it('should undeploy when button is clicked', function(){
  	browser.get('/#/deployments');
  	undeployButton.click();
  	browser.sleep(1000).then(function(){
	  	browser.switchTo().alert().accept();
	  	browser.sleep(500).then(function(){
	  		expect(deploymentListItem).toEqual([  ]);
	  	});
  	});
	});
});