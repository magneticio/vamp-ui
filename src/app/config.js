
var Config = {

	getApiHost: function(){
		var hostname = localStorage.getItem('host') || window.location.hostname + ':8080';
		return hostname + '/api/v1';
	},
	setApiHost: function(url){
		localStorage.setItem('host', url);
	},
	removeApiHost: function(){
		localStorage.removeItem('host');
	}
};

module.exports = Config;