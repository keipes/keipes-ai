const { app, BrowserWindow } = require("electron");
const { createMainWindow } = require("./windows/main-window");
const { createApplicationMenu } = require("./menu/application-menu");
const { setupIpcHandlers } = require("./services/ipc-service");
const logger = require("./services/logger");

// App event listeners
app.whenReady().then(() => {
  logger.info(`Starting application v${app.getVersion()}`);
  
  try {
    createMainWindow();
    createApplicationMenu();
    setupIpcHandlers();
    
    logger.info("Application started successfully");
  } catch (error) {
    logger.error("Failed to initialize application", error);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  logger.info("All windows closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle app quit
app.on("quit", () => {
  logger.info("Application shutting down");
});
