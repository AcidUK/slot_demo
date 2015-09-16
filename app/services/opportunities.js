/**
 * Created by Sean on 16/09/2015.
 */
angular.module('slotDemo')

    .service('opportunities', function() {
      // Prevent clashes later
      var opportunities = this;

      // Keep a separate list of pre-populated offers, and the ones that we make
      opportunities.created = [];

      // This computed property allows the dashboard to mix the two
      opportunities.list = function () { return opportunities.created.concat(opportunities.demoList) };

      // Opportunity id are determined by index + 1, so the next one will be length + 1 (or index + 2)
      opportunities.getNextOpportunityId = function() { return opportunities.created.length + 1 };

      // Some sample opportunities
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
          id: ""
        }
      ]
    });