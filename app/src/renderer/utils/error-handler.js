/**
 * Error handling utility for renderer processes
 */

const errorHandler = {
  /**
   * Initialize global error handlers
   */
  init() {
    window.onerror = (message, source, lineno, colno, error) => {
      this.handleError(error || {
        message,
        source,
        lineno,
        colno,
      });
    };

    window.onunhandledrejection = (event) => {
      this.handleError(event.reason);
    };
  },

  /**
   * Handle an error
   * @param {Error|Object} error - The error to handle
   */
  handleError(error) {
    console.error("Application error:", error);
    
    // Log to main process
    window.electronAPI.logError({
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    
    // Show to user if serious
    if (this.isSeriousError(error)) {
      window.electronAPI.showErrorBox(
        "Application Error",
        `Something went wrong: ${error.message || String(error)}`
      );
    }
  },

  /**
   * Determine if an error is serious enough to show to the user
   * @param {Error|Object} error - The error to check
   * @returns {boolean}
   */
  isSeriousError(error) {
    // Customize logic for determining serious errors
    const message = String(error.message || error);
    const notSerious = [
      "network error",
      "canceled",
      "aborted",
    ].some(term => message.toLowerCase().includes(term));
    
    return !notSerious;
  }
};

export default errorHandler;
