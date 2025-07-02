/**
 * Abstract base class for MCP protocol implementations
 */
import { 
  MCPProtocol, 
  MCPProviderConfig, 
  MCPContextData, 
  MCPMessage, 
  MCPMessageOptions, 
  MCPResponse, 
  MCPProviderStatus, 
  MCPError,
  MCPErrorCodes
} from '../../shared/types/mcp-types.js';
import { AppError, ErrorCodes } from '../utils/error-handling.js';

export abstract class BaseMCPProvider implements MCPProtocol {
  public readonly providerId: string;
  public readonly name: string;
  public readonly version: string;

  protected config: MCPProviderConfig | null = null;
  protected context: MCPContextData | null = null;
  protected isInitialized: boolean = false;
  protected lastActivity: string = new Date().toISOString();
  protected errorCount: number = 0;

  constructor(providerId: string, name: string, version: string) {
    this.providerId = providerId;
    this.name = name;
    this.version = version;
  }

  async initializeContext(config: MCPProviderConfig): Promise<void> {
    try {
      this.config = config;
      
      // Create initial context
      this.context = {
        sessionId: this.generateSessionId(),
        messages: [],
        metadata: {
          createdAt: new Date().toISOString(),
          providerId: this.providerId,
        },
        timestamp: new Date().toISOString(),
        providerSpecific: {},
      };

      await this.doInitialize();
      this.isInitialized = true;
      this.updateLastActivity();
    } catch (error) {
      this.errorCount++;
      throw new AppError(
        `Failed to initialize MCP provider ${this.name}`,
        MCPErrorCodes.PROVIDER_INITIALIZATION_FAILED,
        { providerId: this.providerId, originalError: error }
      );
    }
  }

  async updateContext(contextData: MCPContextData): Promise<void> {
    if (!this.isInitialized) {
      throw new AppError(
        `Provider ${this.name} not initialized`,
        MCPErrorCodes.PROVIDER_NOT_FOUND
      );
    }

    try {
      this.context = {
        ...contextData,
        timestamp: new Date().toISOString(),
      };
      await this.doUpdateContext(contextData);
      this.updateLastActivity();
    } catch (error) {
      this.errorCount++;
      throw new AppError(
        `Failed to update context for provider ${this.name}`,
        MCPErrorCodes.CONTEXT_CREATION_FAILED,
        { providerId: this.providerId, originalError: error }
      );
    }
  }

  async clearContext(): Promise<void> {
    try {
      this.context = null;
      await this.doClearContext();
      this.updateLastActivity();
    } catch (error) {
      this.errorCount++;
      throw new AppError(
        `Failed to clear context for provider ${this.name}`,
        ErrorCodes.UNKNOWN_ERROR,
        { providerId: this.providerId, originalError: error }
      );
    }
  }

  async getContext(): Promise<MCPContextData | null> {
    return this.context;
  }

  async sendMessage(message: string, options?: MCPMessageOptions): Promise<MCPResponse> {
    if (!this.isInitialized || !this.context) {
      throw new AppError(
        `Provider ${this.name} not initialized or context not available`,
        MCPErrorCodes.CONTEXT_NOT_FOUND
      );
    }

    try {
      const messageData: MCPMessage = {
        id: this.generateMessageId(),
        content: message,
        role: 'user',
        timestamp: new Date().toISOString(),
        metadata: options?.customHeaders || {},
      };

      // Add message to context
      this.context.messages.push(messageData);
      this.context.timestamp = new Date().toISOString();

      const response = await this.doSendMessage(messageData, options);
      this.updateLastActivity();

      // Add response to context if successful
      if (response.success && response.content) {
        const responseMessage: MCPMessage = {
          id: this.generateMessageId(),
          content: response.content,
          role: 'assistant',
          timestamp: response.timestamp,
        };
        this.context.messages.push(responseMessage);
      }

      return response;
    } catch (error) {
      this.errorCount++;
      throw new AppError(
        `Failed to send message to provider ${this.name}`,
        MCPErrorCodes.MESSAGE_SEND_FAILED,
        { providerId: this.providerId, message, originalError: error }
      );
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      return await this.doHealthCheck();
    } catch {
      return false;
    }
  }

  async getStatus(): Promise<MCPProviderStatus> {
    const status = await this.isHealthy() ? 'active' : 'error';
    
    return {
      providerId: this.providerId,
      status,
      lastActivity: this.lastActivity,
      contextCount: this.context ? 1 : 0,
      errorCount: this.errorCount,
      capabilities: this.getCapabilities(),
    };
  }

  // Abstract methods that must be implemented by concrete providers
  protected abstract doInitialize(): Promise<void>;
  protected abstract doUpdateContext(contextData: MCPContextData): Promise<void>;
  protected abstract doClearContext(): Promise<void>;
  protected abstract doSendMessage(message: MCPMessage, options?: MCPMessageOptions): Promise<MCPResponse>;
  protected abstract doHealthCheck(): Promise<boolean>;
  protected abstract getCapabilities(): string[];

  // Utility methods
  protected updateLastActivity(): void {
    this.lastActivity = new Date().toISOString();
  }

  protected generateSessionId(): string {
    return `${this.providerId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected generateMessageId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected createMCPError(message: string, code: string, recoverable: boolean = true): MCPError {
    return {
      code,
      message,
      recoverable,
      details: { providerId: this.providerId, timestamp: new Date().toISOString() },
    };
  }
}