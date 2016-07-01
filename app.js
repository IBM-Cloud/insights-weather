// Licensed under the Apache License. See footer for details.
/*jslint node: true*/
"use strict";

var
  express = require('express'),
  app = express(),
  cfenv = require('cfenv');

//---Deployment Tracker---------------------------------------------------------
require("cf-deployment-tracker-client").track();

// load local VCAP configuration
var vcapLocal = null;
try {
  vcapLocal = require("./vcap-local.json");
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  console.error(e);
}

// get the app environment from Cloud Foundry, defaulting to local VCAP
var appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

var weatherCreds = appEnv.getServiceCreds("insights-weather-weatherinsights");
var weather = require('./lib/weather.js')(weatherCreds.url);

app.get("/api/1/autocomplete", function (req, res) {
  console.log("Autocomplete with", req.query.q);
  weather.autocomplete(req.query.q, function (error, body) {
    if (error) {
      res.status(400).send({
        error: error
      });
    } else {
      res.send(body);
    }
  });
});

function weatherApiCall(req, res, method) {
  var onResponse = function (error, body) {
    if (error) {
      res.status(400).send({
        error: error
      });
    } else {
      res.send(body);
    }
  };
  // ?q=  will be first sent to autocomplete to guess the location
  // or ?latitude=&longitude= will go through
  if (req.query.q) {
    weather[method + "ByQuery"](req.query.q, {}, onResponse);
  } else {
    weather[method + "ByGeolocation"](parseFloat(req.query.latitude), parseFloat(req.query.longitude), {}, onResponse);
  }
}

app.get("/api/1/current.json", function (req, res) {
  weatherApiCall(req, res, "current");
});

app.get("/api/1/tenday.json", function (req, res) {
  weatherApiCall(req, res, "tenday");
});

app.get("/api/1/hourly.json", function (req, res) {
  weatherApiCall(req, res, "hourly");
});


app.get("/api/1/timeseries.json", function (req, res) {
  weatherApiCall(req, res, "timeseries");
});

// serve the files out of ./public as our main files
app.use(express.static('./public'));

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function () {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
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
