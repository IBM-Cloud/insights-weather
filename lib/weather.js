// Licensed under the Apache License. See footer for details.
/*jslint node: true*/
"use strict";

var
  request = require('request'),
  _ = require('lodash');

function Weather(url) {
  var self = this;

  self.autocomplete = function (query, callback) {
    request.get(
      "http://autocomplete.wunderground.com/aq?query=" + encodeURIComponent(query), {
        json: true
      },
      function (error, response, body) {
        // keep only the cities in the results
        if (body && body.RESULTS) {
          _.remove(body.RESULTS, function (item) {
            return item.type !== 'city';
          });
        }
        callback(error, body);
      });
  };

  self.currentByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body.RESULTS && body.RESULTS[0]) {
        self.currentByGeolocation(parseFloat(body.RESULTS[0].lat), parseFloat(body.RESULTS[0].lon), options, callback);
      } else {
        callback("no result", null);
      }
    });
  };

  self.tendayByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body.RESULTS && body.RESULTS[0]) {
        self.tendayByGeolocation(parseFloat(body.RESULTS[0].lat), parseFloat(body.RESULTS[0].lon), options, callback);
      } else {
        callback("no result", null);
      }
    });
  };

  self.hourlyByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body.RESULTS && body.RESULTS[0]) {
        self.hourlyByGeolocation(parseFloat(body.RESULTS[0].lat), parseFloat(body.RESULTS[0].lon), options, callback);
      } else {
        callback("no result", null);
      }
    });
  };

  self.timeseriesByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body.RESULTS && body.RESULTS[0]) {
        self.timeseriesByGeolocation(parseFloat(body.RESULTS[0].lat), parseFloat(body.RESULTS[0].lon), options, callback);
      } else {
        callback("no result", null);
      }
    });
  };

  // http://twcservice.mybluemix.net/rest-api/
  var defaultOptions = {
    language: "en-US",
    units: "e"
  };

  var callByGeolocation = function (endPoint, latitude, longitude, options, callback) {
    options = _.merge({}, defaultOptions, options);

    var callURL = url + endPoint +
      "?geocode=" + encodeURIComponent(latitude.toFixed(2) + "," + longitude.toFixed(2)) +
      "&language=" + encodeURIComponent(options.language) +
      "&units=" + encodeURIComponent(options.units);

    request.get(callURL, {
        json: true
      },
      function (error, response, body) {
        callback(error, body);
      });
  };
  
  self.currentByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/api/weather/v2/observations/current", latitude, longitude, options, callback);
  };

  self.tendayByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/api/weather/v2/forecast/daily/10day", latitude, longitude, options, callback);
  };

  self.hourlyByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/api/weather/v2/forecast/hourly/24hour", latitude, longitude, options, callback);
  };

  self.timeseriesByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/api/weather/v2/observations/timeseries/24hour", latitude, longitude, options, callback);
  };

}

module.exports = function (url) {
  return new Weather(url);
};

//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
