/**
 * Enhanced error handling system
 */
/// <reference path="../../types/electron.d.ts" />

export class AppError extends Error {
  public readonly code: string;
  public readonly context: Record<string, any>;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: string = "UNKNOWN",
    context: Record<string, any> = {}
  ) {
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
} as const;

interface ErrorInfo {
  message: string;
  code: string;
  stack?: string;
  context: Record<string, any>;
  timestamp: string;
}

export class ErrorHandler {
  static async handleError(
    error: AppError | Error,
    showToUser: boolean = false
  ): Promise<void> {
    console.error("Application error:", error);

    // Log to main process
    if (window.electronAPI) {
      const errorInfo: ErrorInfo = {
        message: error.message,
        code: (error as AppError).code || "UNKNOWN",
        stack: error.stack,
        context: (error as AppError).context || {},
        timestamp: (error as AppError).timestamp || new Date().toISOString(),
      };
      window.electronAPI.logError(errorInfo);
    }

    // Show to user if requested or if it's a serious error
    if (showToUser || this.isSeriousError(error as AppError)) {
      await this.showErrorToUser(error as AppError);
    }
  }

  private static isSeriousError(error: AppError): boolean {
    const seriousCodes = [ErrorCodes.CONFIG_ERROR, ErrorCodes.NETWORK_ERROR];
    return (
      seriousCodes.includes(error.code as any) ||
      error.message.includes("API key") ||
      error.message.includes("authentication")
    );
  }

  private static async showErrorToUser(error: AppError): Promise<void> {
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
export function initializeErrorHandling(): void {
  window.onerror = (message, source, lineno, colno, error) => {
    const appError = new AppError(
      error?.message || String(message),
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
