var WebSocket = require('ws');
var srvInfo = require('./common_modules/serverInfo.js');
var kafkaPublisher = require('./common_modules/kafkaPublisher.js');
var storage = require('./common_modules/genericStorage.js');

var url = process.env.CLOUD_URL;

var websocket = new WebSocket(url/**, { agent: agent }*/);

websocket.on('open', function () {
  console.log( 'Connected to: ' + url );
  srvInfo.setClientCount(1);

});

websocket.on('close', function() {
  srvInfo.setClientCount(0);
  console.log('disconnected from the cloud')
});

websocket.on('message' , function(data, flags) {
  //console.log( JSON.stringify(data));
  var vhId = JSON.parse(data).asset.name;
  
  console.log(vhId);
  
  kafkaPublisher.publish( "viricitiStream" , vhId ,  data , function() {
    srvInfo.updateStatistics(data.length);
  });
});

setInterval( function(){
  srvInfo.updateSrvStatistics(storage);
}, 2000);


