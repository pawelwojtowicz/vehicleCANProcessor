var vehicleDataMap = new Map();

exports.initVehicleInfo = function() {
	vehicleDataMap.clear();
	vehicleDataMap.set( "timestamp", JSON.stringify(new Date()) );
};

exports.getVehicleInfoMap() {
  return vehicleDataMap;
};

exports.setPosition = function ( lat, long) {
  var position = {};
  position.latitude = lat;
  position.longitude = long;

  vehicleDataMap.set( "position", JSON.stringify( position ) );
}

exports.setSpeed = function( speed) {
  vehicleDataMap.set( "speed", speed.toString() );
};


exports.setTellTaleBlock = function ( tellTales ) {

};









