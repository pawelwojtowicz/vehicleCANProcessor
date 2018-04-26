var envServerName = process.env.SRV_NAME;
var clientsCount = 0;
var processedMessages = 0;
var processedData = 0;
const serverRegistry = "serverList";

exports.setClientCount = function( count ) {
	clientsCount = count;
};

exports.updateStatistics = function( payloadSize ) {
	++processedMessages;
	processedData += payloadSize;	
};

exports.updateSrvStatistics = function ( storage ) {
	var serverEntry = {
		timeStamp : new Date(),
		serverName : envServerName,
		clientCount : clientsCount,
		messageCount : processedMessages,
		dataVolume : processedData  
	};

	console.log( "serverStats -" + JSON.stringify( serverEntry ));

	storage.storeValueInHashMap( serverRegistry ,  envServerName , JSON.stringify( serverEntry ) ); 	
};
