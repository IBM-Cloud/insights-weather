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
      url + "/api/weather/v3/location/search?language=en_US&locationType=city&query=" +
      encodeURIComponent(query), {
        json: true
      },
      function (error, response, body) {
        if (error) {
          callback(error);
        } else if (body.location) {
          var result = [];
          body.location.address.forEach(function (address, index) {
            var name = body.location.city[index] + ", ";
            if (body.location.adminDistrict[index] != null &&
              body.location.adminDistrict[index] != body.location.city[index]) {
              name = name + body.location.adminDistrict[index] + ", ";
            }
            name = name + body.location.country[index];
            result.push({
              name: name,
              lat: body.location.latitude[index],
              lon: body.location.longitude[index]
            });
          });
          callback(null, result);
        } else {
          callback(null, []);
        }
      });
  };

  self.currentByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body && body[0]) {
        self.currentByGeolocation(parseFloat(body[0].lat), parseFloat(body[0].lon), options, callback);
      } else {
        callback("no result", null);
      }
    });
  };

  self.tendayByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body && body[0]) {
        self.tendayByGeolocation(parseFloat(body[0].lat), parseFloat(body[0].lon), options, callback);
      } else {
        callback("no result", null);
      }
    });
  };

  self.hourlyByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body && body[0]) {
        self.hourlyByGeolocation(parseFloat(body[0].lat), parseFloat(body[0].lon), options, callback);
      } else {
        callback("no result", null);
      }
    });
  };

  self.timeseriesByQuery = function (text, options, callback) {
    self.autocomplete(text, function (error, body) {
      if (error) {
        callback(error, null);
      } else if (body && body[0]) {
        self.timeseriesByGeolocation(parseFloat(body[0].lat), parseFloat(body[0].lon), options, callback);
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

    var callURL = url + "/api/weather/v1/geocode/" +
      encodeURIComponent(latitude.toFixed(2)) + "/" +
      encodeURIComponent(longitude.toFixed(2)) +
      endPoint +
      (endPoint.indexOf("?") >= 0 ? "&" : "?") +
      "language=" + encodeURIComponent(options.language) +
      "&units=" + encodeURIComponent(options.units);

    request.get(callURL, {
        json: true
      },
      function (error, response, body) {
        callback(error, body);
      });
  };

  self.currentByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/observations.json", latitude, longitude, options, callback);
  };

  self.tendayByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/forecast/daily/10day.json", latitude, longitude, options, callback);
  };

  self.hourlyByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/forecast/hourly/48hour.json", latitude, longitude, options, callback);
  };

  self.timeseriesByGeolocation = function (latitude, longitude, options, callback) {
    callByGeolocation("/observations/timeseries.json?hours=23", latitude, longitude, options, callback);
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
