var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var client = new kafka.Client();
var producer = new Producer(client);


producer.on('ready', function () {
  console.log("connected to Kafka");
});

producer.on('error', function (err) {
  console.log("Error", JSON.stringify(err));
});

exports.publish = function ( topic, key, message , callback) {
  var msg = new KeyedMessage( key, message );
  var payload = [ { topic: topic, messages: msg, partition: 0 } ];
  producer.send( payload, callback );
};
