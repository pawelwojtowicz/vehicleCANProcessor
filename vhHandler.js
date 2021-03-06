const WebsocketServer = require('ws').Server;
var vhTools = require('./vhHandler_modules/vehicleHandlerTools.js');
var vehicleInfo = require('./common_modules/vehicleInfo.js');
var storage = require('./common_modules/genericStorage.js');
var messageBroker = require('./common_modules/messageBroker.js');
var canProcessor = require('./vhHandler_modules/canProcessor.js');
var srvInfo = require('./common_modules/serverInfo.js');

var serverPort = 8080;


const wsSrv = new WebsocketServer( { port : serverPort } );



wsSrv.on('connection', function( connection , request ) {
  var vehicleId = vhTools.extractVehicleId(request.url);
  connection.vehicleIdentifier = vehicleId;

  vehicleInfo.initVehicleInfo();
  storage.storeHashMap( connection.vehicleIdentifier , vehicleInfo.getVehicleInfoMap() );
  messageBroker.publish("vhListUpdate", "test");
  srvInfo.setClientCount( wsSrv.clients.size );


  console.log( "vehicle with ID=["+connection.vehicleIdentifier+"] has connected");

  connection.on('message',function( message) {
    //console.log("received data from vehicle: [" + connection.vehicleIdentifier +"]");
    vehicleInfo.initVehicleInfo();


    if ( canProcessor.processCANMessage(message , vehicleInfo ) ) {
    	storage.storeHashMap( connection.vehicleIdentifier , vehicleInfo.getVehicleInfoMap() );
    };
    srvInfo.updateStatistics(message.length );
  });
  
  connection.on('close' , function() {
    console.log("vehicle with ID=["+connection.vehicleIdentifier+"] is disconnected");
    srvInfo.setClientCount( wsSrv.clients.size );
  })
});

setInterval( function(){
  srvInfo.updateSrvStatistics(storage);
}, 5000);
