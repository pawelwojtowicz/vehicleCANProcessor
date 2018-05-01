var redis = require('redis');
var broker = redis.createClient(6379, "redis", {
    retry_strategy: function (options) {
	console.log("RedisError: " + JSON.stringify(options.error));
        return Math.min(options.attempt * 100, 3000);
    }
});

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



