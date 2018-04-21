exports.updateVehicleInfo = function( vehicleId , genericStorage, websocketClient ) {
  genericStorage.getHashMap( vehicleId , function(vhInfo) {
    var vhInfoUpdate = {
      type: 'vhInfoUpdate' , 
      data: vhInfo
    };
    var message = JSON.stringify(vhInfoUpdate);
	console.log(message);
    websocketClient.send(message);
  });  
};
