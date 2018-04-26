const WebsocketServer = require('ws').Server;
var vhTools = require('./vhHandler_modules/vehicleHandlerTools.js');
var srvInfo = require('./common_modules/serverInfo.js');
var kafkaPublisher = require('./common_modules/kafkaPublisher.js');
var storage = require('./common_modules/genericStorage.js');

var serverPort = 8080;


const wsSrv = new WebsocketServer( { port : serverPort } );

function reportVhLinkState ( vhId ,  state ) {
  var message = String(state);
  kafkaPublisher.publish( "VhLinkState" , vhId ,  message , function() {
    srvInfo.updateStatistics(message.length );
  });
} 

wsSrv.on('connection', function( connection , request ) {
  var vehicleId = vhTools.extractVehicleId(request.url);
  connection.vehicleIdentifier = vehicleId;
  reportVhLinkState( connection.vehicleIdentifier, true );

  srvInfo.setClientCount( wsSrv.clients.size );
  console.log( "vehicle with ID=["+connection.vehicleIdentifier+"] has connected");

  connection.on('message',function( message) {
    console.log("received data from vehicle: [" + connection.vehicleIdentifier +"]");
    kafkaPublisher.publish( "CAN_Data" , connection.vehicleIdentifier ,  message , function() {
      srvInfo.updateStatistics(message.length );
    });    
  });
  
  connection.on('close' , function() {
    console.log("vehicle with ID=["+connection.vehicleIdentifier+"] is disconnected");
    srvInfo.setClientCount( wsSrv.clients.size );
    reportVhLinkState( connection.vehicleIdentifier, false );
  });
});

setInterval( function(){
  srvInfo.updateSrvStatistics(storage);
}, 2000);
