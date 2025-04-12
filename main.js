const { app, BrowserWindow, shell, ipcMain, session, Menu } = require('electron'); // Added Menu
const path = require('path');
const fs = require('fs');

let windows = new Set();

// --- Helper Function for CSS/JS Injection ---
function injectFiles(win) {
    // Inject CSS
    const cssPath = path.join(__dirname, 'macos.css'); // [cite: Notion-App/macos.css]
    if (fs.existsSync(cssPath)) {
        fs.readFile(cssPath, 'utf8', (err, css) => {
            if (err) {
                console.error(`Failed to read macos.css:`, err); // [cite: Notion-App/macos.css]
            } else if (!win.isDestroyed()) { // Check if window still exists
                win.webContents.insertCSS(css).catch(console.error); // [cite: Notion-App/main.js]
            }
        });
    } else {
        console.error('macos.css not found.'); // [cite: Notion-App/macos.css]
    }

    // Inject JS
    const jsPath = path.join(__dirname, 'inject.js'); // [cite: Notion-App/inject.js]
    fs.readFile(jsPath, 'utf8', (err, js) => {
        if (err) {
            console.error(`Failed to read inject.js:`, err); // [cite: Notion-App/inject.js]
        } else if (!win.isDestroyed()) { // Check if window still exists
            win.webContents.executeJavaScript(js).catch(console.error); // [cite: Notion-App/main.js]
        }
    });
}


function createWindow(urlToLoad = 'https://www.notion.so') {
    console.log(`Creating window for URL: ${urlToLoad}`);
    const win = new BrowserWindow({
        show: false,
        minWidth: 660,
        minHeight: 400,
        // --- Settings applied to ALL windows created by this function ---
        titleBarStyle: 'hiddenInset', // [cite: Notion-App/main.js]
        vibrancy: 'sidebar', // [cite: Notion-App/main.js]
        trafficLightPosition: { x: 19, y: 18 }, // [cite: Notion-App/main.js]
        autoHideMenuBar: false, // Menu bar needed for "New Window"
        webPreferences: {
            sandbox: true,                   // Enabled Sandbox
            contextIsolation: true,          // Enabled Context Isolation
            spellcheck: false, // [cite: Notion-App/main.js]
            nodeIntegration: false, // [cite: Notion-App/main.js]
            enableRemoteModule: false, // [cite: Notion-App/main.js]
        }
    });

    windows.add(win);

    // Inject CSS/JS when content finishes loading
    win.webContents.on('did-finish-load', () => { // [cite: Notion-App/main.js]
        console.log(`did-finish-load for: ${win.webContents.getURL()}`);
        injectFiles(win); // Use helper function
    });

    // --- Link Handling Configuration ---
    const allowedInternalHosts = ['notion.so'];
    const excludedInternalHosts = ['mail.notion.so', 'calendar.notion.so'];

    // --- Intercept window creation ---
    win.webContents.setWindowOpenHandler(({ url }) => { // [cite: Notion-App/main.js]
        console.log(`setWindowOpenHandler triggered for URL: ${url}`);
        try {
            const urlHostname = new URL(url).hostname;
            console.log(`Parsed hostname: ${urlHostname}`);

            // 1. Check excluded hosts -> Open externally
            if (excludedInternalHosts.includes(urlHostname)) {
                console.log(`Opening excluded host externally: ${urlHostname}`);
                shell.openExternal(url).catch(console.error); // [cite: Notion-App/main.js]
                return { action: 'deny' }; // [cite: Notion-App/main.js]
            }

            // 2. Check allowed hosts -> Open in new *custom* window
            if (allowedInternalHosts.some(host => urlHostname.endsWith(host))) {
                console.log(`Opening allowed host in new custom window: ${urlHostname}`);
                createWindow(url); // Pass the URL to the new window
                return { action: 'deny' }; // Deny default creation
            }

            // 3. All others -> Open externally
            console.log(`Opening other host externally: ${urlHostname}`);
            shell.openExternal(url).catch(console.error); // [cite: Notion-App/main.js]
            return { action: 'deny' }; // [cite: Notion-App/main.js]

        } catch (e) {
            console.error("Error parsing or handling URL in setWindowOpenHandler:", e, url);
            return { action: 'deny' };
        }
    });

     // --- Navigation Handling ---
     win.webContents.on('will-navigate', (event, url) => { // [cite: Notion-App/main.js]
         console.log(`will-navigate triggered for URL: ${url}`);
         try {
            const urlHostname = new URL(url).hostname;
            console.log(`Parsed hostname: ${urlHostname}`);

            // 1. Check excluded hosts -> Prevent navigation, open externally
            if (excludedInternalHosts.includes(urlHostname)) {
                console.log(`Preventing navigation to excluded host, opening externally: ${urlHostname}`);
                event.preventDefault(); // [cite: Notion-App/main.js]
                shell.openExternal(url).catch(console.error); // [cite: Notion-App/main.js]
                return;
            }

            // 2. Check allowed hosts -> Allow navigation within the window
            if (allowedInternalHosts.some(host => urlHostname.endsWith(host))) {
                 console.log(`Allowing navigation to allowed host: ${urlHostname}`);
                 return; // Allow default behavior (navigate)
            }

            // 3. All others -> Prevent navigation, open externally
            console.log(`Preventing navigation to other host, opening externally: ${urlHostname}`);
            event.preventDefault(); // [cite: Notion-App/main.js]
            shell.openExternal(url).catch(console.error); // [cite: Notion-App/main.js]

         } catch(e) {
              console.error("Error parsing or handling URL in will-navigate:", e, url);
              event.preventDefault(); // Prevent navigation on error
         }
    });

    // Load the initial or specified URL
    win.loadURL(urlToLoad).catch(console.error); // [cite: Notion-App/main.js]

    win.once('ready-to-show', () => { // [cite: Notion-App/main.js]
        if (!win.isDestroyed()) {
            win.show(); // [cite: Notion-App/main.js]
        }
    });

    win.on('closed', () => {
        console.log('Window closed');
        windows.delete(win);
    });

     return win;
}


// --- Create Application Menu ---
function createMenu() {
    const template = [
        {
            label: app.name,
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services' },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Window',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        createWindow(); // Call our function to ensure consistent setup
                    }
                },
                 { role: 'close' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                 { role: 'undo' },
                 { role: 'redo' },
                 { type: 'separator' },
                 { role: 'cut' },
                 { role: 'copy' },
                 { role: 'paste' },
                 { role: 'pasteAndMatchStyle' },
                 { role: 'delete' },
                 { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                 { role: 'window' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
         const menu = Menu.buildFromTemplate(template);
         Menu.setApplicationMenu(menu);
    } else {
         const menu = Menu.buildFromTemplate(template.slice(1));
         Menu.setApplicationMenu(menu);
    }
}

// --- App Lifecycle ---
app.whenReady().then(() => { // [cite: Notion-App/main.js]
    // --- Moved Download Handler INSIDE whenReady ---
    session.defaultSession.on('will-download', (event, item, webContents) => { // [cite: Notion-App/main.js]
        console.log(`will-download triggered for URL: ${item.getURL()}, MimeType: ${item.getMimeType()}, Filename: ${item.getFilename()}`);
        event.preventDefault(); // [cite: Notion-App/main.js]
        const downloadUrl = item.getURL();
        if (!downloadUrl.startsWith('blob:')) {
             console.log(`Opening download URL externally: ${downloadUrl}`);
             shell.openExternal(downloadUrl).catch(err => { // [cite: Notion-App/main.js]
                console.error('Failed to open download URL externally:', err, downloadUrl);
             });
        } else {
            console.warn('Blocked external opening of blob URL download:', downloadUrl);
        }
    });
    // ---------------------------------------------

    createMenu(); // Create the menu before the first window
    createWindow();

    app.on('activate', () => { // [cite: Notion-App/main.js]
        if (BrowserWindow.getAllWindows().length === 0) {
             createWindow();
        }
    });
});

app.on('window-all-closed', () => { // [cite: Notion-App/main.js]
    if (process.platform !== 'darwin') { // [cite: Notion-App/main.js]
        app.quit(); // [cite: Notion-App/main.js]
    }
});