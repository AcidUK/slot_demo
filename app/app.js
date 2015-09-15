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
        templateUrl: 'add/add.html',
        controller: 'AddCtrl'
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
            templateUrl: 'mobile-phone/iphone.html'

          }).result.finally(function () { // or .result[finally](
                //Will be triggered always.
                console.log('Closed modal');
                $state.go('dashboard');
          });
        }]
      });
})
    .service('opportunities', function() {
      var opportunities = this;
      opportunities.list = [];
    })
    .service('configData', function() {
      var configData = this;
      configData.doctors = [
        "Sean C",
        "Matt S",
        "Ian D",
        "Lexi J",
        "John G"
      ];
      configData.procedures = [
          "Venepuncture",
          "IV Cannula",
          "Male Urethral Catheter"
      ];
      configData.locations = [
          "Ward 105",
          "Ward 106",
          "Ward 107",
          "MAU"
      ];
      configData.timelimits = [
          "20",
          "40",
          "60"
      ];
    })
    .controller('DashboardCtrl', function(opportunities, $scope) {
      $scope.opportunities = opportunities;
      console.log(opportunities);
    })
    .controller('AddCtrl', function(configData, $scope, opportunities, $state) {
      $scope.configData = configData;
      $scope.submit = function (opportunity) {
        opportunity.status="Offered";
        opportunity.accepted_by="";
        opportunity.class="info";
        opportunity.request_time=moment();
        opportunity.expiry_time=moment(opportunity.request_time).add(opportunity.timelimit, 'minutes');
        opportunities.list.push(opportunity);
        console.log(opportunities.list);

        $state.go('dashboard')
      }
    });