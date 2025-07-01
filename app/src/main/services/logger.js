/**
 * Centralized logging service for main process
 */
const path = require("path");
const fs = require("fs");
const { app } = require("electron");

class Logger {
  constructor() {
    this.logDir = path.join(app.getPath("userData"), "logs");
    this.logFile = path.join(
      this.logDir,
      `app-${new Date().toISOString().split("T")[0]}.log`
    );

    // Ensure log directory exists
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (data) {
      if (typeof data === "object") {
        try {
          formattedMessage += ` ${JSON.stringify(data)}`;
        } catch (e) {
          formattedMessage += ` [Unstringifiable Object]`;
        }
      } else {
        formattedMessage += ` ${data}`;
      }
    }

    return formattedMessage;
  }

  log(level, message, data) {
    const formattedMessage = this.formatMessage(level, message, data);

    // Only use console in development mode or for important messages
    if (process.argv.includes("--dev") || ["error", "warn"].includes(level)) {
      // eslint-disable-next-line no-console
      console[level](formattedMessage);
    }

    // Log to file
    try {
      fs.appendFileSync(this.logFile, formattedMessage + "\n");
    } catch (error) {
      console.error(`Failed to write to log file: ${error}`);
    }
  }

  info(message, data) {
    this.log("info", message, data);
  }

  warn(message, data) {
    this.log("warn", message, data);
  }

  error(message, data) {
    this.log("error", message, data);
  }

  debug(message, data) {
    if (process.argv.includes("--dev")) {
      this.log("debug", message, data);
    }
  }
}

module.exports = new Logger();
