import React from "react";

interface ImageViewProps {
  onGenerate: () => void;
  imagePrompt: string;
  setImagePrompt: (prompt: string) => void;
  imageOutput: string;
  isGenerating: boolean;
  className?: string;
}

export function ImageView({
  onGenerate,
  imagePrompt,
  setImagePrompt,
  imageOutput,
  isGenerating,
  className,
}: ImageViewProps) {
  return (
    <div id="imageView" className={className || "view"}>
      <div className="image-container">
        <div className="image-input-section">
          <h2>
            <i className="fas fa-palette"></i> Image Generation
          </h2>
          <div className="input-group">
            <label htmlFor="imagePrompt">
              Describe the image you want to generate:
            </label>
            <textarea
              id="imagePrompt"
              placeholder="A bald eagle with a cannon on its back..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <button
            id="generateBtn"
            className="btn btn-primary"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            <i className="fas fa-magic"></i> Generate Image
          </button>
        </div>
        <div className="image-output-section">
          <div id="imageOutput" className="image-output">
            {imageOutput ? (
              <img src={imageOutput} alt="Generated" />
            ) : (
              <div className="placeholder">
                <i className="fas fa-image"></i>
                <p>Generated images will appear here</p>
              </div>
            )}
          </div>
          {isGenerating && (
            <div id="imageLoading" className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Generating image...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
