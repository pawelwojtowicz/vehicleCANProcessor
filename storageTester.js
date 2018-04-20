var storage = require('./common_modules/genericStorage.js');

setInterval( function()  {	
	storage.getHashMap( "serverList", function( serverList) {
		console.log(JSON.stringify(serverList));	
	});
}, 2000 );
