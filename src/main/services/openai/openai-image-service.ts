import OpenAI from "openai";
import { ImageServiceInterface } from "../../../types/image-service-interface";
import logger from "../logger";

class OpenAIImageService implements ImageServiceInterface {
  private openai: OpenAI;

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  async generateImage(
    prompt: string,
    provider: string
  ): Promise<{
    image_base64: string;
    filename: string;
  }> {
    logger.info(
      `Generating image with prompt: ${prompt} and provider: ${provider}`
    );

    const response = await this.openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "256x256",
      response_format: "b64_json",
    });

    if (
      !response.data ||
      response.data.length === 0 ||
      !response.data[0].b64_json
    ) {
      logger.error(
        "Failed to generate image: Invalid response from OpenAI API"
      );
      throw new Error(
        "Failed to generate image: Invalid response from OpenAI API"
      );
    }

    const imageBase64 = response.data[0].b64_json;
    const filename = `image-${Date.now()}.png`;

    logger.info(`Image generated successfully: ${filename}`);

    return {
      image_base64: imageBase64,
      filename: filename,
    };
  }
}

export default OpenAIImageService;
