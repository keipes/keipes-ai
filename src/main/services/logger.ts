/**
 * Centralized logging service for main process
 */
import * as path from "path";
import * as fs from "fs";
import { app } from "electron";

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private logDir: string;
  private logFile: string;

  constructor() {
    this.logDir = path.join(app.getPath("userData"), "logs");
    this.logFile = path.join(
      this.logDir,
      `app-${new Date().toISOString().split("T")[0]}.log`
    );

    // Ensure log directory exists
    this.ensureLogDir();
  }

  private ensureLogDir(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
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

  private log(level: LogLevel, message: string, data?: any): void {
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

  public info(message: string, data?: any): void {
    this.log("info", message, data);
  }

  public warn(message: string, data?: any): void {
    this.log("warn", message, data);
  }

  public error(message: string, data?: any): void {
    this.log("error", message, data);
  }

  public debug(message: string, data?: any): void {
    if (process.argv.includes("--dev")) {
      this.log("debug", message, data);
    }
  }
}

const logger = new Logger();
export = logger;
