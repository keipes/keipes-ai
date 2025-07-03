/**
 * Image generation service
 */
import {
  ImageServiceInterface,
  ImageData,
} from "../../types/image-service-interface";

class DummyImageService implements ImageServiceInterface {
  async generateImage(prompt: string, provider: string): Promise<ImageData> {
    return {
      image_base64: "",
      filename: "dummy-image.png",
    };
  }
}

export default new DummyImageService();
