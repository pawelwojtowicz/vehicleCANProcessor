var srvInfo = require('./common_modules/serverInfo.js');
var kafkaConsumer = require('./common_modules/kafkaConsumer.js');
var vehicleInfo = require('./common_modules/vehicleInfo.js');
var storage = require('./common_modules/genericStorage.js');
var messageBroker = require('./common_modules/messageBroker.js');
var canProcessor = require('./canRedisWriter_modules/canProcessor.js'); 



kafkaConsumer.subscribeTopic( 'CAN_Data' );
kafkaConsumer.subscribeTopic( 'VhLinkState' );
kafkaConsumer.registerMessageListener( function( message ) {
  if ( 'CAN_Data' === message.topic ) {
    console.log("CAN Data");
    vehicleInfo.initVehicleInfo();
    canProcessor.processCANMessage(message.value , vehicleInfo )
    storage.storeHashMap( message.key , vehicleInfo.getVehicleInfoMap() );
  } else if ( 'VhLinkState' === message.topic ) {
    if ( "true" === message.value ) {
      console.log( message.key+' is online');
      vehicleInfo.initVehicleInfo();
      storage.storeHashMap( message.key , vehicleInfo.getVehicleInfoMap() );
      messageBroker.publish("vhListUpdate", "test");
    } else {
      console.log( message.key+' is offline');    
    }
  }
  kafkaConsumer.reportDone();
  srvInfo.updateStatistics(message.value.length);

});

setInterval( function(){
  srvInfo.updateSrvStatistics(storage);
  kafkaConsumer.subscribePending();
}, 2000);

