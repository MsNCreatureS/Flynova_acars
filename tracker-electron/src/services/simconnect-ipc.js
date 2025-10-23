// SimConnect IPC Client for Renderer Process
// Communicates with main process to access SimConnect

const { ipcRenderer } = require('electron');

class SimConnectIPCClient {
  constructor() {
    this.connected = false;
  }

  async connect() {
    console.log('🔌 [Renderer] Requesting SimConnect connection...');
    const result = await ipcRenderer.invoke('simconnect:connect');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to connect to SimConnect');
    }
    
    this.connected = true;
    console.log('✅ [Renderer] SimConnect connection established');
  }

  async getData() {
    if (!this.connected) {
      throw new Error('Not connected to SimConnect');
    }

    const result = await ipcRenderer.invoke('simconnect:getData');
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get data');
    }
    
    return result.data;
  }

  async disconnect() {
    if (this.connected) {
      await ipcRenderer.invoke('simconnect:disconnect');
      this.connected = false;
      console.log('✅ [Renderer] SimConnect disconnected');
    }
  }
}

// Export for use in flight-tracker
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimConnectIPCClient };
}
