/**
 * Example integration of MCP service with existing chat service
 * This demonstrates how to use the MCP module in the application
 */
import MCPService from '../services/mcp-service.js';
import { MCPEventType } from '../../shared/types/mcp-types.js';
import { CONFIG } from '../../shared/config.js';

// Example usage class
export class MCPIntegrationExample {
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      // Initialize MCP service
      await MCPService.initialize();
      this.isInitialized = true;

      // Set up event listeners
      this.setupEventListeners();

      console.log('MCP Integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MCP Integration:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    // Listen for provider events
    MCPService.addEventListener(MCPEventType.PROVIDER_REGISTERED, (event) => {
      console.log(`MCP Provider registered: ${event.data.config.name}`);
    });

    MCPService.addEventListener(MCPEventType.MESSAGE_RECEIVED, (event) => {
      console.log(`Message received from ${event.providerId}:`, event.data.response);
    });

    MCPService.addEventListener(MCPEventType.ERROR_OCCURRED, (event) => {
      console.error(`MCP Error in ${event.providerId}:`, event.data.error);
    });
  }

  async registerOpenAIProvider(apiKey: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('MCP Integration not initialized');
    }

    try {
      await MCPService.registerProvider({
        providerId: 'openai-mcp',
        name: 'OpenAI MCP Provider',
        apiKey,
        timeout: 30000,
        retryAttempts: 3,
      });

      console.log('OpenAI MCP Provider registered successfully');
    } catch (error) {
      console.error('Failed to register OpenAI MCP Provider:', error);
      throw error;
    }
  }

  async sendMessage(message: string, providerId: string = 'openai-mcp'): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('MCP Integration not initialized');
    }

    try {
      const response = await MCPService.sendMessage(providerId, message, {
        timeout: 15000,
        priority: 'normal',
      });

      if (response.success) {
        return response.content || 'No response content';
      } else {
        throw new Error(response.error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to send message via MCP:', error);
      throw error;
    }
  }

  async getProviderStatus(providerId: string = 'openai-mcp'): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('MCP Integration not initialized');
    }

    try {
      const status = await MCPService.getProviderStatus(providerId);
      return `Provider ${status.providerId}: ${status.status} (Last activity: ${status.lastActivity})`;
    } catch (error) {
      console.error('Failed to get provider status:', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  async clearContext(providerId: string = 'openai-mcp'): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('MCP Integration not initialized');
    }

    try {
      await MCPService.clearProviderContext(providerId);
      console.log(`Context cleared for provider: ${providerId}`);
    } catch (error) {
      console.error('Failed to clear context:', error);
      throw error;
    }
  }

  getRegisteredProviders(): string[] {
    if (!this.isInitialized) {
      return [];
    }

    return MCPService.getRegisteredProviders();
  }
}

// Example usage function
export async function demonstrateMCPUsage(): Promise<void> {
  const integration = new MCPIntegrationExample();

  try {
    // Initialize the integration
    await integration.initialize();

    // Register OpenAI provider (you would get the API key from settings)
    // await integration.registerOpenAIProvider('your-openai-api-key');

    // Send a test message
    // const response = await integration.sendMessage('Hello, how are you?');
    // console.log('AI Response:', response);

    // Get provider status
    // const status = await integration.getProviderStatus();
    // console.log('Provider Status:', status);

    // Clear context
    // await integration.clearContext();

    console.log('MCP demonstration completed successfully');
  } catch (error) {
    console.error('MCP demonstration failed:', error);
  }
}

// Export the example for use in other parts of the application
export default MCPIntegrationExample;