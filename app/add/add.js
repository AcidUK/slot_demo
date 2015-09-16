angular.module('slotDemo')

    .controller('AddCtrl', function(configData, $scope, opportunities, $state, mobilePhone) {
      // ConfigData is used to populate select inputs
      $scope.configData = configData;

      // Creates and adds an opportunity object to the opportunities service
      $scope.submit = function (opportunity) {

        opportunity.id=opportunities.getNextOpportunityId();
        opportunity.status="Offered";
        opportunity.accepted_by="";
        opportunity.class="info";

        // We use moment to handle the datetime objects
        opportunity.request_time=moment();
        opportunity.expiry_time=moment(opportunity.request_time).add(opportunity.timelimit, 'minutes');

        // Add the opportunity to the created list
        opportunities.created.push(opportunity);

        // Send message to mobile phone with details of new opportunity
        mobilePhone.addOpportunityMessage(opportunity.procedure, opportunity.location, opportunity.expiry_time.format('HH:mm'), opportunity.doctor, opportunity.id);

        // Take us back to the dashboard
        $state.go('dashboard')
      }
    });