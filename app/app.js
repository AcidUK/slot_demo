'use strict';

// Declare app level module which depends on views, and components
angular.module('slotDemo', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.modal',
//  'slotDemo.new',
//  'slotDemo.phone'
]).config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    })
      .state('add', {
        url: '/add',
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .state('dashboard.modal', {
        url: '/modal',
        onEnter: ['$modal', '$state', function($modal, $state) {
          console.log('Open modal');
          $modal.open({
            /*template: [
              '<div class="modal-content">',
              '<div class="modal-header">',
              '<h3 class="modal-title">Testing</h3>',
              '</div>',
              '<div class="modal-body">',
                'Testing',
              '</div>',
              '<div class="modal-footer">',
              '<button class="btn btn-primary" ng-click="$dismiss()">OK</button>',
              '</div>',
              '</div>'
            ].join(''),*/
            templateUrl: 'mobile-phone/iphone.orig.html'

          }).result.finally(function () { // or .result[finally](
                //Will be triggered always.
                console.log('Closed modal');
                $state.go('dashboard');
          });
        }]
      });
}).service('slot', function() {
      var slot = this;
      slot.message='test';
    }
).controller('DashboardCtrl', function(slot) {
  console.log(slot);
});