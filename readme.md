# Nativelike Notion

This project provides a custom Electron wrapper for the Notion web application, enhancing the user experience with macOS-specific UI elements, improved link/download handling, and minor behavior modifications.

## Features

* **Native macOS Aesthetics:**
    * Integrates traffic light window controls within the header (`titleBarStyle: 'hiddenInset'`)
    * Applies sidebar vibrancy effect (`vibrancy: 'sidebar'`)
    * Injects custom CSS (`macos.css`) for further UI adjustments
* **External Link Handling:**
    * Intercepts navigation and new window requests
    * Opens non-Notion URLs and downloads in the system's default external browser via `shell.openExternal`
    * Specifically routes `mail.notion.so` and `calendar.notion.so` URLs to the external browser
    * Handles downloads by preventing the default Electron behavior and opening the URL externally (excluding blob URLs)
* **Multi-Window Support:**
    * Allows multiple `BrowserWindow` instances, each loading Notion
    * Provides a "File" > "New Window" menu option (`CmdOrCtrl+N`)
    * New windows created via the menu or renderer requests (`window.open`, context menu) utilize the same custom `createWindow` function to ensure consistent styling and behavior
* **Behavior Modifications:**
    * Injects custom JavaScript (`inject.js`)
    * Modifies sidebar behavior to prevent automatic expansion on hover based on localStorage state changes (`inject.js`)
* **Security Enhancements:**
    * Renderer processes run with `contextIsolation: true` and `sandbox: true` enabled

## Screenshots

![screenshot 1](<screenshot/Screenshot 2025-04-12 at 11.28.17 PM.jpg>)

![screenshot 2](<screenshot/Screenshot 2025-04-12 at 11.32.16 PM.jpg>)

![screenshot 3](<screenshot/Screenshot 2025-04-12 at 11.35.45 PM.jpg>)

## Project Structure

```
Notion-App/
├── main.js           # Electron main process script
├── macos.css         # Custom CSS overrides for macOS look
├── inject.js         # Custom JavaScript injected into renderer
├── package.json      # Project manifest and dependencies
├── package-lock.json # Dependency lock file
└── README.md         # This file
```

## Setup and Usage

**Prerequisites:**

* Node.js
* npm (comes with Node.js)

**Running the Application:**

```bash
npm start
```

## Development Notes

* **Configuration:** Key behaviors like external link routing (`allowedInternalHosts`, `excludedInternalHosts`) and window properties are configured within `main.js`
* **Debugging:** Use the "View" > "Toggle Developer Tools" menu option for debugging renderer processes. Main process logs are output to the console where `npm start` was run
* **Potential Improvements:**
    * **Packaging/Distribution:** Configure `electron-builder` in `package.json` for creating distributable builds (requires setting `appId`, handling code signing, etc.)
    * **Auto-Update:** Integrate an update mechanism (e.g., `electron-updater`)

## License

Refer to the `LICENSE` file