exports.updateServerList = function( storage,  websocketClient ) {
  storage.getHashMap( "serverList", function( serverMap ) {
    var serverList =[];
    for ( var key in serverMap ) {
      if ( serverMap.hasOwnProperty(key) ) {
        var serverEntry = JSON.parse(serverMap[key]);
        serverList.push(serverEntry); 
      };
    }
    var updateMsg = {
      type : 'srvStatsUpdate', 
      data : serverList
    };
    websocketClient.send(JSON.stringify(updateMsg) );
  });
};
