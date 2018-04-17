const WebsocketServer = require('ws').Server;
var http = require('http');
var vhTools = require('./vhHandler_modules/vehicleHandlerTools.js');
var vehicleInfo = require('./common_modules/vehicleInfo.js');
var storage = require('./common_modules/genericStorage.js');
var canProcessor = require('./vhHandler_modules/canProcessor.js');


var serverPort = 8080;


const wsSrv = new WebsocketServer( { port : serverPort } );


console.log("it's comming");
wsSrv.on('connection', function( connection , request ) {
  console.log("connected ");

  var vehicleId = vhTools.extractVehicleId(request.url);
  
  connection.vehicleIdentifier = vehicleId;
  
  console.log( "vehicle with ID=["+connection.vehicleIdentifier+"] has connected");

  connection.on('message',function( message) {
    if ( 'utf8' == message.type ) {
      console.log("received data from vehicle: [" + connection.vehicleIdentifier +"]");
      vehicleInfo.initVehicleInfo();
	
      if ( canProcessor.processCANMessage(message.utf8Data , vehicleInfo ) ) {
        storage.storeHashMap( connection.vehicleIdentifier , vehicleInfo.getVehicleInfoMap() );
      };
    } else if ( 'binary' === message.type) {
    
    }
    
  });
  
  connection.on('close' , function() {
    console.log('closing connection with ' + connection.vehicleIdentifier);
  })
});
