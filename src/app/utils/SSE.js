var Config = require('../config.js');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoadStates = require("../constants/LoadStates.js");
var request = require('superagent');

var eventsUrl = Config.getApiUrl() + "/events/stream",
		eventSource;


function filterStream(deployment, metrics){
	eventSource.addEventListener('router-metric', function(e) {
		console.log(e.data);
	}, false);
}

var SSE = {

	open: function(deployment, metrics){
		eventSource = new EventSource(eventsUrl + "?tags=metrics&tags=service&tags=services", { withCredentials: true });
		eventSource.addEventListener('open', function(e) {
			console.log('Connection Opened');
		}, false);

		filterStream(deployment, metrics);
	},
	close: function(){
		try {
			eventSource.close();
			console.log('stream closed');
		} catch(e) {
			console.log(e);
		}
	}
}

module.exports = SSE;