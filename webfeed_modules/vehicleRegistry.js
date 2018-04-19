var vehicleList = [];
var storage = null;
var vehicleListListener = null;

exports.initialize = function( genericStorage , vhListener) {
  storage = genericStorage;
  vehicleListListener = vhListener;
};

exports.refreshVehicleList  = function() {
  storage.getAllKeys( function(vehicles) {
    vehicleList = vehicles;
    
    vehicleListListener(vehicleList);
  });
};


exports.getVehicleList = function() {
  return vehicleList;
};
