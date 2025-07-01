/**
 * Application configuration constants
 */

interface ApiEndpoints {
  HEALTH: string;
  PROVIDERS: string;
  CHAT: string;
  IMAGE: string;
}

interface LocalStorageKeys {
  SETTINGS: string;
  ACTIVE_VIEW: string;
}

interface DefaultSettings {
  imageProvider: string;
  chatProvider: string;
}

interface UIConfig {
  TYPING_DELAY: number;
  MAX_MESSAGE_LENGTH: number;
}

interface AppConfig {
  BACKEND_URL: string;
  API_ENDPOINTS: ApiEndpoints;
  LOCAL_STORAGE_KEYS: LocalStorageKeys;
  DEFAULT_SETTINGS: DefaultSettings;
  UI: UIConfig;
}

export const CONFIG: AppConfig = {
  BACKEND_URL: "http://localhost:5001",
  API_ENDPOINTS: {
    HEALTH: "/health",
    PROVIDERS: "/api/providers",
    CHAT: "/api/chat",
    IMAGE: "/api/generate-image",
  },
  LOCAL_STORAGE_KEYS: {
    SETTINGS: "keipesAiSettings",
    ACTIVE_VIEW: "activeView",
  },
  DEFAULT_SETTINGS: {
    imageProvider: "gemini",
    chatProvider: "gemini",
  },
  UI: {
    TYPING_DELAY: 50,
    MAX_MESSAGE_LENGTH: 4000,
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
