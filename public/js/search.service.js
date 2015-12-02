/*global angular,console*/
(function () {
  "use strict";

  // simple parser for longitude and latitude
  var geocodeParser = /^([\-+]?[\d]{1,2}\.?\d+),(\s*[\-+]?[\d]{1,3}\.?\d+)$/;
  
  function searchService($http, $q) {
    var callWeatherAPI = function (api, query) {

      // by default we handle this as a simple query
      var queryString = "q=" + encodeURIComponent(query);

      // but we try to extract latitude and longitude from the query
      try {
        var geolocation = geocodeParser.exec(query);
        if (geolocation && geolocation.length === 3) {
          var latitude = parseFloat(geolocation[1]);
          var longitude = parseFloat(geolocation[2]);
          console.log("Extracted latitude", latitude, "and longitude", longitude);
          queryString = "latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude);
        }
      } catch (err) {
        console.error(err);
      }

      var deferred = $q.defer();
      $http.get(api + "?" + queryString).success(function (data) {
        deferred.resolve(data);
      }).error(function () {
        deferred.reject();
      });
      return deferred.promise;
    };

    return {
      currentObservation: function (query) {
        return callWeatherAPI("/api/1/current.json", query);
      },

      tendayForecast: function (query) {
        return callWeatherAPI("/api/1/tenday.json", query);
      },

      hourlyForecast: function (query) {
        return callWeatherAPI("/api/1/hourly.json", query);
      },

      timeseries: function (query) {
        return callWeatherAPI("/api/1/timeseries.json", query);
      }

    };
  }

  angular.module('app')
    .service('searchService', ['$http', '$q', searchService]);
}());
