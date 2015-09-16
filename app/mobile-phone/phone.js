/**
 * Created by Sean on 16/09/2015.
 */
angular.module('slotDemo')

    .controller('MobileCtrl', function(mobilePhone, $anchorScroll, $location, $scope, $state, $modalInstance, $timeout) {
      // Access mobile phone service
      $scope.mobilePhone = mobilePhone;

      // Reset number of unread messages
      $scope.mobilePhone.unreadMessages = 0;

      // Close the phone and go back to dashboard if we have loaded directly into mobile phone without viewing dashboard
      if ($scope.mobilePhone.messages.length == 0) {
        $modalInstance.dismiss();
        $state.go('dashboard');
      }

      // Close button for dashboard
      $scope.close = function () {
        $state.go('dashboard');
        $modalInstance.dismiss();
      };

      // Function to scroll to bottom - had to use jQuery as angular functions were not working
      $scope.scrollToBottom = function() {
        $(".phone-height-screen").animate({'scrollTop': $( "#last-message" ).offset().top}, 300, 'swing');
      };

      // Handle the response from user pressing send button
      $scope.send = function(message) {
        mobilePhone.addMessage({direction: 'outgoing', message: message});
        mobilePhone.handleResponse(message);
        $scope.message='';
        $scope.scrollToBottom();
      };


      // A delay timer to scroll to bottom when phone is opened - this is for when there are already messages in the phone and we return
      // Without this the div is not availible to manipulate
      var timer=false;

      $scope.$watch('mobilePhone.unreadMessages', function(){
        if(timer){
          // Ignore this change
          $timeout.cancel(timer)
        }
        timer= $timeout(function(){
          $scope.scrollToBottom();
        }, 500)
      });
    });