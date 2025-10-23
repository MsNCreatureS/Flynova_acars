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

    this.handle.requestDataOnSimObject(
      this.DATA_REQUEST_ID,
      this.DATA_DEFINITION_ID,
      SimConnectConstants.OBJECT_ID_USER,
      SimConnectPeriod.SECOND
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
