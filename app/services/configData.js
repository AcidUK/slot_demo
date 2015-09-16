/**
 * Created by Sean on 16/09/2015.
 */
angular.module('slotDemo')

    .service('configData', function() {
      // Prevent clashes later
      var configData = this;

      // This data populates the add State select inputs
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
    });