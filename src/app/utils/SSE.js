var _ = require('underscore');
var Config = require('../config');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var LoadStates = require("../constants/LoadStates");
var DeploymentConstants = require("../constants/DeploymentConstants");
var request = require('superagent');

var eventsUrl = Config.getApiUrl() + "/events/stream",
		eventSource;

function filterStream(deployment, metrics){
	// On each event...
	eventSource.addEventListener('router-metric', function(e) {	
		var data = JSON.parse(e.data);

		// Loop trough metrics asked by client...
		_.each(metrics, function(metricsType){
			var currentRoute = false;

			// Check if stream contains object that belongs to current route...
			_.each(data.tags, function(tag){
				if(tag.indexOf(deployment) > -1) 
					currentRoute = true;
			}, this);

			// If the metric tag is in the provided metrics array
			if( currentRoute && data.tags.indexOf("metrics:" + metricsType) >= 0 ) {
				var payload = {actionType: DeploymentConstants.GET_DEPLOYMENT_METRICS_STREAM, metricsType: metricsType, data: e.data };
				// And finally send to dispatcher
				AppDispatcher.dispatch(payload);
			}
		}, this);
	}, false);
}

var SSE = {

	open: function(deployment, metrics){
		var filteredStream;
		//console.log(eventsUrl + "?tags=metrics&tags=service&tags=services");
		eventSource = new EventSource(eventsUrl + "?tags=metrics&tags=service&tags=services", { withCredentials: false });
		eventSource.addEventListener('open', function(e) {
			//console.log('Connection Opened');
		}, false);

		filterStream.apply(this, arguments);
	},
	close: function(){
		try {
			eventSource.close();
			eventSource = null;
			//console.log('stream closed');
		} catch(e){
			//console.log(e);
		}
	}
	
}

module.exports = SSE;