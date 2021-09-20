const path = require('path');
const {app, BrowserWindow, Menu} = require('electron');
const isMac = () => process.platform === 'darwin';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let splashWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    icon: './resources/icon.png',
    width: 630,
    height: 630,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    show: false
  });

  const menu = Menu.buildFromTemplate([
    {
      label: '&Menu',
      submenu: [
        {
          label: 'Exit',
          click() {
            app.quit();
          },
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.once('show', () => {
    if (!splashWindow) {
      return;
    }

    splashWindow.destroy();
  });

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      return;
    }

    mainWindow.show();
  });

  return mainWindow.loadURL(`file://${path.resolve(__dirname, 'index.html')}`);
};

const createSplashWindow = () => {
  splashWindow = new BrowserWindow({
    width: 630,
    height: 630,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false
  });

  splashWindow.on('closed', () => {
    splashWindow = null;
  });

  splashWindow.once('ready-to-show', () => {
    if (!splashWindow) {
      return;
    }

    splashWindow.show();
  });

  return splashWindow.loadURL(`file://${path.resolve(__dirname, 'splash.html')}`);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await createSplashWindow();
  await createMainWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac()) {
    app.quit();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    await createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
