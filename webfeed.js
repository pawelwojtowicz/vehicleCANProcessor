const Websocket = require('ws');
const WebsocketServer = Websocket.Server;
var vehicleRegistry = require('./webfeed_modules/vehicleRegistry.js');
var genericStorage = require('./common_modules/genericStorage.js');
var messageBroker = require('./common_modules/messageBroker.js');
var srvInfo = require('./common_modules/serverInfo.js');
var serverRegistry = require('./webfeed_modules/serverRegistry.js');
var vehicleInfo = require('./webfeed_modules/vehicleInfo.js')
var serverPort = 8090;

const wsSrv = new WebsocketServer( { port : serverPort } );

var sendToAll = function( message ) {
  wsSrv.clients.forEach( function( client ){
    if (client.readyState === Websocket.OPEN) {
      client.send(message);
    }
  });
};

messageBroker.subscribe( "vhListUpdate", function( channel, message) {
  console.log("received event ["+channel+"]");
  vehicleRegistry.refreshVehicleList();
});

vehicleRegistry.initialize(genericStorage, sendToAll);
vehicleRegistry.refreshVehicleList();

wsSrv.on('connection', function( connection , request ) {
  //set up the vehicle selection to empty
  connection.selectedVh = "";
  connection.view = "srvList";

  //get current vh List.
  vehicleRegistry.updateVehicleList(connection);
		
  connection.on('message',function( message) {
	  console.log(message);
	  var command = JSON.parse(message);
	  if ( 'vhSelection' === command.cmd ) {
	    connection.view = "vehicleList";
	    connection.selectedVh = command.selectedVehicleId;
 	    vehicleInfo.updateVehicleInfo( connection.selectedVh, genericStorage,connection);
	  } else if ( 'srvStats' === command.cmd ) {
	    connection.view = "srvList";
	    connection.selectedVh = '';
	    serverRegistry.updateServerList( genericStorage, connection );
	  }
  });
  
  connection.on('close' , function() {
  	srvInfo.setClientCount( wsSrv.clients.size );
  });
  
  // update the server stats
  srvInfo.setClientCount( wsSrv.clients.size );
});

setInterval( function() 
{
  wsSrv.clients.forEach( function( client )
  {
    if (client.readyState === Websocket.OPEN) 
    {
      if ( "vehicleList" === client.view ) 
      {
        vehicleInfo.updateVehicleInfo( client.selectedVh, genericStorage,client);
      } 
      else if ( "srvList" === client.view ) 
      {
        serverRegistry.updateServerList( genericStorage, client );
      }
    }
  });
}, 1000);

setInterval( function() {
  srvInfo.updateSrvStatistics(genericStorage);
}, 2000);

console.log("Webfeed server is running");



