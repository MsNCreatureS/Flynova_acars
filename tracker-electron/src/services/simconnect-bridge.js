// SimConnect Bridge for Electron Renderer Process
// This bridges the gap between renderer and node-simconnect

const path = require('path');

class SimConnectBridge {
  constructor() {
    this.MSFSSimConnect = null;
    this.loaded = false;
  }

  load() {
    if (this.loaded) {
      return this.MSFSSimConnect;
    }

    try {
      // Load from the correct absolute path
      const simconnectPath = path.join(__dirname, 'simconnect.js');
      const { MSFSSimConnect } = require(simconnectPath);
      this.MSFSSimConnect = MSFSSimConnect;
      this.loaded = true;
      console.log('✅ SimConnect bridge loaded successfully');
      return MSFSSimConnect;
    } catch (error) {
      console.error('❌ Failed to load SimConnect:', error.message);
      throw error;
    }
  }

  isAvailable() {
    try {
      this.load();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton
const bridge = new SimConnectBridge();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = bridge;
}
