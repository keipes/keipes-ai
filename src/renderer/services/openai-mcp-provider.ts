/**
 * OpenAI implementation of MCP protocol
 */
import { BaseMCPProvider } from './base-mcp-provider.js';
import { 
  MCPContextData, 
  MCPMessage, 
  MCPMessageOptions, 
  MCPResponse, 
  MCPErrorCodes 
} from '../../shared/types/mcp-types.js';
import { CONFIG } from '../../shared/config.js';
import { AppError } from '../utils/error-handling.js';

export class OpenAIMCPProvider extends BaseMCPProvider {
  private apiKey: string = '';
  private endpoint: string = 'https://api.openai.com/v1/chat/completions';
  private model: string = 'gpt-3.5-turbo';

  constructor() {
    super('openai-mcp', 'OpenAI MCP Provider', '1.0.0');
  }

  protected async doInitialize(): Promise<void> {
    if (!this.config) {
      throw new Error('Configuration not provided');
    }

    this.apiKey = this.config.apiKey || '';
    this.endpoint = this.config.endpoint || this.endpoint;

    if (!this.apiKey) {
      throw new AppError(
        'OpenAI API key is required for MCP initialization',
        MCPErrorCodes.CONFIGURATION_ERROR
      );
    }

    // Test the connection
    await this.doHealthCheck();
  }

  protected async doUpdateContext(contextData: MCPContextData): Promise<void> {
    // OpenAI doesn't require special context update handling
    // Context is maintained in the messages array
    return Promise.resolve();
  }

  protected async doClearContext(): Promise<void> {
    // OpenAI doesn't require special cleanup
    return Promise.resolve();
  }

  protected async doSendMessage(message: MCPMessage, options?: MCPMessageOptions): Promise<MCPResponse> {
    const timeout = options?.timeout || CONFIG.MCP.DEFAULT_TIMEOUT;
    
    try {
      // Prepare messages for OpenAI API
      const messages = this.context?.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })) || [];

      // Add current message
      messages.push({
        role: message.role,
        content: message.content,
      });

      const requestBody = {
        model: this.model,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options?.customHeaders,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: this.createMCPError(
            errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
            MCPErrorCodes.MESSAGE_SEND_FAILED,
            response.status < 500
          ),
          timestamp: new Date().toISOString(),
          providerId: this.providerId,
        };
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return {
        success: true,
        content,
        metadata: {
          model: this.model,
          usage: data.usage,
          finishReason: data.choices?.[0]?.finish_reason,
        },
        timestamp: new Date().toISOString(),
        providerId: this.providerId,
      };

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: this.createMCPError(
            'Request timeout',
            MCPErrorCodes.TIMEOUT_ERROR,
            true
          ),
          timestamp: new Date().toISOString(),
          providerId: this.providerId,
        };
      }

      return {
        success: false,
        error: this.createMCPError(
          error instanceof Error ? error.message : 'Unknown error',
          MCPErrorCodes.MESSAGE_SEND_FAILED,
          true
        ),
        timestamp: new Date().toISOString(),
        providerId: this.providerId,
      };
    }
  }

  protected async doHealthCheck(): Promise<boolean> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  protected getCapabilities(): string[] {
    return [
      'chat',
      'completion',
      'context-management',
      'message-history',
      'streaming',
      'function-calling',
    ];
  }

  // OpenAI-specific methods
  setModel(model: string): void {
    this.model = model;
  }

  getModel(): string {
    return this.model;
  }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  getEndpoint(): string {
    return this.endpoint;
  }
}