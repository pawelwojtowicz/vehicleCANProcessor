var apiVersionTag = "api/v1/";
var tokenVersionTag = "?token=";


// extract the vehicle ID from the URL:
// "ws://192.168.1.108/api/v1/trapeze/8130?token=3298472"
exports.extractVehicleId = function( connectionURL ) {  
  var STX = connectionURL.search(apiVersionTag) + apiVersionTag.length;
  var ETX = connectionURL.indexOf(tokenVersionTag);

  return connectionURL.substring(STX, ETX).split("/")[1];
};
