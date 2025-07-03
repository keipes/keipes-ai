import { ImageServiceInterface } from "../../../types/image-service-interface";

class OpenAIImageService implements ImageServiceInterface {
  async generateImage(
    prompt: string,
    provider: string
  ): Promise<{
    image_base64: string;
    filename: string;
  }> {
    return {
      image_base64: "",
      filename: "openai-image.png",
    };
  }
}

export default new OpenAIImageService();
