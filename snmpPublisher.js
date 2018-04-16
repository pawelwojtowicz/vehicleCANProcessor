var snmp = require('snmpjs');
var logger = require('bunyan');

var log = new logger({
	name: 'snmpd',
	level: 'info'
});

var agent = snmp.createAgent( { log: log } );

var vehicleOid = '.1.3.6.1.4.1.48508.333.8130';


var generateMIBEntry = function( prq ) {
	var returnValue = "n/a";

	var oidAddressLength = prq._addr.length;

	if ( oidAddressLength > 9) {
		var techVehicleNumber = prq._addr[8];
		var valueIndex = prq._addr[9];

		if ( 1 === valueIndex ) {
			//geoPosition
		} else if ( 2 === valueIndex ) {
			//speed
		} else if ( 3 === valueIndex ) {
			//tellTale			
			if ( 10 < oidAddressLength )
			{
				var tellTaleId = prq._addr[10];
			}
			
		}

	}

	var val = snmp.data.createData( { type: 'OctetString', value: returnValue });

	snmp.provider.readOnlyScalar( prq , val );
};

agent.request( { oid: vehicleOid , handler: generateMIBEntry , columns : [ "1", "2", "3"]} );

export.initialize = function( vehicleData ) {
	dataProvider = vehicleData;
	agent.bind( { family: 'udp4', port: 162 });
};

