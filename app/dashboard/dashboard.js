angular.module('slotDemo')

    .controller('DashboardCtrl', function(opportunities, $scope, mobilePhone) {

      // We need access to opportunities and mobilePhone when rendering template
      $scope.opportunities = opportunities;
      $scope.mobilePhone = mobilePhone;

      // Display function that tells us whether there are any opportunities
      $scope.noOpportunities = function() { if (opportunities.created.length) { return true; }  };

      // Display function that will return true for the first offered opportunity
      // Used for the tooltip
      $scope.showOnFirstOfferedOpportunity = function($first, opportunity) {
        if ($first && opportunity.status == 'Offered') { return true; }
      }
    });