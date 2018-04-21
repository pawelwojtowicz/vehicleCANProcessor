var vehicleList = [];
var storage = null;
var vhListBroadcaster = null;

exports.initialize = function( genericStorage , vhListener) {
  storage = genericStorage;
  vhListBroadcaster = vhListener;
};

function prepareVhUpdateMessage() {
  var vhListUpdate = {
    type : 'vhListUpdate',
    data : vehicleList
  };
  return JSON.stringify(vhListUpdate);
}

exports.refreshVehicleList  = function() {
  storage.getAllKeys( function(vehicles) {
    vehicleList = vehicles;
	console.log("dostalem" + JSON.stringify(vehicleList));
    
    vhListBroadcaster(prepareVhUpdateMessage());
  });
};

exports.updateVehicleList = function( websocketClient ) {
console.log(prepareVhUpdateMessage())
  websocketClient.send(prepareVhUpdateMessage());
}
