var websocketSrvBuilder = require('websocket').server;
var http = require('http');
var vehicleInfo = require('./common_modules/vehicleInfo.js')l
var storage = require('./common_modules/genericStorage.js');
var canProcessor = require('./vhHandler_modules/canProcessor.js');


var serverPort = 8080;


var server = http.createServer( function(req, resp ) {
    console.log(( new Date() + 'Received request for: '+ req.url));
    resp.writeHead(404);
    resp.end();
});

server.listen( serverPort , function() {
    console.log((new Date() ) + 'Server started up - listening on the port of :' + serverPort);
});


wsServer = new websocketSrvBuilder( {
    httpServer : server,
    autoAcceptConnections : false
});

wsServer.on('request' , function( request ) {
  var connection = request.accept('echo-protocol' , request.origin);
  
  connection.on('message', function( message) {
    if ( 'utf8' == message.type ) {
      vehicleInfo.initVehicleInfo();
	
      if ( canProcessor.processCANMessage(message.utf8Data , vehicleInfo ) ) {
        storage.storeHashMap( 8130 , vehicleInfo.getVehicleInfoMap() );
      };
    } else if ( 'binary' === message.type) {
    
    }
    
  });
  
  connection.on('close' , function( reasonCode, description) {
    
  });
	
});
