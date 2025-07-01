/**
 * Common utility functions
 */

export const DOM = {
  /**
   * Safe query selector with error handling
   */
  select(selector, required = true) {
    const element = document.querySelector(selector);
    if (!element && required) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  },

  /**
   * Select all elements with error handling
   */
  selectAll(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Add event listener with error handling
   */
  on(element, event, handler) {
    if (element && typeof handler === "function") {
      element.addEventListener(event, handler);
    }
  },
};

export const Storage = {
  /**
   * Get from localStorage with JSON parsing
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set to localStorage with JSON stringification
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};

export const Time = {
  /**
   * Sleep utility for async operations
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Debounce function calls
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};
