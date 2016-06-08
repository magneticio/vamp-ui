(function() {
  'use strict';

  var endpoint        = 'http://192.168.99.100:8080/api/v1/',
      defaultHeaders  = {
        'Content-Type': 'application/json',
      };

  angular
    .module('revampUi')
    .config(artifactsRequestConfig)
    .factory('Artifacts', Artifacts);

  function artifactsRequestConfig($httpProvider) {
    $httpProvider.defaults.headers.common = defaultHeaders;
    $httpProvider.defaults.headers.patch  = defaultHeaders;
    $httpProvider.defaults.headers.post   = defaultHeaders;
    $httpProvider.defaults.headers.post   = defaultHeaders;
  }

  function Artifacts ($http) {

    function responseHandler (response) {
      console.log( response );
      return response.data;
    }

    function errorHandler (error) {
      console.log( error );
    }

    var Artifacts = {
      create: function(resource, data) {
        return $http.post( endpoint + resource , data )
          .then(responseHandler, errorHandler)
      },

      delete: function(resource, data) {
        return $http({
            url: endpoint + resource,
            method: 'DELETE',
            data: data,
            headers: defaultHeaders
          })
          .then(responseHandler, errorHandler)
      },

      get: function(resource) {
        return $http.get( endpoint + resource )
          .then(responseHandler, errorHandler)
      },

      update: function(resource, data) {
        return $http.put( endpoint + resource , data )
          .then(responseHandler, errorHandler)
      }
    }

    return Artifacts;

  }

})();
