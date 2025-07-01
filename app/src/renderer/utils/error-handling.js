/**
 * Enhanced error handling system
 */

export class AppError extends Error {
  constructor(message, code = "UNKNOWN", context = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export const ErrorCodes = {
  NETWORK_ERROR: "NETWORK_ERROR",
  API_ERROR: "API_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

export class ErrorHandler {
  static async handleError(error, showToUser = false) {
    console.error("Application error:", error);

    // Log to main process
    if (window.electronAPI) {
      window.electronAPI.logError({
        message: error.message,
        code: error.code || "UNKNOWN",
        stack: error.stack,
        context: error.context || {},
        timestamp: error.timestamp || new Date().toISOString(),
      });
    }

    // Show to user if requested or if it's a serious error
    if (showToUser || this.isSeriousError(error)) {
      await this.showErrorToUser(error);
    }
  }

  static isSeriousError(error) {
    const seriousCodes = [ErrorCodes.CONFIG_ERROR, ErrorCodes.NETWORK_ERROR];
    return (
      seriousCodes.includes(error.code) ||
      error.message.includes("API key") ||
      error.message.includes("authentication")
    );
  }

  static async showErrorToUser(error) {
    if (window.electronAPI) {
      window.electronAPI.showErrorBox(
        "Error",
        `${error.message}\n\nCode: ${error.code || "Unknown"}`
      );
    } else {
      alert(`Error: ${error.message}`);
    }
  }
}

// Initialize global error handlers
export function initializeErrorHandling() {
  window.onerror = (message, source, lineno, colno, error) => {
    const appError = new AppError(
      error?.message || message,
      ErrorCodes.UNKNOWN_ERROR,
      { source, lineno, colno }
    );
    ErrorHandler.handleError(appError);
  };

  window.onunhandledrejection = (event) => {
    const appError = new AppError(
      event.reason?.message || "Unhandled promise rejection",
      ErrorCodes.UNKNOWN_ERROR,
      { reason: event.reason }
    );
    ErrorHandler.handleError(appError);
  };
}
