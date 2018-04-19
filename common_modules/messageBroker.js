var redis = require('redis');
var broker = redis.createClient();

var subscribers = new Map();


broker.on('message' , function( channel, message ) {
	var subscriber = subscribers.get(channel);

	if ( subscriber != null ) {
		subscriber( channel, message );
	}; 
});

exports.publish = function( channel, message ) {
	broker.publish( channel, message );
};

exports.subscribe = function( channel , callback) {
	subscribers.set(channel, callback);
	broker.subscribe(channel);
}



