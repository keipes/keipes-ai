# Model Context Protocol (MCP) Integration Module

## Overview

The MCP Integration Module provides a standardized way to integrate multiple AI provider protocols within the Keipes AI Electron application. It offers protocol abstraction, context management, error handling, and configuration support for AI providers.

## Architecture

### Core Components

1. **Protocol Abstraction Layer** (`src/shared/types/mcp-types.ts`)
   - Defines interfaces and types for MCP protocol implementation
   - Provides error codes and event types for MCP operations
   - Standardizes communication patterns across providers

2. **Base MCP Provider** (`src/renderer/services/base-mcp-provider.ts`)
   - Abstract base class for all MCP provider implementations
   - Handles common functionality like context management and error handling
   - Provides utility methods for session and message ID generation

3. **MCP Service** (`src/renderer/services/mcp-service.ts`)
   - Main service that manages all registered MCP providers
   - Handles provider registration, context management, and message routing
   - Provides event system for monitoring MCP operations

4. **Provider Implementations**
   - **OpenAI MCP Provider** (`src/renderer/services/openai-mcp-provider.ts`)
   - Extensible for additional providers (Anthropic, Google, etc.)

## Key Features

### Protocol Abstraction
- Standardized interface for all AI providers
- Consistent message format and response structure
- Provider-agnostic context management

### Context Management
- Isolated contexts for different providers
- Automatic context persistence and restoration
- Configurable context retention policies

### Error Handling
- Comprehensive error codes for MCP operations
- Graceful error recovery mechanisms
- Integration with existing error handling system

### Configuration Support
- Provider-specific configuration management
- Runtime configuration updates
- Secure API key handling

## Usage Examples

### Basic Setup

```typescript
import MCPService from './services/mcp-service.js';

// Initialize the MCP service
await MCPService.initialize();

// Register an OpenAI provider
await MCPService.registerProvider({
  providerId: 'openai-mcp',
  name: 'OpenAI MCP Provider',
  apiKey: 'your-openai-api-key',
  timeout: 30000,
  retryAttempts: 3,
});
```

### Sending Messages

```typescript
// Send a message through a specific provider
const response = await MCPService.sendMessage(
  'openai-mcp',
  'Hello, how can you help me today?',
  {
    timeout: 15000,
    priority: 'normal',
  }
);

if (response.success) {
  console.log('AI Response:', response.content);
} else {
  console.error('Error:', response.error);
}
```

### Context Management

```typescript
// Clear provider context
await MCPService.clearProviderContext('openai-mcp');

// Get provider status
const status = await MCPService.getProviderStatus('openai-mcp');
console.log('Provider Status:', status);
```

### Event Handling

```typescript
// Listen for MCP events
MCPService.addEventListener('message:received', (event) => {
  console.log('Message received from:', event.providerId);
  console.log('Response:', event.data.response);
});

MCPService.addEventListener('error:occurred', (event) => {
  console.error('MCP Error:', event.data.error);
});
```

## Configuration

### App Configuration

The MCP module extends the existing configuration in `src/shared/config.ts`:

```typescript
MCP: {
  DEFAULT_TIMEOUT: 30000,        // 30 seconds
  MAX_CONCURRENT_CONTEXTS: 5,   // Maximum concurrent contexts
  CONTEXT_RETENTION_TIME: 3600000, // 1 hour
  RETRY_ATTEMPTS: 3,            // Number of retry attempts
  ENABLE_LOGGING: true,         // Enable MCP logging
}
```

### Provider Configuration

Each provider requires specific configuration:

```typescript
interface MCPProviderConfig {
  providerId: string;           // Unique provider identifier
  name: string;                 // Human-readable provider name
  apiKey?: string;             // API key for authentication
  endpoint?: string;           // Custom API endpoint
  timeout?: number;            // Provider-specific timeout
  retryAttempts?: number;      // Number of retry attempts
  customSettings?: Record<string, any>; // Provider-specific settings
}
```

## Error Handling

### MCP Error Codes

The module defines specific error codes for MCP operations:

- `MCP_PROVIDER_NOT_FOUND`: Provider not registered
- `MCP_PROVIDER_INITIALIZATION_FAILED`: Provider initialization failed
- `MCP_CONTEXT_NOT_FOUND`: Context not available
- `MCP_CONTEXT_CREATION_FAILED`: Context creation failed
- `MCP_MESSAGE_SEND_FAILED`: Message sending failed
- `MCP_PROTOCOL_VIOLATION`: Protocol violation detected
- `MCP_CONFIGURATION_ERROR`: Configuration error
- `MCP_TIMEOUT_ERROR`: Operation timeout
- `MCP_AUTHENTICATION_ERROR`: Authentication failed
- `MCP_RATE_LIMIT_EXCEEDED`: Rate limit exceeded

### Error Recovery

The module implements automatic error recovery:

1. **Retry Logic**: Automatic retries with exponential backoff
2. **Graceful Degradation**: Fallback to alternative providers
3. **Context Recovery**: Automatic context restoration after errors
4. **Health Monitoring**: Continuous provider health checks

## Extending the Module

### Adding New Providers

To add a new AI provider:

1. Create a new provider class extending `BaseMCPProvider`:

```typescript
export class CustomMCPProvider extends BaseMCPProvider {
  constructor() {
    super('custom-mcp', 'Custom MCP Provider', '1.0.0');
  }

  protected async doInitialize(): Promise<void> {
    // Provider-specific initialization
  }

  protected async doSendMessage(
    message: MCPMessage, 
    options?: MCPMessageOptions
  ): Promise<MCPResponse> {
    // Provider-specific message sending
  }

  // Implement other abstract methods...
}
```

2. Register the provider in `MCPService`:

```typescript
// In registerProvider method, add new case:
case 'custom-mcp':
  provider = new CustomMCPProvider();
  break;
```

### Custom Context Management

Providers can implement custom context management by overriding the context methods:

```typescript
protected async doUpdateContext(contextData: MCPContextData): Promise<void> {
  // Custom context update logic
}

protected async doClearContext(): Promise<void> {
  // Custom context clearing logic
}
```

## Integration with Existing Services

### Chat Service Integration

The MCP module can be integrated with the existing chat service:

```typescript
// In chat-service.ts
import MCPService from './mcp-service.js';

private async generateResponse(message: string): Promise<string> {
  if (CONFIG.DEFAULT_SETTINGS.mcpEnabled) {
    const response = await MCPService.sendMessage(
      CONFIG.DEFAULT_SETTINGS.mcpDefaultProvider,
      message
    );
    
    if (response.success) {
      return response.content || 'No response content';
    }
  }
  
  // Fallback to existing implementation
  return this.generateResponseFallback(message);
}
```

## Security Considerations

1. **API Key Management**: API keys are stored securely and never logged
2. **Context Isolation**: Provider contexts are isolated from each other
3. **Input Validation**: All inputs are validated before processing
4. **Timeout Protection**: All operations have configurable timeouts
5. **Error Sanitization**: Error messages are sanitized before logging

## Performance Considerations

1. **Context Caching**: Contexts are cached in memory for fast access
2. **Lazy Loading**: Providers are initialized only when needed
3. **Connection Pooling**: HTTP connections are reused when possible
4. **Resource Cleanup**: Automatic cleanup of unused contexts
5. **Throttling**: Built-in rate limiting to prevent API abuse

## Testing

### Manual Testing

1. Initialize the MCP service
2. Register providers with valid API keys
3. Send test messages and verify responses
4. Test error conditions (invalid API keys, network errors)
5. Verify context persistence and recovery

### Integration Testing

The module integrates with the existing error handling and configuration systems, ensuring compatibility with the current application architecture.

## Future Enhancements

1. **Streaming Support**: Add support for streaming responses
2. **Function Calling**: Implement function calling capabilities
3. **Multi-modal Support**: Add support for images and other media types
4. **Provider Load Balancing**: Distribute requests across multiple providers
5. **Analytics**: Add metrics and analytics for provider usage
6. **Plugin System**: Allow third-party provider plugins

## Troubleshooting

### Common Issues

1. **Provider Initialization Failed**
   - Check API key configuration
   - Verify network connectivity
   - Check provider endpoint accessibility

2. **Context Not Found**
   - Ensure provider is properly initialized
   - Check context retention settings
   - Verify provider registration

3. **Message Send Failed**
   - Check API key validity
   - Verify message format
   - Check network connectivity and timeouts

### Debug Logging

Enable debug logging by setting `MCP.ENABLE_LOGGING: true` in the configuration. This will provide detailed logs for all MCP operations.