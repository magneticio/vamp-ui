var endpoint        = 'http://192.168.99.100:8080/api/v1/',
    defaultHeaders  = {
      'Content-Type': 'application/json'
    };

function artifactsRequestConfig($httpProvider) {
  $httpProvider.defaults.headers.common = defaultHeaders;
  $httpProvider.defaults.headers.patch  = defaultHeaders;
  $httpProvider.defaults.headers.post   = defaultHeaders;
  $httpProvider.defaults.headers.put    = defaultHeaders;
}

function Api ($http, $location, $q, toastr) {

  function responseHandler (response) {
    return response.data;
  }

  function errorHandler (error) {
    console.log('EROOOR', error);

    //Status is -1 if you can't connect to backend.
    if(error.status === -1) {
      toastr.error('Webinterface can\'t connect', 'Can\'t connect to Vamp');
    }

    var message = error && error.data && error.data.message ? error.data.message : 'No message avaliable from API';
    
    return $q.reject(message);
  }

  var Api = {
    create: function(resource , data) {
      var httpConfig = {};
      return $http.post( endpoint + resource , data , httpConfig )
        .then(responseHandler, errorHandler)
    },

    delete: function(resource, id, data) {
      return $http({
          url: endpoint + resource + '/' + id,
          method: 'DELETE',
          data: data || '',
          headers: defaultHeaders
        })
        .then(responseHandler, errorHandler)
    },

    readAll: function(resource) {
      return $http.get( endpoint + resource )
        .then(responseHandler, errorHandler)
    },

    read: function( resource , id , params) {
      var httpConfig = {}
      httpConfig.params = params;

      return $http.get( endpoint + resource + '/' + id, httpConfig )
        .then(responseHandler, errorHandler)
    },

    update: function( resource , id , data ) {
      var httpConfig = {}
      return $http.put( endpoint + resource + '/' + id , data , httpConfig )
        .then(responseHandler, errorHandler)
    },

    getEndpoint: function() {
      return endpoint;
    },

    setEndpoint: setApiEndpoint
  };

  function setApiEndpoint ( url ) {
    if ( ! url ) {
      url  = $location.protocol() + '://';
      url += $location.host();
      url += $location.port() ? ':' + $location.port() : '';
      url += '/';
    }

    console.info( 'Setting API endpoint to...' , url );
    // $window.localStorage.setItem( 'vampApiEndpoint' , url );
    endpoint = url;
  }

  // if ( $location.host() !== 'localhost' ) {
  //   setApiEndpoint();
  // }

  return Api;
}

angular
  .module('app')
  .config(artifactsRequestConfig)
  .factory('Api', Api);
