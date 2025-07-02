/**
 * Application configuration constants
 */

interface ApiEndpoints {
  HEALTH: string;
  PROVIDERS: string;
  CHAT: string;
  IMAGE: string;
  MCP: string;
}

interface LocalStorageKeys {
  SETTINGS: string;
  ACTIVE_VIEW: string;
  MCP_CONTEXTS: string;
  MCP_PROVIDERS: string;
}

interface DefaultSettings {
  imageProvider: string;
  chatProvider: string;
  mcpEnabled: boolean;
  mcpDefaultProvider: string;
}

interface UIConfig {
  TYPING_DELAY: number;
  MAX_MESSAGE_LENGTH: number;
}

interface MCPConfig {
  DEFAULT_TIMEOUT: number;
  MAX_CONCURRENT_CONTEXTS: number;
  CONTEXT_RETENTION_TIME: number;
  RETRY_ATTEMPTS: number;
  ENABLE_LOGGING: boolean;
}

interface AppConfig {
  BACKEND_URL: string;
  API_ENDPOINTS: ApiEndpoints;
  LOCAL_STORAGE_KEYS: LocalStorageKeys;
  DEFAULT_SETTINGS: DefaultSettings;
  UI: UIConfig;
  MCP: MCPConfig;
}

export const CONFIG: AppConfig = {
  BACKEND_URL: "http://localhost:5001",
  API_ENDPOINTS: {
    HEALTH: "/health",
    PROVIDERS: "/api/providers",
    CHAT: "/api/chat",
    IMAGE: "/api/generate-image",
    MCP: "/api/mcp",
  },
  LOCAL_STORAGE_KEYS: {
    SETTINGS: "keipesAiSettings",
    ACTIVE_VIEW: "activeView",
    MCP_CONTEXTS: "mcpContexts",
    MCP_PROVIDERS: "mcpProviders",
  },
  DEFAULT_SETTINGS: {
    imageProvider: "gemini",
    chatProvider: "gemini",
    mcpEnabled: false,
    mcpDefaultProvider: "openai",
  },
  UI: {
    TYPING_DELAY: 50,
    MAX_MESSAGE_LENGTH: 4000,
  },
  MCP: {
    DEFAULT_TIMEOUT: 30000, // 30 seconds
    MAX_CONCURRENT_CONTEXTS: 5,
    CONTEXT_RETENTION_TIME: 3600000, // 1 hour
    RETRY_ATTEMPTS: 3,
    ENABLE_LOGGING: true,
  },
};

export const PROVIDERS = {
  GEMINI: "gemini",
  OPENAI: "openai",
} as const;

export const VIEW_NAMES = {
  CHAT: "chat",
  IMAGE: "image",
  SETTINGS: "settings",
} as const;

export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];
export type ViewName = (typeof VIEW_NAMES)[keyof typeof VIEW_NAMES];
