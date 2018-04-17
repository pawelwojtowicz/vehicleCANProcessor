var canDeserializer = require('./canDeserializer.js');

var canDeserializers = new Map();

var centralStorage = null;


exports.initialize = function ( storage ) { 
  canDeserializers[2000] =      canDeserializer.deserializeGPS; 
  canDeserializers[419361024] = canDeserializer.deserializeCCVS1;
  canDeserializers[419361025] = canDeserializer.deserializeCCVS1;
  canDeserializers[419265793] = canDeserializer.deserializeFMS1;
};


exports.processCANMessage = function( message , storage ) {
  var messageLength = message.length;
  var begin = -1;
  
  var updateNeeded = false;
  
  for ( var i = 0 ; i < messageLength ; ++i ) {
    var character = message[i];
    
    if ( '{' === character) {
      begin = i;
    } else if ( -1 !== begin && '}' === character) {
      var singleMessage = message.substring( begin , ( i+1>messageLength)?i:(i+1));
      var canObject = JSON.parse(singleMessage);
      
      var deserializer = canDeserializers[canObject.c];
      
      if ( null != deserializer ) {
        deserializer( singleMessage , storage);
        updateNeeded = true;
      } 
    }
    
    begin = -1;
  }

  return updateNeeded;
};
