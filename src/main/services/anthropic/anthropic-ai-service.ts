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
  private anthropic: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY || "default-api-key";
    this.anthropic = new Anthropic({ apiKey });
    logger.info("AnthropicService initialized.");
  }

  getChatService(): ChatServiceInterface {
    const apiKey = getApiKey(PROVIDER) || process.env.ANTHROPIC_API_KEY || "";
    const client = new Anthropic({ apiKey });
    return new AnthropicChatService(client);
  }

  getImageService(): ImageServiceInterface {
    const apiKey = getApiKey(PROVIDER) || process.env.ANTHROPIC_API_KEY || "";
    const client = new Anthropic({ apiKey });
    return new AnthropicImageService(client);
  }
}
