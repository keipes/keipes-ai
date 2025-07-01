/**
 * Image generation service
 */
import { CONFIG } from "../../shared/config.js";
import { ErrorHandler, AppError, ErrorCodes } from "../utils/error-handling.js";
import { Storage } from "../utils/common";

interface ImageData {
  image_base64: string;
  filename: string;
}

interface Settings {
  openaiApiKey?: string;
  [key: string]: any;
}

class ImageService {
  private isGenerating: boolean = false;

  async generateImage(
    prompt: string,
    provider: string = "gemini"
  ): Promise<ImageData | undefined> {
    if (this.isGenerating) return;

    this.isGenerating = true;
    try {
      const settings: Settings = Storage.get(
        CONFIG.LOCAL_STORAGE_KEYS.SETTINGS,
        {} as Settings
      );

      let imageData: ImageData;
      if (provider === "gemini") {
        imageData = await this.generateImageWithGemini(prompt);
      } else if (provider === "openai") {
        if (!settings.openaiApiKey) {
          throw new AppError(
            "OpenAI API key not configured. Please check Settings.",
            ErrorCodes.CONFIG_ERROR
          );
        }
        imageData = await this.generateImageWithOpenAI(
          prompt,
          settings.openaiApiKey
        );
      } else {
        throw new AppError(
          "Invalid image provider selected",
          ErrorCodes.VALIDATION_ERROR
        );
      }

      this.showGeneratedImage(imageData.image_base64, imageData.filename);
      return imageData;
    } catch (error) {
      await ErrorHandler.handleError(error as AppError | Error, true);
    } finally {
      this.isGenerating = false;
    }
  }

  private showGeneratedImage(imageBase64: string, filename: string): void {
    const imageOutput = document.getElementById("imageOutput");
    if (!imageOutput) return;

    const img = document.createElement("img");
    img.src = `data:image/png;base64,${imageBase64}`;
    img.alt = "Generated image";

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "btn btn-secondary download-btn";
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Save Image';
    downloadBtn.onclick = () => this.downloadImage(imageBase64, filename);

    imageOutput.innerHTML = "";
    imageOutput.appendChild(img);
    imageOutput.appendChild(downloadBtn);
  }

  private downloadImage(imageBase64: string, filename: string): void {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = filename || "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private async generateImageWithGemini(prompt: string): Promise<ImageData> {
    const response = await fetch(
      `${CONFIG.BACKEND_URL}${CONFIG.API_ENDPOINTS.IMAGE}/gemini`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AppError(
        error.error || "Failed to generate image with Gemini",
        ErrorCodes.API_ERROR
      );
    }

    return await response.json();
  }

  private async generateImageWithOpenAI(
    prompt: string,
    apiKey: string
  ): Promise<ImageData> {
    const response = await fetch(
      `${CONFIG.BACKEND_URL}${CONFIG.API_ENDPOINTS.IMAGE}/openai`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, api_key: apiKey }),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new AppError(
        error.error || "Failed to generate image with OpenAI",
        ErrorCodes.API_ERROR
      );
    }

    return await response.json();
  }
}

export default new ImageService();
