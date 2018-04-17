var canDeserializer = require('./canDeserializer.js');

var canDeserializers = new Map();

var centralStorage = null;


exports.initialize = function ( ) { 
  canDeserializers.set(2000, canDeserializer.deserializeGPS); 
  canDeserializers.set(419361024, canDeserializer.deserializeCCVS1);
  canDeserializers.set(419361025, canDeserializer.deserializeCCVS1);
  canDeserializers.set(419265793, canDeserializer.deserializeFMS1);

console.log( JSON.stringify(canDeserializers) );
};


exports.processCANMessage = function( message , storage ) {
  var messageLength = message.length;
  var begin = -1;
  
  var updateNeeded = false;
  
  for ( var i = 0 ; i < messageLength ; ++i ) {
    var character = message[i];
    
    if ( '{' === character) {
      begin = i;
    } else if ( begin!== -1 && character=== '}') {
      var singleMessage = message.substring( begin , ( i+1>messageLength)?i:(i+1));

      var canObject = JSON.parse(singleMessage);

      
      var deserializer = canDeserializers[canObject.c];

	console.log( deserializer );
      
      if ( null != deserializer ) {
        deserializer( canObject.d , storage);
        updateNeeded = true;
      }

    begin = -1;

    }
    
  }

  return updateNeeded;
}
