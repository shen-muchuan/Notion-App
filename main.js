const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    minWidth: 660,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    trafficLightPosition: { x: 18, y: 18 },
    autoHideMenuBar: false,
    webPreferences: {
      sandbox: false,
      spellcheck: false,
      preload: path.join(__dirname, 'preload-macos.js'),
      nodeIntegration: false,
      contextIsolation: false,
      enableRemoteModule: false,
    }
  });

  win.webContents.on('did-finish-load', () => {
    const cssPath = path.join(__dirname, 'macos.css');

    if (fs.existsSync(cssPath)) {
      fs.readFile(cssPath, 'utf8', (err, css) => {
        if (err) {
          console.error(`Failed to read macos.css:`, err);
        } else {
          win.webContents.insertCSS(css).catch(console.error);
        }
      });
    } else {
      console.error('macos.css not found.');
    }

    const jsPath = path.join(__dirname, 'inject.js');
    fs.readFile(jsPath, 'utf8', (err, js) => {
      if (err) {
        console.error(`Failed to read inject.js:`, err);
      } else {
        win.webContents.executeJavaScript(js).catch(console.error);
      }
    });
  });

  win.loadURL('https://www.notion.so').catch(console.error);

  win.once('ready-to-show', () => {
    win.show();
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.includes('notion.so')) {
      shell.openExternal(url).catch(console.error);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (!url.includes('notion.so')) {
      event.preventDefault();
      shell.openExternal(url).catch(console.error);
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});