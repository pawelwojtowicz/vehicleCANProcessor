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

	console.log("writing to: " + JSON.stringify(mapRepresentation));

  const result = await redis.hmest( hashMapName, mapRepresentation );
console.log("zapisano mape")
  console.log(result);
}




exports.getHashMap = async function ( key ) {
	const result = await redis.getAsync( "trapeze_test2" );
}

exports.setValue = async function( name, value ) {
	await redisClient.setAsync( name, value );
};

exports.getValue = async function ( name ) {
	const value = await redisClient.getAsync(name);

	console.log( "Storage " + JSON.stringify(value) );
	return value;
}
