# Insights for Weather

[![Build Status](https://travis-ci.org/IBM-Bluemix/insights-weather.svg?branch=master)](https://travis-ci.org/IBM-Bluemix/insights-weather)

This project provides a user interface to query the Weather Company Data for IBM Bluemix service.

[![Deploy to Bluemix](https://deployment-tracker.mybluemix.net/stats/a15ae39863da63802a6babd1c8c67310/button.svg)](https://bluemix.net/deploy?repository=https://github.com/IBM-Bluemix/insights-weather.git)

## Running the app on Bluemix

1. Create a Bluemix Account

    [Sign up][bluemix_signup_url] for Bluemix, or use an existing account.
    
2. Download and install the [Cloud-foundry CLI][cloud_foundry_url] tool

3. Clone the app to your local environment from your terminal using the following command

  ```
  git clone https://github.com/IBM-Bluemix/insights-weather.git
  ```

4. cd into this newly created directory

5. Edit the `manifest.yml` file and change the `<application-name>` and `<application-host>` from `insights-weather` to something unique.

	```
    applications:
      - services:
        - insights-weather-weatherinsights
        name: insights-weather
        host: insights-weather
        memory: 256M
	```

  The host you use will determinate your application url initially, e.g. `<application-host>.mybluemix.net`.

6. Connect to Bluemix in the command line tool and follow the prompts to log in.

	```
	$ cf api https://api.ng.bluemix.net
	$ cf login
	```
7. Create the Weather Company Data for IBM Bluemix service.

  ```
  $ cf create-service weatherinsights Free-v2 insights-weather-weatherinsights
  ```

8. Push the application to Bluemix.

  ```
  $ cf push
  ```

And voila! You now have your very own instance running on Bluemix. Navigate to the application url, e.g. `<application-host>.mybluemix.net` and start querying the Weather service.

## Built with

  - [node.js](https://nodejs.org/)
  - [express](http://expressjs.com/)
  - [Twitter Bootstrap](http://getbootstrap.com/)
  - [angularJS, angular-cookies, angular-google-maps, angular-ui-router](https://angularjs.org)
  - [angular-strap](http://mgcrea.github.io/angular-strap/)
  - [angular-typeahead](https://github.com/Siyfion/angular-typeahead)
  - [angular-spinners](https://github.com/urish/angular-spinner)
  - [json-formatter](https://github.com/mohsen1/json-formatter)
  - [momentjs](http://momentjs.com)
  - [livestamp.js](http://mattbradley.github.io/livestampjs/)
  - [lodash](https://lodash.com/)  

### Troubleshooting

To troubleshoot your Bluemix app the main useful source of information is the logs. To see them, run:

  ```sh
  $ cf logs <application-name> --recent
  ```

## Privacy Notice
This application includes code to track deployments to IBM Bluemix and other Cloud Foundry platforms.
The following information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service)
service on each deployment:

* Application Name (application_name)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)

This data is collected from the VCAP_APPLICATION environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require("cf-deployment-tracker-client").track();` from the beginning of the `app.js` file.

---

This project is a sample application created for the purpose of demonstrating the use of the Weather Company Data for IBM Bluemix service.
The program is provided as-is with no warranties of any kind, express or implied.

[bluemix_signup_url]: https://console.ng.bluemix.net/?cm_mmc=GitHubReadMe-_-BluemixSampleApp-_-Node-_-Workflow
[cloud_foundry_url]: https://github.com/cloudfoundry/cli
