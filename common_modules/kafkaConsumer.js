var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var client = new kafka.Client('kafka:2181');

consumer = new Consumer( client, [], { autoCommit: false } );

var pendingSubscriptions = [];

console.log("Connecting to KAFKA");

exports.subscribePending = function() {
  if ( pendingSubscriptions.length > 0 ) {
    consumer.addTopics(pendingSubscriptions, function (err, added) {
      if ( undefined === added ) {
        console.log( "Subscription failed again: " + JSON.stringify(err));
      } else {
        console.log("Topic " + pendingSubscriptions + " added" + JSON.stringify(added));
        pendingSubscriptions.length = 0;   
      }

    }, false);  
  }
};

consumer.on('ready' , function() {
  console.log('Kafka connection ready');
  subscribePending();
});

consumer.on('error', function(error) {
  console.log("There was an error" + JSON.stringify(error));
});

exports.subscribeTopic = function( rTopic ) {
  consumer.addTopics([{ topic: rTopic}], function (err, added) {
    if ( undefined === added ) {
      pendingSubscriptions.push(rTopic);
    } else {
      console.log("Topic " + rTopic + " added" + JSON.stringify(added));    
    }

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


