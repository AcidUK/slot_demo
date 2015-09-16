/**
 * Created by Sean on 16/09/2015.
 */
angular.module('slotDemo')

    .service('mobilePhone', function(opportunities) {
      // Prevent clashes later
      var mobilePhone = this;

      // Initialise properties
      mobilePhone.messages = [];
      mobilePhone.unreadMessages = 0;
      mobilePhone.successfulReply = false;

      // Adds a message object to list
      // format {'direction': 'incoming' or 'outgoing', 'message': 'message text goes here'}
      mobilePhone.addMessage = function(messageObject) {
        mobilePhone.messages.push(messageObject);
      };

      // Handles typed responses from the user
      mobilePhone.handleResponse = function(message) {

        // Ugly way of making sure int responses are correctly picked up
        message = +(message);

        // Check whether we were passed an int, and whether that int points towards an offer id
        // (note id is index + 1 in created array)
        if (angular.isNumber(message) && opportunities.created[message - 1] !== undefined) {

          // Determine whether this job is still availible
          if (opportunities.created[message - 1].status === 'Offered') {

            // Update properties to show now taken
            opportunities.created[message - 1].status = 'Accepted';
            opportunities.created[message - 1].class = 'success';
            opportunities.created[message - 1].accepted_by = 'Med Student';

            // Send reply to mobile phone
            mobilePhone.addMessage({direction: 'incoming', message: 'Please attend ' + opportunities.created[message - 1].location + ' in ' + opportunities.created[message - 1].expiry_time.fromNow(true)
            + ' to complete this supervised procedure. This learning opportunity has been reserved exclusively for you, please make every effort to attend.'});

            // This is set once from a default value of false, and makes the big 'back to dashboard' button appear
            mobilePhone.successfulReply = true;
          } else {

            // We were passed a valid id, but it has been taken
            mobilePhone.addMessage({direction: 'incoming', message: 'Sorry - procedure already taken this time.'});
          }

        } else {

          // Not passed a valid id
          mobilePhone.addMessage({direction: 'incoming', message: 'Sorry - this opportunity is not available.'});
        }
      };

      // Method to add an opportunity, uses same message format as original project
      mobilePhone.addOpportunityMessage = function(procedure, location, expiry_time, doctor, id) {

        // Add message to mobile phone about new opportunity
        mobilePhone.addMessage({direction: 'incoming', message: procedure + ' at ' + location + '.\nAttend within ' + expiry_time + '.\nAsk for ' + doctor + '\n\nTo accept reply "' + id + '"'});

        // Increment unread message counter
        mobilePhone.unreadMessages++;
      };

      // A method to check whether there are unaccepted offers
      // (ie: do we need to see the button to access the mobile phone interface)
      mobilePhone.unacceptedOffers = function() {
        var allTaken = true;

        // We are using jQuery elsewhere, so make use of each function
        $.each(opportunities.list(), function (i, opportunity) {

          // If any of the opportunities are still availible then set the monitor variable to false and return it
          if ( opportunity.status == 'Offered' ) { allTaken = false; }
        });

        return allTaken;
      }
    });