const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Initialize SimConnect service (IPC handlers)
const simConnectService = require('./src/services/simconnect-main');

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

app.whenReady().then(createWindow);

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
