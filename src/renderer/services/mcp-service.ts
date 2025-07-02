/**
 * Model Context Protocol (MCP) Service
 * Manages MCP providers and handles protocol communication
 */
import { 
  MCPProtocol, 
  MCPProviderConfig, 
  MCPContextData, 
  MCPManagerConfig, 
  MCPResponse, 
  MCPProviderStatus, 
  MCPEvent, 
  MCPEventType, 
  MCPErrorCodes,
  MCPMessageOptions 
} from '../../shared/types/mcp-types.js';
import { CONFIG } from '../../shared/config.js';
import { ErrorHandler, AppError, ErrorCodes } from '../utils/error-handling.js';
import { Storage } from '../utils/common.js';
import { OpenAIMCPProvider } from './openai-mcp-provider.js';

class MCPService {
  private providers: Map<string, MCPProtocol> = new Map();
  private contexts: Map<string, MCPContextData> = new Map();
  private config: MCPManagerConfig;
  private eventListeners: Map<MCPEventType, Array<(event: MCPEvent) => void>> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      providers: [],
      defaultTimeout: CONFIG.MCP.DEFAULT_TIMEOUT,
      maxConcurrentContexts: CONFIG.MCP.MAX_CONCURRENT_CONTEXTS,
      contextRetentionTime: CONFIG.MCP.CONTEXT_RETENTION_TIME,
      enableLogging: CONFIG.MCP.ENABLE_LOGGING,
    };

    // Initialize event listeners map
    Object.values(MCPEventType).forEach(eventType => {
      this.eventListeners.set(eventType, []);
    });
  }

  /**
   * Initialize the MCP service
   */
  async initialize(): Promise<void> {
    try {
      // Load saved configurations
      await this.loadConfiguration();
      
      // Register default providers
      await this.registerDefaultProviders();
      
      // Load saved contexts
      await this.loadContexts();
      
      this.isInitialized = true;
      
      if (this.config.enableLogging) {
        console.info('MCP Service initialized successfully');
      }
    } catch (error) {
      throw new AppError(
        'Failed to initialize MCP Service',
        MCPErrorCodes.PROVIDER_INITIALIZATION_FAILED,
        { originalError: error }
      );
    }
  }

  /**
   * Register a new MCP provider
   */
  async registerProvider(config: MCPProviderConfig): Promise<void> {
    try {
      let provider: MCPProtocol;

      // Create provider instance based on type
      switch (config.providerId) {
        case 'openai-mcp':
          provider = new OpenAIMCPProvider();
          break;
        default:
          throw new AppError(
            `Unknown provider type: ${config.providerId}`,
            MCPErrorCodes.PROVIDER_NOT_FOUND
          );
      }

      // Initialize the provider
      await provider.initializeContext(config);
      
      // Store the provider
      this.providers.set(config.providerId, provider);
      
      // Update configuration
      const existingConfigIndex = this.config.providers.findIndex(p => p.providerId === config.providerId);
      if (existingConfigIndex >= 0) {
        this.config.providers[existingConfigIndex] = config;
      } else {
        this.config.providers.push(config);
      }
      
      // Save configuration
      await this.saveConfiguration();
      
      // Emit event
      this.emitEvent(MCPEventType.PROVIDER_REGISTERED, config.providerId, { config });

      if (this.config.enableLogging) {
        console.info(`MCP Provider registered: ${config.name} (${config.providerId})`);
      }
    } catch (error) {
      throw new AppError(
        `Failed to register MCP provider ${config.name}`,
        MCPErrorCodes.PROVIDER_INITIALIZATION_FAILED,
        { providerId: config.providerId, originalError: error }
      );
    }
  }

  /**
   * Unregister a provider
   */
  async unregisterProvider(providerId: string): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new AppError(
        `Provider not found: ${providerId}`,
        MCPErrorCodes.PROVIDER_NOT_FOUND
      );
    }

    try {
      // Clear provider context
      await provider.clearContext();
      
      // Remove from providers map
      this.providers.delete(providerId);
      
      // Remove from configuration
      this.config.providers = this.config.providers.filter(p => p.providerId !== providerId);
      await this.saveConfiguration();
      
      // Remove related contexts
      const contextsToRemove = Array.from(this.contexts.keys()).filter(
        key => key.startsWith(providerId)
      );
      contextsToRemove.forEach(key => this.contexts.delete(key));
      await this.saveContexts();
      
      // Emit event
      this.emitEvent(MCPEventType.PROVIDER_UNREGISTERED, providerId, {});

      if (this.config.enableLogging) {
        console.info(`MCP Provider unregistered: ${providerId}`);
      }
    } catch (error) {
      throw new AppError(
        `Failed to unregister provider ${providerId}`,
        ErrorCodes.UNKNOWN_ERROR,
        { providerId, originalError: error }
      );
    }
  }

  /**
   * Send a message through a specific provider
   */
  async sendMessage(
    providerId: string, 
    message: string, 
    options?: MCPMessageOptions
  ): Promise<MCPResponse> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new AppError(
        `Provider not found: ${providerId}`,
        MCPErrorCodes.PROVIDER_NOT_FOUND
      );
    }

    try {
      const response = await provider.sendMessage(message, options);
      
      // Update context cache
      const context = await provider.getContext();
      if (context) {
        this.contexts.set(`${providerId}:${context.sessionId}`, context);
        await this.saveContexts();
      }
      
      // Emit events
      this.emitEvent(MCPEventType.MESSAGE_SENT, providerId, { message, options });
      this.emitEvent(MCPEventType.MESSAGE_RECEIVED, providerId, { response });

      return response;
    } catch (error) {
      this.emitEvent(MCPEventType.ERROR_OCCURRED, providerId, { error, operation: 'sendMessage' });
      throw error;
    }
  }

  /**
   * Get provider status
   */
  async getProviderStatus(providerId: string): Promise<MCPProviderStatus> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new AppError(
        `Provider not found: ${providerId}`,
        MCPErrorCodes.PROVIDER_NOT_FOUND
      );
    }

    return await provider.getStatus();
  }

  /**
   * Get all provider statuses
   */
  async getAllProviderStatuses(): Promise<MCPProviderStatus[]> {
    const statuses: MCPProviderStatus[] = [];
    
    for (const [providerId, provider] of this.providers) {
      try {
        const status = await provider.getStatus();
        statuses.push(status);
      } catch (error) {
        // If we can't get status, create an error status
        statuses.push({
          providerId,
          status: 'error',
          lastActivity: 'unknown',
          contextCount: 0,
          errorCount: 1,
          capabilities: [],
        });
      }
    }
    
    return statuses;
  }

  /**
   * Clear context for a specific provider
   */
  async clearProviderContext(providerId: string): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new AppError(
        `Provider not found: ${providerId}`,
        MCPErrorCodes.PROVIDER_NOT_FOUND
      );
    }

    try {
      await provider.clearContext();
      
      // Remove from context cache
      const contextsToRemove = Array.from(this.contexts.keys()).filter(
        key => key.startsWith(providerId)
      );
      contextsToRemove.forEach(key => this.contexts.delete(key));
      await this.saveContexts();
      
      this.emitEvent(MCPEventType.CONTEXT_CLEARED, providerId, {});
    } catch (error) {
      this.emitEvent(MCPEventType.ERROR_OCCURRED, providerId, { error, operation: 'clearContext' });
      throw error;
    }
  }

  /**
   * Get list of registered providers
   */
  getRegisteredProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Add event listener
   */
  addEventListener(eventType: MCPEventType, listener: (event: MCPEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.push(listener);
    }
  }

  /**
   * Remove event listener
   */
  removeEventListener(eventType: MCPEventType, listener: (event: MCPEvent) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Private methods

  private async registerDefaultProviders(): Promise<void> {
    // Register OpenAI provider if configured
    const settings: any = Storage.get(CONFIG.LOCAL_STORAGE_KEYS.SETTINGS, {});
    
    if (settings.openaiApiKey && CONFIG.DEFAULT_SETTINGS.mcpEnabled) {
      const openaiConfig: MCPProviderConfig = {
        providerId: 'openai-mcp',
        name: 'OpenAI MCP Provider',
        apiKey: settings.openaiApiKey,
        timeout: CONFIG.MCP.DEFAULT_TIMEOUT,
        retryAttempts: CONFIG.MCP.RETRY_ATTEMPTS,
      };

      try {
        await this.registerProvider(openaiConfig);
      } catch (error) {
        if (this.config.enableLogging) {
          console.warn('Failed to register default OpenAI MCP provider:', error);
        }
      }
    }
  }

  private async loadConfiguration(): Promise<void> {
    try {
      const savedConfig: any = Storage.get(CONFIG.LOCAL_STORAGE_KEYS.MCP_PROVIDERS, null);
      if (savedConfig && typeof savedConfig === 'object') {
        // Merge saved configuration with current configuration
        if (savedConfig.providers) this.config.providers = savedConfig.providers;
        if (savedConfig.defaultTimeout) this.config.defaultTimeout = savedConfig.defaultTimeout;
        if (savedConfig.maxConcurrentContexts) this.config.maxConcurrentContexts = savedConfig.maxConcurrentContexts;
        if (savedConfig.contextRetentionTime) this.config.contextRetentionTime = savedConfig.contextRetentionTime;
        if (typeof savedConfig.enableLogging === 'boolean') this.config.enableLogging = savedConfig.enableLogging;
      }
    } catch (error) {
      if (this.config.enableLogging) {
        console.warn('Failed to load MCP configuration:', error);
      }
    }
  }

  private async saveConfiguration(): Promise<void> {
    try {
      Storage.set(CONFIG.LOCAL_STORAGE_KEYS.MCP_PROVIDERS, this.config);
    } catch (error) {
      if (this.config.enableLogging) {
        console.warn('Failed to save MCP configuration:', error);
      }
    }
  }

  private async loadContexts(): Promise<void> {
    try {
      const savedContexts = Storage.get(CONFIG.LOCAL_STORAGE_KEYS.MCP_CONTEXTS, {});
      
      // Only load recent contexts (within retention time)
      const cutoffTime = Date.now() - this.config.contextRetentionTime;
      
      Object.entries(savedContexts).forEach(([key, context]) => {
        const contextData = context as MCPContextData;
        const contextTime = new Date(contextData.timestamp).getTime();
        
        if (contextTime > cutoffTime) {
          this.contexts.set(key, contextData);
        }
      });
    } catch (error) {
      if (this.config.enableLogging) {
        console.warn('Failed to load MCP contexts:', error);
      }
    }
  }

  private async saveContexts(): Promise<void> {
    try {
      const contextsToSave: Record<string, MCPContextData> = {};
      this.contexts.forEach((context, key) => {
        contextsToSave[key] = context;
      });
      
      Storage.set(CONFIG.LOCAL_STORAGE_KEYS.MCP_CONTEXTS, contextsToSave);
    } catch (error) {
      if (this.config.enableLogging) {
        console.warn('Failed to save MCP contexts:', error);
      }
    }
  }

  private emitEvent(type: MCPEventType, providerId: string, data: Record<string, any>): void {
    const event: MCPEvent = {
      type,
      providerId,
      timestamp: new Date().toISOString(),
      data,
    };

    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          if (this.config.enableLogging) {
            console.error('Error in MCP event listener:', error);
          }
        }
      });
    }
  }
}

export default new MCPService();