const { app, BrowserWindow, ipcMain, nativeImage } = require('electron');
const path = require('path');
const Peer = require('./peer');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const instantiatePeer = (mainWindow) => {

  Peer.onready = async () => {
    const peerInfo = {
      peerId: Peer.orbitdb.id,
      identityId: Peer.orbitdb.identity.id,
      userdbAddr: Peer.user.address.toString(),
      piecedbAddr: Peer.pieces.address.toString()
    }

    ipcMain.handle('peer', () => peerInfo);
    ipcMain.handle('swarm', async () => (await Peer.getSwarms()).map(swarm => swarm.toString()));
    ipcMain.handle('bootstrap', async () => (await Peer.getBootstrap()).map(bootstrap => bootstrap.toString()));
    ipcMain.handle('connected-peers', async () => await Peer.getIpfsPeers());
    ipcMain.handle('topics', async () => await Peer.getTopics());

    ipcMain.on('add-bootstrap', async (_, multiAddr) => await Peer.addBootstrap(multiAddr));
    ipcMain.on('connect-to-peer', async (_, multiAddr) => await Peer.connectToPeer(multiAddr));
    ipcMain.on('subscribe', async (_, topic) => await Peer.subscribeTopic(topic, (msg) => mainWindow.webContents.send(topic, msg)))
    ipcMain.on('send-message', async (_, topic, msg) => await Peer.sendMessage(topic, msg));
  }

  Peer.create();
}


const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'decent',
    icon: nativeImage.createFromPath(path.join(app.getAppPath(), 'src/assets/icons/icon.png')),
    center: true,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, //* path.join(app.getAppPath(), 'src', 'preload.js')
      spellcheck: false,
    }
  });
  console.log(MAIN_WINDOW_WEBPACK_ENTRY);
  instantiatePeer(mainWindow);
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // mainWindow.webContents.on('did-finish-load', () => {})

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

