var websocketSrvBuilder = require('websocket').server;
var http = require('http');
var storage = require('./common_modules/storage.js');


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
});

storage.setValue('nextValue', 'atosPontos');

storage.getValue('nextValue');
