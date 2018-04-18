var vehicleDataMap = new Map();

exports.initVehicleInfo = function() {
  vehicleDataMap.clear();
  vehicleDataMap.set( "timestamp", new Date());
};

exports.getVehicleInfoMap = function() {
  return vehicleDataMap;
};

exports.setPosition = function ( lat, long) {
  var position = {
    latitude : lat,
    longitude : long
  };

  vehicleDataMap.set( "position", JSON.stringify( position ) );
}

exports.setSpeed = function( speed) {
  vehicleDataMap.set( "speed", speed.toString() );
};


exports.setTellTaleBlock = function ( tellTales ) {

};









