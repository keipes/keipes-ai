import Anthropic from "@anthropic-ai/sdk";
import {
  ImageServiceInterface,
  ImageData,
} from "../../../types/image-service-interface";
import logger from "../logger";

class AnthropicImageService implements ImageServiceInterface {
  private anthropic: Anthropic;

  constructor(anthropic: Anthropic) {
    this.anthropic = anthropic;
  }

  async generateImage(
    prompt: string,
    provider?: string
  ): Promise<ImageData | undefined> {
    logger.info(
      `Image generation requested with prompt: ${prompt} and provider: ${
        provider || "anthropic"
      }`
    );

    // Note: Anthropic (Claude) does not have native image generation capabilities
    // This is a placeholder implementation that could be extended to:
    // 1. Use a different image generation service
    // 2. Return an error message
    // 3. Integrate with other AI image services

    logger.warn(
      "Anthropic does not support image generation. Consider using OpenAI or other image generation services."
    );

    return undefined;
  }
}

export default AnthropicImageService;
