/*global angular*/
(function () {
  "use strict";

  function searchService($http, $q) {
    var callWeatherAPI = function (api, query) {
      var deferred = $q.defer();
      $http.get(api + "?q=" + encodeURIComponent(query)).success(function (data) {
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
