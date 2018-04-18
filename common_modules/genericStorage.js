var redis = require('redis');
var Promise = require('bluebird');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var redisClient = redis.createClient();

redisClient.on('error', function( err) {
    console.log((new Date()), 'Redis Error' + JSON.stringify(err));
});

exports.storeHashMap = async function( hashMapName, hashMap ) {
  var mapRepresentation = [];
  
  hashMap.forEach( function( value, key ) {
    mapRepresentation.push( key );
    mapRepresentation.push( value );
  });

  console.log("writing [" + JSON.stringify(mapRepresentation) + "] to REDIS");
  const result = await redisClient.hset( hashMapName, mapRepresentation );
  console.log(result);
}


exports.getHashMap = function ( key ) {
  console.log("getting hash map");
	const result = redisClient.hgetall( "trapeze_test2" , function(err, obj) {
	console.log(JSON.stringify(obj));
	} );
}

exports.setValue = async function( name, value ) {
	await redisClient.setAsync( name, value );
};

exports.getValue = async function ( name ) {
	const value = await redisClient.getAsync(name);

	console.log( "Storage " + JSON.stringify(value) );
	return value;
}
