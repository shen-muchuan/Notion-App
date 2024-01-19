const { app, BrowserWindow, shell } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const isWindows = os.platform() === 'win32';

  const win = new BrowserWindow({
    show: false,
    minWidth: isWindows ? 660 : 660,
    minHeight: isWindows ? 400 : 400,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      sandbox: true,
      spellcheck: false,
      nodeIntegration: true
    }
  });

  win.webContents.on('did-finish-load', () => {
    const cssFile = isWindows ? 'windows.css' : 'macos.css';
    const css = fs.readFileSync(path.join(__dirname, cssFile), 'utf8');
    win.webContents.insertCSS(css);
    const js = fs.readFileSync(path.join(__dirname, 'inject.js'), 'utf8');
    win.webContents.executeJavaScript(js);
  });

  win.loadURL('https://www.notion.so');

  win.once('ready-to-show', () => {
    win.show();
  });

  // Intercept new-window events and open URLs in the default browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.includes('notion.so')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Intercept all navigation events
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.includes('notion.so')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});