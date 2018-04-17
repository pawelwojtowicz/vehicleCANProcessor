

// extract the vehicle ID from the URL:
// "ws://192.168.1.108/api/v1/trapeze/8130?token=3298472"
var extractVehicleId = function( connectionURL ) {

console.log(connectionURL);

  var apiVersionTag = "api/v1/";
  
  console.log(apiVersionTag);
  var tokenVersionTag = "?token=";
  console.log(tokenVersionTag);
  
  var STX = connectionURL.search(apiVersionTag) + apiVersionTag.length;
  var ETX = connectionURL.indexOf(tokenVersionTag);

  return connectionURL.substring(STX, ETX).split("/")[1];
};
