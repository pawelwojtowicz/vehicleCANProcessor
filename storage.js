var redis = require('redis');
var client = redis.createClient();

client.on(error, function( err) {
    console.log((new Date()), 'Redis Error' + JSON.stringify(err));
});
