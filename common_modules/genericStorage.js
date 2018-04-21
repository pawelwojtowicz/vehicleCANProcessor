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

  const result = await redisClient.hset( hashMapName, mapRepresentation );
  //console.log("writing " + JSON.stringify(mapRepresentation) + " to REDIS status=" + result);
}

exports.storeValueInHashMap = function( hashMapName , key, value ) {
	redisClient.hmset( hashMapName, key, value);
}


exports.getHashMap = function ( key , callback) {
	redisClient.hgetall( key , function(err, obj) {
	  callback(obj);  
	} );
}

exports.getAllKeys = function( allKeysListener ) {
	redisClient.keys('*' , function(err, keys) {
		allKeysListener(keys);	
	});
};

exports.setValue = async function( name, value ) {
	await redisClient.setAsync( name, value );
};

exports.getValue = async function ( name ) {
	const value = await redisClient.getAsync(name);

	console.log( "Storage " + JSON.stringify(value) );
	return value;
}
