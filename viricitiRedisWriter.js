var srvInfo = require('./common_modules/serverInfo.js');
var kafkaConsumer = require('./common_modules/kafkaConsumer.js');
var vehicleInfo = require('./common_modules/vehicleInfo.js');
var storage = require('./common_modules/genericStorage.js');
var messageBroker = require('./common_modules/messageBroker.js');

var trackedVehicles = new Set();

kafkaConsumer.subscribeTopic( 'viricitiStream' );
kafkaConsumer.registerMessageListener( function( message ) {
  if ( 'viricitiStream' === message.topic ) {
    console.log("message" + message.value);
    
    var found = true;
  
    if (!trackedVehicles.has( message.key ) ) {
      found = false;
      console.log("did not find " + message.key + " in " + JSON.stringify(trackedVehicles));
      storage.getAllKeys( function(vehicles) {
        console.log( "vh list + " + JSON.stringify(vehicles));
        vehicles.forEach( function(vehicle) {
          trackedVehicles.add(vehicle);
        });
        
      });
    }
    
    var viricitiInfoEntry = JSON.parse(message.value);
    
    vehicleInfo.initVehicleInfo();
console.log("redis Key "+ viricitiInfoEntry.label.replace('.','_') + " value "+ viricitiInfoEntry.value);
    vehicleInfo.setViricitiValue( viricitiInfoEntry.label.replace('.','_') , viricitiInfoEntry.value );

    storage.storeHashMap( message.key , vehicleInfo.getVehicleInfoMap() , function ( err ) {
      if ( !found ) {
        console.log( "new vehicle added - send notification " + message.key );
        messageBroker.publish("vhListUpdate", message.key);              
      }
    } );
  } 
  //kafkaConsumer.reportDone();
  srvInfo.updateStatistics(message.value.length);

});

setInterval( function(){
  srvInfo.updateSrvStatistics(storage);
  kafkaConsumer.subscribePending();
}, 2000);


