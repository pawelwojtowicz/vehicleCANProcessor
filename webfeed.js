const WebsocketServer = require('ws').Server;
var serverPort = 8090;

const wsSrv = new WebsocketServer( { port : serverPort } );

wsSrv.on('connection', function( connection , request ) {

  connection.on('message',function( message) {
  });
  
  connection.on('close' , function() {
  })
});



