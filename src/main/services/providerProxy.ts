import { AIServiceInterface } from "../../types/ai-service-interface";
import OpenAIService from "./openai/openai-service";
import AnthropicAIService from "./anthropic/anthropic-ai-service";

import { Config } from "./config-service";

interface ServiceProxy {
  setProvider(provider: string): void;
  listProviders(): string[];
}

export class ProviderProxyClass implements AIServiceInterface, ServiceProxy {
  private provider: string = "openai"; // Default provider

  constructor() {
    Config.getProvider()
      .then((provider) => {
        this.provider = provider;
      })
      .catch((error) => {
        console.error("Failed to get provider from config:", error);
      });
  }

  setProvider(provider: string): void {
    this.provider = provider;
    Config.setProvider(provider);
  }

  listProviders(): string[] {
    return ["openai", "anthropic"];
  }

  private getProvider(): AIServiceInterface {
    switch (this.provider) {
      case "openai":
        return new OpenAIService();
      case "anthropic":
        return new AnthropicAIService();
      default:
        throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  // service interface methods
  getChatService() {
    return this.getProvider().getChatService();
  }
  getImageService() {
    return this.getProvider().getImageService();
  }
  getProviderName() {
    return this.provider;
  }
}

export const ProviderProxy = new ProviderProxyClass();
