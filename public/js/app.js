/*global angular*/
(function () {
  "use strict";
  // listen for request sent over XHR and automatically show/hide spinner
  angular.module('ngLoadingSpinner', ['angularSpinners'])
    .directive('spinner', ['$http', 'spinnerService', function ($http, spinnerService) {
      return {
        link: function (scope, elm, attrs) {
          scope.isLoading = function () {
            return $http.pendingRequests.length > 0;
          };
          scope.$watch(scope.isLoading, function (loading) {
            if (loading) {
              spinnerService.show('spinner');
            } else {
              spinnerService.hide('spinner');
            }
          });
        }
      };
    }]);

  // angular app initialization
  var app = angular.module('app', ['ui.router',
                                 'ngLoadingSpinner',
                                 'siyfion.sfTypeahead',
                                 'uiGmapgoogle-maps',
                                 'mgcrea.ngStrap.tooltip',
                                 'jsonFormatter',
                                 'ngCookies']);

  app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/home.html'
      })
      .state('search', {
        url: '/search?{query:string}',
        templateUrl: 'partials/search.html'
      });
  });
}());
