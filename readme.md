# Notion App

This is a custom Electron-based desktop application for Notion, designed to provide an enhanced experience with macOS-specific features and improved link handling.

## Features

* **macOS Integration:**
    * Traffic light controls and hidden title bar for a native macOS look.
    * Sidebar vibrancy for a visually appealing experience.
* **Enhanced Link Handling:**
    * Opens external links (and downloads) in the default web browser, except for specific Notion subdomains.
    * Opens `mail.notion.so` and `calendar.notion.so` in the default browser.
* **Multi-Window Support:**
    * Allows opening multiple Notion windows.
* **Custom CSS and JavaScript Injection:**
    * Injects custom `macos.css` for visual enhancements.
    * Injects `inject.js` for behavior modifications.
* **Application Menu**
     * Adds a "File" -> "New Window" option to the menu.

## Technical Details

* **Electron Framework:** Built using Electron.
* **Customization:**
    * `main.js`:  Main process, handles window creation, link handling, and menu management.
    * `macos.css`:  Custom CSS for macOS-style interface.
    * `inject.js`: JavaScript code injected into the Notion web page.

## Prerequisites

* Node.js and npm

## Installation

1.  Clone this repository.
2.  Run `npm install` to install dependencies.
3.  Run `npm start` to launch the application.

## Important Notes

* **Context Isolation and Sandboxing**:  This application enables `contextIsolation` and `sandbox` for improved security.
* **Download Handling**:  Downloads, except for blob URLs, are configured to open in the system's default browser.
* **New Window Behavior**: New windows are opened with the same settings and styling as the main window.

##  Further Improvements

* **RAM Usage:** Electron applications can be memory-intensive.  Consider these to reduce RAM usage:
    * Optimize injected CSS and JavaScript.
    * Keep Electron updated.
    * Profile the application's memory usage.
* **Error Handling:** Robust error handling can be improved.
* **Update Mechanism:** Implement an auto-update mechanism.
