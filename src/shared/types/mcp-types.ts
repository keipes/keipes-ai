/**
 * Model Context Protocol (MCP) type definitions and interfaces
 */

// Base protocol interface that all MCP providers must implement
export interface MCPProtocol {
  readonly providerId: string;
  readonly name: string;
  readonly version: string;
  
  // Context management
  initializeContext(config: MCPProviderConfig): Promise<void>;
  updateContext(contextData: MCPContextData): Promise<void>;
  clearContext(): Promise<void>;
  getContext(): Promise<MCPContextData | null>;
  
  // Communication methods
  sendMessage(message: string, options?: MCPMessageOptions): Promise<MCPResponse>;
  
  // Health and status
  isHealthy(): Promise<boolean>;
  getStatus(): Promise<MCPProviderStatus>;
}

// Configuration interface for MCP providers
export interface MCPProviderConfig {
  providerId: string;
  name: string;
  apiKey?: string;
  endpoint?: string;
  timeout?: number;
  retryAttempts?: number;
  customSettings?: Record<string, any>;
}

// Context data structure for managing provider-specific context
export interface MCPContextData {
  sessionId: string;
  messages: MCPMessage[];
  metadata: Record<string, any>;
  timestamp: string;
  providerSpecific?: Record<string, any>;
}

// Message structure for MCP communication
export interface MCPMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  metadata?: Record<string, any>;
}

// Options for message sending
export interface MCPMessageOptions {
  timeout?: number;
  priority?: 'low' | 'normal' | 'high';
  contextIsolation?: boolean;
  customHeaders?: Record<string, string>;
}

// Response structure from MCP providers
export interface MCPResponse {
  success: boolean;
  content?: string;
  error?: MCPError;
  metadata?: Record<string, any>;
  timestamp: string;
  providerId: string;
}

// Error structure for MCP operations
export interface MCPError {
  code: string;
  message: string;
  details?: Record<string, any>;
  recoverable: boolean;
}

// Provider status information
export interface MCPProviderStatus {
  providerId: string;
  status: 'active' | 'inactive' | 'error' | 'connecting';
  lastActivity: string;
  contextCount: number;
  errorCount: number;
  capabilities: string[];
}

// MCP Manager configuration
export interface MCPManagerConfig {
  providers: MCPProviderConfig[];
  defaultTimeout: number;
  maxConcurrentContexts: number;
  contextRetentionTime: number; // in milliseconds
  enableLogging: boolean;
}

// Event types for MCP operations
export enum MCPEventType {
  PROVIDER_REGISTERED = 'provider:registered',
  PROVIDER_UNREGISTERED = 'provider:unregistered',
  CONTEXT_CREATED = 'context:created',
  CONTEXT_UPDATED = 'context:updated',
  CONTEXT_CLEARED = 'context:cleared',
  MESSAGE_SENT = 'message:sent',
  MESSAGE_RECEIVED = 'message:received',
  ERROR_OCCURRED = 'error:occurred',
}

// Event data structure
export interface MCPEvent {
  type: MCPEventType;
  providerId: string;
  timestamp: string;
  data: Record<string, any>;
}

// Error codes specific to MCP operations
export const MCPErrorCodes = {
  PROVIDER_NOT_FOUND: 'MCP_PROVIDER_NOT_FOUND',
  PROVIDER_INITIALIZATION_FAILED: 'MCP_PROVIDER_INITIALIZATION_FAILED',
  CONTEXT_NOT_FOUND: 'MCP_CONTEXT_NOT_FOUND',
  CONTEXT_CREATION_FAILED: 'MCP_CONTEXT_CREATION_FAILED',
  MESSAGE_SEND_FAILED: 'MCP_MESSAGE_SEND_FAILED',
  PROTOCOL_VIOLATION: 'MCP_PROTOCOL_VIOLATION',
  CONFIGURATION_ERROR: 'MCP_CONFIGURATION_ERROR',
  TIMEOUT_ERROR: 'MCP_TIMEOUT_ERROR',
  AUTHENTICATION_ERROR: 'MCP_AUTHENTICATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'MCP_RATE_LIMIT_EXCEEDED',
} as const;

export type MCPErrorCode = (typeof MCPErrorCodes)[keyof typeof MCPErrorCodes];