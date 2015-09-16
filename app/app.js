'use strict';

// Declare app level module which depends on views, and components
angular.module('slotDemo', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.modal',
//  'slotDemo.new',
//  'slotDemo.phone'
])
    .config(function ($stateProvider, $urlRouterProvider) {
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
            templateUrl: 'mobile-phone/iphone.html',
            controller: 'MobileCtrl'

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
    .service('mobilePhone', function() {
      var mobilePhone = this;
      mobilePhone.messages = [];
      mobilePhone.unreadMessages = 0;

      mobilePhone.addMessage = function(messageObject) {
        mobilePhone.messages.push(messageObject);
      };

      mobilePhone.addOpportunityMessage = function(procedure, location, expiry_time, doctor) {
        mobilePhone.addMessage({direction: 'incoming', message: procedure + ' at ' + location + '.\nAttend within ' + expiry_time + '.\nAsk for ' + doctor});
        mobilePhone.unreadMessages++;

        console.log(mobilePhone);
      }
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
    .controller('DashboardCtrl', function(opportunities, $scope, mobilePhone) {
      $scope.opportunities = opportunities;
      $scope.mobilePhone = mobilePhone;
      console.log(opportunities);
    })
    .controller('AddCtrl', function(configData, $scope, opportunities, $state, mobilePhone) {
      $scope.configData = configData;
      $scope.submit = function (opportunity) {
        opportunity.status="Offered";
        opportunity.accepted_by="";
        opportunity.class="info";
        opportunity.request_time=moment();
        opportunity.expiry_time=moment(opportunity.request_time).add(opportunity.timelimit, 'minutes');
        opportunities.list.push(opportunity);
        console.log(opportunities.list);

        mobilePhone.addOpportunityMessage(opportunity.procedure, opportunity.location, opportunity.expiry_time.format('HH:mm'), opportunity.doctor);

        $state.go('dashboard')
      }
    })
    .controller('MobileCtrl', function(mobilePhone, $anchorScroll, $location, $scope, $state) {
      $scope.mobilePhone = mobilePhone;
      $scope.mobilePhone.unreadMessages = 0;

      if ($scope.mobilePhone.messages.length == 0) {
        $state.go('dashboard');
        dismiss();
      }


      $scope.isLastAnchor = function(bool) {
        if (bool)
          return 'last-message';
      };

      $scope.scrollToBottom = function() {
        console.log('firing');
        $(".phone-height-screen").animate({'scrollTop': $( "#last-message" ).offset().top}, 300, 'swing');
      };

      $scope.send = function(message) {
        mobilePhone.addMessage({direction: 'outgoing', message: message});
        $scope.message='';
        $scope.scrollToBottom();
      };

      console.log('we are here');
    });