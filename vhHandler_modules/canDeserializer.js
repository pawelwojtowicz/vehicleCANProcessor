var canDeserializers = new Map();

var deserializeGPS = function( canPayload , storage) {
  var latitude = Buffer( canPayload.substring(0,8), 'hex').readFloatBE(0);
  var longitude = Buffer ( canPayload.substring(8,16),'hex').readFloatBE(0);

  storage.setPosition( latitude, longitude);
};


//419361024
//419361025
//PGN 65265
var deserializeCCVS1 = function( canPayload , storage ) {
  var speedHex = '0x'+canPayload.substring(4,6) + canPayload.substring(2,4);
  var speed = parseInt(speedHex) * 1/256;
  
  storage.setSpeed( speed); 
}; 

//419265793
//PGN 64893
function getTellTaleId(blockId, partialId) {
  var prefix = "tellTale";
  var tellTaleId = blockId*15 + partialId;
  
  return prefix + tellTaleId.toString();
}

function getStatus( status ) {
  var numericStatus = parseInt("0x"+status) & 0x07;
  return numericStatus;
}

var deserializeFMS1 = function( canPayload , storage ) {
  var retVal = -1;
  
  if ( 16 === canPayload.length ) {
    var blockId = parseInt("0x"+canPayload[1]);
    
    tellTales = {};
    
    tellTales[getTellTaleId( blockId, 01 )] = getStatus(canPayload[0]);
    tellTales[getTellTaleId( blockId, 02 )] = getStatus(canPayload[3]);
    tellTales[getTellTaleId( blockId, 03 )] = getStatus(canPayload[2]);
    tellTales[getTellTaleId( blockId, 04 )] = getStatus(canPayload[5]);
    tellTales[getTellTaleId( blockId, 05 )] = getStatus(canPayload[4]);
    tellTales[getTellTaleId( blockId, 06 )] = getStatus(canPayload[7]);
    tellTales[getTellTaleId( blockId, 07 )] = getStatus(canPayload[6]);
    tellTales[getTellTaleId( blockId, 08 )] = getStatus(canPayload[9]);
    tellTales[getTellTaleId( blockId, 09 )] = getStatus(canPayload[8]);
    tellTales[getTellTaleId( blockId, 10 )] = getStatus(canPayload[11]);
    tellTales[getTellTaleId( blockId, 11 )] = getStatus(canPayload[10]);
    tellTales[getTellTaleId( blockId, 12 )] = getStatus(canPayload[13]);
    tellTales[getTellTaleId( blockId, 13 )] = getStatus(canPayload[12]);
    tellTales[getTellTaleId( blockId, 14 )] = getStatus(canPayload[15]);
    tellTales[getTellTaleId( blockId, 15 )] = getStatus(canPayload[14]);

    storage.setTellTaleBlock( tellTales );
  }
};


canDeserializers.set(2000, deserializeGPS);
canDeserializers.set(419361024, deserializeCCVS1);
canDeserializers.set(419361025, deserializeCCVS1);
canDeserializers.set(419265793, deserializeFMS1);


exports.deserialize = function ( msgId , canPayload , storage ) {
  var msgDeserializer = canDeserializers.get( msgId );
  
  if ( null !== msgDeserializer ) {
    msgDeserializer( canPayload , storage );

    return true;
  }
  
  return false;
};
