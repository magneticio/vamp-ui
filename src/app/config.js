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
  },
  
  // PULSE REST API
  getPulseApiUrl: function(){
    if(this.pulseApiUrl)
      return this.pulseApiUrl;

    var infoEndpoint = this.getApiUrl() + '/info',
        self = this;

    request.get(infoEndpoint).end(function(err,res){
      var infoObject = JSON.parse(res.text);
      self.setPulseApiUrl(infoObject);
    });

      return this.pulseApiUrl;
  },
  setPulseApiUrl: function(infoObject){
    var pulseUrl = infoObject.pulse_url,
        pulsePort = pulseUrl.substring(pulseUrl.lastIndexOf(":") + 1, pulseUrl.length),
        localStorageHost = localStorage.getItem('host').substr(0, localStorage.getItem('host').lastIndexOf(":"));

    if (pulseUrl.indexOf("localhost") > -1) {
      this.pulseApiUrl = localStorageHost + ':' +  pulsePort + '/api/v1';
    } else {
      this.pulseApiUrl = pulseUrl + '/api/v1';
    }
  },

};

module.exports = Config;