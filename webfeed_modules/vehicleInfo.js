exports.updateVehicleInfo = function( vehicleId , genericStorage, websocketClient ) {
  genericStorage.getHashMap( vehicleId , function(vhInfo) {
    
    vhInfo.name = vehicleId;

    var vhInfoUpdate = {
      type: 'vhInfoUpdate' , 
      data: vhInfo
    };
    var message = JSON.stringify(vhInfoUpdate);
    websocketClient.send(message);
  });  
};
