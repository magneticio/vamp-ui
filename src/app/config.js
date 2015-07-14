var request = require('superagent');

var Config = {

  pulseApiUrl: null,

  // CORE REST API
  getApiUrl: function(){
    var host = localStorage.getItem('host') || window.location.origin;
    return host + '/api/v1';
  },
  getApiHost: function(){
    var host = localStorage.getItem('host') || window.location.origin;
    return host;
  },
  setApiHost: function(url){
    // remove trailing slash
    if(url.substr(-1) === '/') {
      localStorage.setItem('host', url.substr(0, url.length - 1));
    } else {
      localStorage.setItem('host', url);
    }
  },
  removeApiHost: function(){
    localStorage.removeItem('host');
  }
  
};

module.exports = Config;