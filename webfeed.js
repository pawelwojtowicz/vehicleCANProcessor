const Websocket = require('ws');
const WebsocketServer = Websocket.Server;
var vehicleRegistry = require('./webfeed_modules/vehicleRegistry.js');
var genericStorage = require('./common_modules/genericStorage.js');
var messageBroker = require('./common_modules/messageBroker.js');
var serverPort = 8090;


const wsSrv = new WebsocketServer( { port : serverPort } );

function sendToAll( message ) {
  wsSrv.clients.forEach( function( client ){
    if (client.readyState === Websocket.OPEN) {
      client.send(message);
    }
  });
};

var updateClientVehicleList = function ( vhList) {
  console.log("Updating Vh List");
  var vhListUpdate = {
    type : 'vhListUpdate',
    data : vhList
  };
  var message = JSON.stringify(vhListUpdate);
  sendToAll(message);
}


var updateAllClients = function() {
  wsSrv.clients.forEach( function( client ){
    if (client.readyState === Websocket.OPEN) {
      console.log("updating clients info for: "+ client.selectedVh);
      genericStorage.getHashMap(client.selectedVh , function(vhInfo) {
        var vhInfoUpdate = {
          type: 'vhInfoUpdate' , 
          data: vhInfo
        };
        var message = JSON.stringify(vhInfoUpdate);
        console.log(message);
        client.send(message);
      }); 
      
    
      
    }
  });
  
}

vehicleRegistry.initialize(genericStorage, updateClientVehicleList);

messageBroker.subscribe( "vhListUpdate", function( channel, message) {
  console.log("received event ["+channel+"]");
  vehicleRegistry.refreshVehicleList();
});

vehicleRegistry.refreshVehicleList();

wsSrv.on('connection', function( connection , request ) {
	//set up the vehicle selection to empty
	connection.selectedVh = "";
	
	//get current vh List.
  var vhListUpdate = {
    type : 'vhListUpdate',
    data : vehicleRegistry.getVehicleList()
  };
	var vehicleString = JSON.stringify(vhListUpdate);
	connection.send(vehicleString);
		
  connection.on('message',function( message) {
	  console.log(message);
	  var command = JSON.parse(message);
	  if ( 'vhSelection' === command.cmd ) {
	    connection.selectedVh = command.selectedVehicleId;
	  }
  });
  
  connection.on('close' , function() {
  })
});

setInterval( function() {
updateAllClients();
}, 2000);

console.log("Webfeed server is running");



