// this class inherits from AIServiceInterface
import { AIServiceInterface } from "../../../types/ai-service-interface";
import { ChatServiceInterface } from "../../../types/chat-service-interface";
import { OpenAIChatService } from "./openai-chat-service";
import OpenAIImageService from "./openai-image-service";
import { ImageServiceInterface } from "../../../types/image-service-interface";
import OpenAI from "openai";
import { getApiKey } from "../secret-service";
import logger from "../logger";

const PROVIDER = "openai"; // Define the provider name for OpenAI

class OpenAIService implements AIServiceInterface {
  constructor() {
    logger.info("OpenAIService initialized.");
  }
  listModels(): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  getProviderName(): string {
    return PROVIDER;
  }

  getChatService(): ChatServiceInterface {
    const apiKey = getApiKey(PROVIDER) || process.env.OPENAI_API_KEY || "";
    const client = new OpenAI({ apiKey });
    return new OpenAIChatService(client);
  }

  getImageService(): ImageServiceInterface {
    const apiKey = getApiKey(PROVIDER) || process.env.OPENAI_API_KEY || "";
    const client = new OpenAI({ apiKey });
    return new OpenAIImageService(client);
  }
}

export default OpenAIService;
