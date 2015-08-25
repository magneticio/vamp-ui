exports.config = {

	specs: [
		'./e2e/**/*.spec.js'
	],

	baseUrl: 'http://localhost:4000',
	seleniumAddress: 'http://localhost:4444/wd/hub',

	onPrepare: function() {
    browser.ignoreSynchronization = true;
	},
	jasmineNodeOpts: {isVerbose: true}
};