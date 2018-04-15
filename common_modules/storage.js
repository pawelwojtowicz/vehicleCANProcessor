var redis = require('redis');
var Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var redisClient = redis.createClient();

redisClient.on('error', function( err) {
    console.log((new Date()), 'Redis Error' + JSON.stringify(err));
});

exports.setValue = async function( name, value ) {
	await redisClient.setAsync( name, value );
};

exports.getValue = async function ( name ) {
	const value = await redisClient.getAsync(name);

	console.log( "Storage " + JSON.stringify(value) );
	return value;
}
