// SimConnect Integration for MSFS 2020
// This module handles real-time data from Microsoft Flight Simulator

class MSFSSimConnect {
  constructor() {
    this.handle = null;
    this.connected = false;
    this.currentData = {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      groundSpeed: 0,
      heading: 0,
      verticalSpeed: 0,
      onGround: true,
      fuel: 100,
      indicatedAirspeed: 0,
      indicatedAltitude: 0
    };
    
    // Data definition IDs
    this.DATA_DEFINITION_ID = 0;
    this.DATA_REQUEST_ID = 0;
    
    // Try to load node-simconnect
    this.simConnectLib = null;
    try {
      this.simConnectLib = require('node-simconnect');
      console.log('✅ node-simconnect module loaded');
    } catch (error) {
      console.warn('⚠️ node-simconnect not available:', error.message);
    }
  }

  async connect() {
    if (!this.simConnectLib) {
      throw new Error('node-simconnect not available. Run: npm install node-simconnect');
    }

    const { open, Protocol } = this.simConnectLib;

    return new Promise((resolve, reject) => {
      console.log('🔌 Connecting to MSFS SimConnect...');
      
      open('FlyNova ACARS', Protocol.FSX_SP2)
        .then(({ recvOpen, handle }) => {
          console.log('✅ Connected to', recvOpen.applicationName);
          this.handle = handle;
          this.connected = true;

          // Setup event handlers
          this.setupEventHandlers();
          
          // Setup data definitions
          this.setupDataDefinitions();

          resolve();
        })
        .catch((error) => {
          console.error('❌ SimConnect connection failed:', error.message);
          reject(error);
        });
    });
  }

  setupEventHandlers() {
    // Handle simulator data
    this.handle.on('simObjectData', (recvSimObjectData) => {
      if (recvSimObjectData.requestID === this.DATA_REQUEST_ID) {
        try {
          // Read data in the same order as defined
          this.currentData = {
            latitude: recvSimObjectData.data.readFloat64(),
            longitude: recvSimObjectData.data.readFloat64(),
            altitude: recvSimObjectData.data.readFloat64(),
            indicatedAltitude: recvSimObjectData.data.readFloat64(),
            groundSpeed: recvSimObjectData.data.readFloat64(),
            indicatedAirspeed: recvSimObjectData.data.readFloat64(),
            heading: recvSimObjectData.data.readFloat64(),
            verticalSpeed: recvSimObjectData.data.readFloat64(),
            onGround: recvSimObjectData.data.readInt32() === 1,
            fuel: recvSimObjectData.data.readFloat64()
          };
        } catch (error) {
          console.error('Error reading SimConnect data:', error);
        }
      }
    });

    // Handle exceptions
    this.handle.on('exception', (recvException) => {
      console.error('❌ SimConnect exception:', recvException);
    });

    // Handle simulator quit
    this.handle.on('quit', () => {
      console.log('⚠️ Simulator quit');
      this.connected = false;
    });

    // Handle unexpected disconnection
    this.handle.on('close', () => {
      console.log('⚠️ Connection closed unexpectedly');
      this.connected = false;
    });
  }

  setupDataDefinitions() {
    const { SimConnectDataType, SimConnectPeriod, SimConnectConstants } = this.simConnectLib;

    // Define the data structure we want to receive
    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'PLANE LATITUDE',
      'degrees',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'PLANE LONGITUDE',
      'degrees',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'PLANE ALTITUDE',
      'feet',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'INDICATED ALTITUDE',
      'feet',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'GROUND VELOCITY',
      'knots',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'AIRSPEED INDICATED',
      'knots',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'PLANE HEADING DEGREES TRUE',
      'degrees',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'VERTICAL SPEED',
      'feet per minute',
      SimConnectDataType.FLOAT64
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'SIM ON GROUND',
      'bool',
      SimConnectDataType.INT32
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'FUEL TOTAL QUANTITY',
      'percent',
      SimConnectDataType.FLOAT64
    );

    // Request data updates every second
    this.handle.requestDataOnSimObject(
      this.DATA_REQUEST_ID,
      this.DATA_DEFINITION_ID,
      SimConnectConstants.OBJECT_ID_USER,
      SimConnectPeriod.SECOND
    );

    console.log('✅ SimConnect data definitions configured');
  }

  async getData() {
    if (!this.connected) {
      throw new Error('Not connected to SimConnect');
    }

    // Return the current data (updated automatically by SimConnect)
    return { ...this.currentData };
  }

  async disconnect() {
    if (this.handle) {
      try {
        // Note: node-simconnect doesn't have an explicit close method
        // The connection will be closed automatically when the process ends
        this.connected = false;
        console.log('✅ SimConnect disconnected');
      } catch (error) {
        console.error('Error disconnecting SimConnect:', error);
      }
    }
  }
}

// Export the class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MSFSSimConnect };
}
