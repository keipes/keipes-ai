import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";
import { AnthropicChatService } from "./anthropic-chat-service";
import AnthropicImageService from "./anthropic-image-service";
import { ImageServiceInterface } from "../../../types/image-service-interface";
import Anthropic from "@anthropic-ai/sdk";
import { getApiKey } from "../secret-service";
import logger from "../logger";

const PROVIDER = "anthropic"; // Define the provider name for Anthropic

export default class AnthropicService implements AIServiceInterface {
  constructor() {}

  getProviderName(): string {
    return PROVIDER;
  }

  getChatService(): ChatServiceInterface {
    // return new AnthropicChatService(this.anthropic);
    return new AnthropicChatService(
      new Anthropic({ apiKey: getApiKey(PROVIDER) })
    );
  }

  getImageService(): ImageServiceInterface {
    return new AnthropicImageService(
      new Anthropic({ apiKey: getApiKey(PROVIDER) })
    );
  }
}
