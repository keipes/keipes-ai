import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./windows/main-window";
import { createApplicationMenu } from "./menu/application-menu";
import { setupIpcHandlers } from "./services/ipc-service";
import logger = require("./services/logger");

import MCPClient from "./mcp/mcp-client";

// App event listeners
app.whenReady().then(() => {
  logger.info(`Starting application v${app.getVersion()}`);

  try {
    createMainWindow();
    createApplicationMenu();
    setupIpcHandlers();

    let mcpClient = new MCPClient();

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
