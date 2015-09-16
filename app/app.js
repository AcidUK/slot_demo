'use strict';

// Declare app level module which depends on views, and components
angular.module('slotDemo', [
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.modal',
  //'ngAnimate',
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
          var modalInstance = $modal.open({
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
      opportunities.created = [];
      opportunities.list = function () { return opportunities.created.concat(opportunities.demoList) };
      opportunities.getNextOpportunityId = function() { return opportunities.created.length + 1 };

      opportunities.demoList = [
        {
          doctor: "Matt S",
          location: "MAU",
          procedure: "Venepuncture",
          class: 'active',
          status: 'Expired',
          timelimit: '20',
          request_time: moment().subtract(1,'hours'),
          expiry_time:  moment().subtract(40,'minutes'),
          accepted_by: "",
          id: "",
        }
      ]
    })
    .service('mobilePhone', function(opportunities) {
      var mobilePhone = this;
      mobilePhone.messages = [];
      mobilePhone.unreadMessages = 0;
      mobilePhone.successfulReply = false;

      mobilePhone.addMessage = function(messageObject) {
        mobilePhone.messages.push(messageObject);
      };

      mobilePhone.handleResponse = function(message) {
        message = +(message);
        console.log(angular.isNumber(message));
        if (angular.isNumber(message) && opportunities.created[message - 1] !== undefined) {
          if (opportunities.created[message - 1].status === 'Offered') {
            opportunities.created[message - 1].status = 'Accepted';
            opportunities.created[message - 1].class = 'success';
            opportunities.created[message - 1].accepted_by = 'Med Student';
            mobilePhone.addMessage({direction: 'incoming', message: 'Please attend ' + opportunities.created[message - 1].location + ' in ' + opportunities.created[message - 1].expiry_time.fromNow(true)
              + ' to complete this supervised procedure. This learning opportunity has been reserved exclusively for you, please make every effort to attend.'});
            mobilePhone.successfulReply = true;
          } else {
            mobilePhone.addMessage({direction: 'incoming', message: 'Sorry - procedure already taken this time.'});
          }
        } else {
          mobilePhone.addMessage({direction: 'incoming', message: 'Sorry - this opportunity is not available.'});
        }
      };

      mobilePhone.addOpportunityMessage = function(procedure, location, expiry_time, doctor, id) {
        //mobilePhone.addMessage({direction: 'incoming', message: procedure + ' at ' + location + '.\nAttend within ' + expiry_time + '.\nAsk for ' + doctor});
        mobilePhone.addMessage({direction: 'incoming', message: procedure + ' at ' + location + '.\nAttend within ' + expiry_time + '.\nAsk for ' + doctor + '\n\nTo accept reply "' + id + '"'});
        mobilePhone.unreadMessages++;

        console.log(mobilePhone);
      }

      mobilePhone.unacceptedOffers = function() {
        var allTaken = true;
        $.each(opportunities.list(), function (i, opportunity) {
          if ( opportunity.status == 'Offered' ) { allTaken = false; }
        });
        return allTaken;
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
      console.log(opportunities.list());
      $scope.noOpportunities = function() { if (opportunities.created.length) { return true; }  };
      $scope.showOnFirstOfferedOpportunity = function($first, opportunity) {
        if ($first && opportunity.status == 'Offered') { return true; }
      }
    })
    .controller('AddCtrl', function(configData, $scope, opportunities, $state, mobilePhone) {
      $scope.configData = configData;
      $scope.submit = function (opportunity) {
        opportunity.id=opportunities.getNextOpportunityId();
        opportunity.status="Offered";
        opportunity.accepted_by="";
        opportunity.class="info";
        opportunity.request_time=moment();
        opportunity.expiry_time=moment(opportunity.request_time).add(opportunity.timelimit, 'minutes');
        opportunities.created.push(opportunity);
        console.log(opportunities.list);

        mobilePhone.addOpportunityMessage(opportunity.procedure, opportunity.location, opportunity.expiry_time.format('HH:mm'), opportunity.doctor, opportunity.id);

        $state.go('dashboard')
      }
    })
    .controller('MobileCtrl', function(mobilePhone, $anchorScroll, $location, $scope, $state, $modalInstance) {
      $scope.mobilePhone = mobilePhone;
      $scope.mobilePhone.unreadMessages = 0;

      if ($scope.mobilePhone.messages.length == 0) {
        $modalInstance.dismiss();
        $state.go('dashboard');

        console.log('Should be closed...');
      }

      $scope.close = function () {
        $state.go('dashboard');
        $modalInstance.dismiss();
      };

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
        mobilePhone.handleResponse(message);
        $scope.message='';
        $scope.scrollToBottom();
      };

      $scope.scrollToBottom();
      console.log('we are here');
    });