const WebsocketServer = require('ws').Server;
var vhTools = require('./vhHandler_modules/vehicleHandlerTools.js');
var vehicleInfo = require('./common_modules/vehicleInfo.js');
var storage = require('./common_modules/genericStorage.js');
var canProcessor = require('./vhHandler_modules/canProcessor.js');

var serverPort = 8080;


const wsSrv = new WebsocketServer( { port : serverPort } );


wsSrv.on('connection', function( connection , request ) {
  var vehicleId = vhTools.extractVehicleId(request.url);
  connection.vehicleIdentifier = vehicleId;
  
  console.log( "vehicle with ID=["+connection.vehicleIdentifier+"] has connected");

  connection.on('message',function( message) {
    console.log("received data from vehicle: [" + connection.vehicleIdentifier +"]");
    vehicleInfo.initVehicleInfo();

    if ( canProcessor.processCANMessage(message , vehicleInfo ) ) {
    storage.storeHashMap( connection.vehicleIdentifier , vehicleInfo.getVehicleInfoMap() );
    };    
  });
  
  connection.on('close' , function() {
    console.log("vehicle with ID=["+connection.vehicleIdentifier+"] is disconnected");
  })
});
