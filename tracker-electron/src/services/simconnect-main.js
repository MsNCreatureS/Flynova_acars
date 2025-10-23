// SimConnect Service for Main Process
// Handles SimConnect connection in Electron main process

const { ipcMain } = require('electron');
const { open, Protocol, SimConnectDataType, SimConnectPeriod, SimConnectConstants } = require('node-simconnect');

class SimConnectService {
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
    
    this.DATA_DEFINITION_ID = 0;
    this.DATA_REQUEST_ID = 0;
    
    this.setupIPC();
  }

  setupIPC() {
    // Connect request
    ipcMain.handle('simconnect:connect', async () => {
      try {
        await this.connect();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Get data request
    ipcMain.handle('simconnect:getData', async () => {
      if (!this.connected) {
        return { success: false, error: 'Not connected' };
      }
      return { success: true, data: this.currentData };
    });

    // Disconnect request
    ipcMain.handle('simconnect:disconnect', async () => {
      await this.disconnect();
      return { success: true };
    });
  }

  async connect() {
    if (this.connected) {
      return;
    }

    console.log('🔌 [Main] Connecting to MSFS SimConnect...');
    
    const result = await open('FlyNova ACARS', Protocol.FSX_SP2);
    
    this.handle = result.handle;
    this.connected = true;

    console.log('✅ [Main] Connected to', result.recvOpen.applicationName);

    // Setup event handlers
    this.setupEventHandlers();
    
    // Setup data definitions
    this.setupDataDefinitions();
  }

  setupEventHandlers() {
    this.handle.on('simObjectData', (recvSimObjectData) => {
      if (recvSimObjectData.requestID === this.DATA_REQUEST_ID) {
        try {
          const data = recvSimObjectData.data;
          
          this.currentData = {
            latitude: data.readFloat64(),
            longitude: data.readFloat64(),
            altitude: data.readFloat64(),
            indicatedAltitude: data.readFloat64(),
            groundSpeed: data.readFloat64(),
            indicatedAirspeed: data.readFloat64(),
            heading: data.readFloat64(),
            verticalSpeed: data.readFloat64(),
            onGround: data.readInt32() === 1,
            fuel: data.readFloat64()
          };

          // Debug log every 60 seconds (60 updates)
          if (!this.debugCounter) this.debugCounter = 0;
          this.debugCounter++;
          if (this.debugCounter >= 10) {
            console.log('📍 [SimConnect Data]', {
              lat: this.currentData.latitude.toFixed(6),
              lon: this.currentData.longitude.toFixed(6),
              alt: Math.round(this.currentData.altitude),
              vs: Math.round(this.currentData.verticalSpeed),
              speed: Math.round(this.currentData.groundSpeed),
              onGround: this.currentData.onGround
            });
            this.debugCounter = 0;
          }
        } catch (error) {
          console.error('[Main] Error reading SimConnect data:', error);
        }
      }
    });

    this.handle.on('exception', (recvException) => {
      console.error('❌ [Main] SimConnect exception:', recvException);
    });

    this.handle.on('quit', () => {
      console.log('⚠️ [Main] Simulator quit');
      this.connected = false;
    });

    this.handle.on('close', () => {
      console.log('⚠️ [Main] Connection closed unexpectedly');
      this.connected = false;
    });
  }

  setupDataDefinitions() {
    // Add data definitions with epsilon and datumID parameters
    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Plane Latitude',
      'degrees',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Plane Longitude',
      'degrees',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Plane Altitude',
      'feet',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Indicated Altitude',
      'feet',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Ground Velocity',
      'knots',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Airspeed Indicated',
      'knots',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Plane Heading Degrees True',
      'degrees',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Vertical Speed',
      'feet per minute',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Sim On Ground',
      'bool',
      SimConnectDataType.INT32,
      0.0,
      SimConnectConstants.UNUSED
    );

    this.handle.addToDataDefinition(
      this.DATA_DEFINITION_ID,
      'Fuel Total Quantity',
      'percent',
      SimConnectDataType.FLOAT64,
      0.0,
      SimConnectConstants.UNUSED
    );

    // Request data every second with all parameters
    this.handle.requestDataOnSimObject(
      this.DATA_REQUEST_ID,
      this.DATA_DEFINITION_ID,
      SimConnectConstants.OBJECT_ID_USER,
      SimConnectPeriod.SECOND,
      0,
      0,
      0,
      0
    );

    console.log('✅ [Main] SimConnect data definitions configured');
  }

  async disconnect() {
    if (this.handle) {
      this.connected = false;
      console.log('✅ [Main] SimConnect disconnected');
    }
  }
}

// Export singleton
module.exports = new SimConnectService();
