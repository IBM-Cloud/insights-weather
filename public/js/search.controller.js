/*global console, Bloodhound, angular, moment */
/*jslint vars: true*/
(function () {
  "use strict";

  function SearchController($location, searchService, $stateParams, $cookies) {
    console.info("Initializing SearchController");
    var controller = this;

    controller.data = {
      query: $stateParams.query || "",
      current: {},
      tenday: {},
      hourly: {},
      timeseries: {},
      map: {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 1
      },
      temperatureMode: 'F'
    };

    // set default temperature mode from cookie or based on the user language
    controller.data.temperatureMode = $cookies.get('temperatureMode');
    if (!controller.data.temperatureMode) {
      // Imperial system of weights and measures:
      // Liberia. Myanmar (a.k.a. “the country formerly known as Burma”) United States of America
      if (navigator && (navigator.language.indexOf("US") != -1 ||
          navigator.language.indexOf("LR") != -1 ||
          navigator.language.indexOf("MM") != -1)) {
        controller.data.temperatureMode = 'F';
      } else {
        controller.data.temperatureMode = 'C';
      }
    }

    controller.setTemperatureMode = function (mode) {
      controller.data.temperatureMode = mode;
      $cookies.put("temperatureMode", mode);
    };

    // configure the typeahead field
    controller.autocompleteOptions = {
      highlight: true
    };
    controller.autocompleteData = {
      name: 'search',
      display: 'name',
      source: new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: '../api/1/autocomplete?q=%QUERY',
          wildcard: '%QUERY'
        }
      })
    };

    var currentObservation = function (query) {
      controller.data.current = {};

      searchService.currentObservation(query).then(
        function (data) {
          console.log("Received current observation", data);
          controller.data.current = data;

          controller.data.map.center.latitude = controller.data.current.metadata.latitude;
          controller.data.map.center.longitude = controller.data.current.metadata.longitude;
          controller.data.map.zoom = 8;
        });
    };

    var tendayForecast = function (query) {
      controller.data.tenday = {};

      searchService.tendayForecast(query).then(
        function (data) {
          console.log("Received 10 day forecast", data);
          controller.data.tenday = data;
        });
    };

    var hourlyForecast = function (query) {
      controller.data.hourly = {};

      searchService.hourlyForecast(query).then(
        function (data) {
          console.log("Received hourly forecast", data);
          controller.data.hourly = data;
        });
    };

    var timeseries = function (query) {
      controller.data.timeseries = {};

      searchService.timeseries(query).then(
        function (data) {
          console.log("Received timeseries", data);
          controller.data.timeseries = data;
        });
    };

    controller.search = function () {
      var query = controller.getQuery();

      // update location bar
      $location.search("query", query);
      // and trigger the search
      currentObservation(query);
      tendayForecast(query);
      hourlyForecast(query);
      timeseries(query);
    };

    controller.getQuery = function () {
      return angular.isDefined(controller.data.query.name) ? controller.data.query.name : controller.data.query;
    };


    // trigger the query on start if there is one
    if (controller.getQuery().length > 0) {
      controller.search();
    }

  }

  angular.module('app').controller('SearchController', ['$location', 'searchService', '$stateParams', '$cookies', SearchController]);

  angular.module('app')
    .filter('formatTemperature', [
      function () {
        return function (input, scale) {
          // input is assumed in Fahrenheit, as specified in lib/weather.js
          // conversion to Celsius occurs in the display
          if (scale === 'C') {
            return Math.round((input - 32) * 5.0 / 9.0);
          } else {
            return input;
          }
        };
    }])
    .filter('formatDate', [
      function () {
        return function (input, format) {
          return moment(input).format(format);
        };
      }
    ]);

}());
