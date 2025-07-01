/**
 * Application configuration constants
 */
export const CONFIG = {
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
};

export const VIEW_NAMES = {
  CHAT: "chat",
  IMAGE: "image",
  SETTINGS: "settings",
};
