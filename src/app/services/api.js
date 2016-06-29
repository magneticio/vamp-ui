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

function Api ($http, $location, $window, $q) {

  function responseHandler (response) {
    console.log( response );
    return response.data;
  }

  function errorHandler (error) {
    var message = error.message ? error.message : 'No message avaliable from API';
    return $q.reject(message);
  }

  function parseOptions (options) {
    var httpConfig = {};

    if ( options ) {
      if (options.getAs == 'YAML') {
        angular.extend( httpConfig , {
          headers: { 'Accept' : 'application/x-yaml' }
        });
      }

      if (options.sendAs == 'YAML') {
        angular.extend( httpConfig , {
          headers: { 'Content-Type' : 'application/x-yaml' }
        });
      }
    }

    return angular.equals( httpConfig , {} ) ? null : httpConfig;
  }

  var Api = {
    create: function( resource , data , options ) {
      var httpConfig = parseOptions( options );

      return $http.post( endpoint + resource , data , httpConfig )
        .then(responseHandler, errorHandler)
    },

    delete: function(resource , data ) {
      return $http({
          url: endpoint + resource + '/' + data.id,
          method: 'DELETE',
          data: data || '',
          headers: defaultHeaders
        })
        .then(responseHandler, errorHandler)
    },

    readAll: function( resource , options ) {
      var httpConfig = parseOptions( options );

      return $http.get( endpoint + resource )
        .then(responseHandler, errorHandler)
    },

    read: function( resource , id , options) {
      var httpConfig = parseOptions( options );

      return $http.get( endpoint + resource + '/' + id, httpConfig )
        .then(responseHandler, errorHandler)
    },

    update: function( resource , id , data , options) {
      var httpConfig = parseOptions( options );

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
  .module('inspinia')
  .config(artifactsRequestConfig)
  .factory('Api', Api);
