(function() {
  'use strict';

  var endpoint        = 'http://192.168.99.100:8080/api/v1/',
      defaultHeaders  = {
        'Content-Type': 'application/json'
      };

  angular
    .module('revampUi')
    .config(artifactsRequestConfig)
    .factory('Artifacts', Artifacts);

  function artifactsRequestConfig($httpProvider) {
    $httpProvider.defaults.headers.common = defaultHeaders;
    $httpProvider.defaults.headers.patch  = defaultHeaders;
    $httpProvider.defaults.headers.post   = defaultHeaders;
    $httpProvider.defaults.headers.put    = defaultHeaders;
  }

  function Artifacts ($http) {

    function responseHandler (response) {
      console.log( response );
      return response.data;
    }

    function errorHandler (error) {
      console.log( error );
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

    var Artifacts = {
      create: function( resource , data , options ) {
        var httpConfig = parseOptions( options );

        return $http.post( endpoint + resource , data , httpConfig )
          .then(responseHandler, errorHandler)
      },

      delete: function( resource , data ) {
        return $http({
            url: endpoint + resource,
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
      }
    };

    return Artifacts;

  }

})();
