var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var client = new kafka.Client('kafka:2181');

consumer = new Consumer( client, [], { autoCommit: false } );

console.log("Connecting to KAFKA");

consumer.on('ready' , function() {
  console.log('Kafka connection ready');
});

consumer.on('error', function(error) {
  console.log("There was an error" + JSON.stringify(error));
});

exports.subscribeTopic = function( rTopic ) {
  consumer.addTopics([{ topic: rTopic}], function (err, added) {
    console.log("Topic " + rTopic + " added" + JSON.stringify(added));
  }, false);
};


exports.registerMessageListener =function( callback ) {
  consumer.on('message', callback);
};

exports.reportDone = function() {
  consumer.commit( function ( err ) {
    if (err !== null ) {
      console.log(JSON.stringify(err));
    }
  });
};
