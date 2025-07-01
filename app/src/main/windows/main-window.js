const { BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createMainWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
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
    mainWindow.show();
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

function getMainWindow() {
  return mainWindow;
}

function closeAllWindows() {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
}

module.exports = {
  createMainWindow,
  getMainWindow,
  closeAllWindows,
};
