var request = require('superagent');

var Config = {

  pulseApiUrl: null,

  // CORE REST API
  getApiUrl: function(){
    var hostname = localStorage.getItem('host') || window.location.hostname + ':8080';
    return hostname + '/api/v1';
  },
  getApiHost: function(){
    var hostname = localStorage.getItem('host') || window.location.hostname + ':8080';
    return hostname;
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