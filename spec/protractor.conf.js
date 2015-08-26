exports.config = {

	specs: [
		'./e2e/homepage.spec.js',
		'./e2e/optionsPane.spec.js',
		'./e2e/blueprints.spec.js',
	],

	baseUrl: 'http://localhost:4000',
	seleniumAddress: 'http://localhost:4444/wd/hub',

	onPrepare: function() {
    browser.ignoreSynchronization = true;
	}
};