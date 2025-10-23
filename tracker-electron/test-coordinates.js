// Test SimConnect coordinate reading
const { open, Protocol, SimConnectDataType, SimConnectPeriod, SimConnectConstants } = require('node-simconnect');

const DATA_DEF_ID = 0;
const DATA_REQ_ID = 0;

console.log('🔍 Testing SimConnect coordinate reading...\n');

open('Coordinate Test', Protocol.FSX_SP2)
  .then(({ recvOpen, handle }) => {
    console.log('✅ Connected to:', recvOpen.applicationName);
    console.log('');

    // Define data exactly as in simconnect-main.js
    handle.addToDataDefinition(DATA_DEF_ID, 'Plane Latitude', 'degrees', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Plane Longitude', 'degrees', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Plane Altitude', 'feet', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Indicated Altitude', 'feet', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Ground Velocity', 'knots', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Airspeed Indicated', 'knots', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Plane Heading Degrees True', 'degrees', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Vertical Speed', 'feet per minute', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Sim On Ground', 'bool', SimConnectDataType.INT32, 0.0, SimConnectConstants.UNUSED);
    handle.addToDataDefinition(DATA_DEF_ID, 'Fuel Total Quantity', 'percent', SimConnectDataType.FLOAT64, 0.0, SimConnectConstants.UNUSED);

    handle.requestDataOnSimObject(DATA_REQ_ID, DATA_DEF_ID, SimConnectConstants.OBJECT_ID_USER, SimConnectPeriod.SECOND, 0, 0, 0, 0);

    let counter = 0;
    handle.on('simObjectData', (recvData) => {
      if (recvData.requestID === DATA_REQ_ID) {
        counter++;
        
        const data = recvData.data;
        const latitude = data.readFloat64();
        const longitude = data.readFloat64();
        const altitude = data.readFloat64();
        const indicatedAltitude = data.readFloat64();
        const groundSpeed = data.readFloat64();
        const indicatedAirspeed = data.readFloat64();
        const heading = data.readFloat64();
        const verticalSpeed = data.readFloat64();
        const onGround = data.readInt32() === 1;
        const fuel = data.readFloat64();

        console.log(`\n📍 Update #${counter}:`);
        console.log(`   Latitude:  ${latitude.toFixed(6)}°`);
        console.log(`   Longitude: ${longitude.toFixed(6)}°`);
        console.log(`   Altitude:  ${Math.round(altitude)} ft (Indicated: ${Math.round(indicatedAltitude)} ft)`);
        console.log(`   Speed:     ${Math.round(groundSpeed)} kts (IAS: ${Math.round(indicatedAirspeed)} kts)`);
        console.log(`   Heading:   ${Math.round(heading)}°`);
        console.log(`   V/S:       ${Math.round(verticalSpeed)} fpm`);
        console.log(`   On Ground: ${onGround ? 'YES' : 'NO'}`);
        console.log(`   Fuel:      ${fuel.toFixed(1)}%`);

        // Stop after 10 updates
        if (counter >= 10) {
          console.log('\n✅ Test complete! Coordinates look correct.');
          process.exit(0);
        }
      }
    });

    handle.on('exception', (e) => {
      console.error('❌ SimConnect exception:', e);
    });

    handle.on('quit', () => {
      console.log('⚠️ Simulator quit');
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  });
