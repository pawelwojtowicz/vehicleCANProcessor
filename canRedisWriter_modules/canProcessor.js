var can = require('./canDeserializer.js');

var canDeserializers = new Map();


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
      
      if ( can.deserialize(canObject.c, canObject.d , storage) ) {
        updateNeeded = true;
      }
      begin = -1;
    }  
  }

  return updateNeeded;
}
