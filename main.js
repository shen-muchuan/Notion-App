const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    show: false,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    trafficLightPosition: { x: 18, y: 18 },
    webPreferences: {
      sandbox: true,
      spellcheck: false
    }
  });

  win.webContents.on('did-finish-load', () => {
    const path = require('path');
    const fs = require('fs');
    const css = fs.readFileSync(path.join(__dirname, 'macos.css'), 'utf8');
    win.webContents.insertCSS(css);
    const js = fs.readFileSync(path.join(__dirname, 'inject.js'), 'utf8');
    win.webContents.executeJavaScript(js);
  });

  win.loadURL('https://www.notion.so');

  // Show window when it is ready to display
  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(createWindow);