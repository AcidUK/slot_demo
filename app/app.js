'use strict';

// Declare app level module which depends on views, and components
angular.module('slotDemo', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.modal'
])

    .config(function ($stateProvider, $urlRouterProvider) {
      // Default state
      $urlRouterProvider.otherwise('/dashboard');

      // Configure States
      $stateProvider

          // Dashboard State
          .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
          })

          // Add State
          .state('add', {
            url: '/add',
            templateUrl: 'add/add.html',
            controller: 'AddCtrl'
          })

          // Mobile Phone State
          .state('dashboard.modal', {
            url: '/modal',
            onEnter: ['$modal', '$state', function($modal, $state) {
              var modalInstance = $modal.open({
                templateUrl: 'mobile-phone/phone.html',
                controller: 'MobileCtrl'

                // Ensures modal closes properly and states transition
              }).result.finally(function () {
                    $state.go('dashboard');
                  });
            }]
          });
    });


