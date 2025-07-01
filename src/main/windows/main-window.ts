import { BrowserWindow } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

export function createMainWindow(): BrowserWindow {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../../preload/api.js"),
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    show: false, // Don't show until ready
  });

  // Load the app
  if (process.argv.includes("--dev")) {
    // Load from Vite dev server
    mainWindow.loadURL("http://localhost:5173");
  } else {
    // Load built file
    mainWindow.loadFile(
      path.join(__dirname, "../../../dist/renderer/pages/index.html")
    );
  }

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Open DevTools in development
  if (process.argv.includes("--dev")) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function closeAllWindows(): void {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
}
