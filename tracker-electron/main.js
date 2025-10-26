const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Initialize SimConnect service (IPC handlers)
const simConnectService = require('./src/services/simconnect-main');

// Initialize Discord Rich Presence
let discordPresence = null;
try {
  discordPresence = require('./src/services/discord-presence');
  console.log('✅ Discord module loaded');
} catch (error) {
  console.log('⚠️ Discord module not available:', error.message);
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: true,
    icon: path.join(__dirname, 'assets/icon.png'),
    backgroundColor: '#1a1a1a',
    show: false
  });

  mainWindow.loadFile('src/pages/login.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  
  // Initialize Discord Rich Presence au démarrage
  if (discordPresence) {
    discordPresence.connect()
      .then(() => {
        console.log('✅ Discord initialized at startup');
        // Mettre une présence par défaut
        discordPresence.updatePresence({
          flight: {},
          route: { flight_number: 'FlyNova ACARS', departure_icao: '', arrival_icao: '' },
          va: { name: 'FlyNova' },
          phase: 'Idle',
          currentState: { aircraftType: 'Ready to fly', altitude: 0, groundSpeed: 0 }
        }).catch(err => console.log('⚠️ Discord update failed:', err.message));
      })
      .catch(err => console.log('⚠️ Discord connection failed:', err.message));
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('get-user-data', () => {
  return {
    appPath: app.getPath('userData'),
    appVersion: app.getVersion()
  };
});

// Discord Rich Presence IPC Handler
ipcMain.handle('discord-update', async (event, flightInfo) => {
  if (discordPresence) {
    try {
      // Log les données reçues
      console.log('📥 Discord IPC received:', {
        flightNumber: flightInfo.route?.flight_number,
        departure: flightInfo.route?.departure_icao,
        arrival: flightInfo.route?.arrival_icao,
        va: flightInfo.va?.name,
        phase: flightInfo.phase
      });
      
      await discordPresence.updatePresence(flightInfo);
      return { success: true };
    } catch (error) {
      console.error('Discord update error:', error);
      return { success: false, error: error.message };
    }
  }
  return { success: false, error: 'Discord not available' };
});

// Cleanup Discord on quit
app.on('before-quit', () => {
  if (discordPresence) {
    discordPresence.disconnect().catch(err => console.log('Discord disconnect error:', err));
  }
});
