/**
 * Common utility functions
 */

interface DOMUtils {
  select<T extends Element = Element>(
    selector: string,
    required?: boolean
  ): T | null;
  selectAll<T extends Element = Element>(selector: string): NodeListOf<T>;
  on<T extends HTMLElement>(
    element: T | null,
    event: string,
    handler: EventListener
  ): void;
}

interface StorageUtils {
  get<T = any>(key: string, defaultValue: T): T;
  set(key: string, value: any): boolean;
}

interface TimeUtils {
  sleep(ms: number): Promise<void>;
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void;
}

export const DOM: DOMUtils = {
  /**
   * Safe query selector with error handling
   */
  select<T extends Element = Element>(
    selector: string,
    required: boolean = true
  ): T | null {
    const element = document.querySelector<T>(selector);
    if (!element && required) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  },

  /**
   * Select all elements with error handling
   */
  selectAll<T extends Element = Element>(selector: string): NodeListOf<T> {
    return document.querySelectorAll<T>(selector);
  },

  /**
   * Add event listener with error handling
   */
  on<T extends HTMLElement>(
    element: T | null,
    event: string,
    handler: EventListener
  ): void {
    if (element && typeof handler === "function") {
      element.addEventListener(event, handler);
    }
  },
};

export const Storage: StorageUtils = {
  /**
   * Get from localStorage with JSON parsing
   */
  get<T = any>(key: string, defaultValue: T): T {
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
  set(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};

export const Time: TimeUtils = {
  /**
   * Sleep utility for async operations
   */
  sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * Debounce function calls
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>): void {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};
