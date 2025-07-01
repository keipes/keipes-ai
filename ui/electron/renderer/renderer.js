// DOM Elements
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");
const imagePrompt = document.getElementById("imagePrompt");
const generateBtn = document.getElementById("generateBtn");
const imageOutput = document.getElementById("imageOutput");
const imageLoading = document.getElementById("imageLoading");
const statusText = document.getElementById("statusText");
const appVersion = document.getElementById("appVersion");

// Application State
let currentView = "chat";
let isGenerating = false;

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  setupMenuListeners();
  await loadAppVersion();
  loadSettings();
  updateStatus("Ready");
});

// Event Listeners Setup
function setupEventListeners() {
  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const viewName = item.dataset.view;
      switchView(viewName);
    });
  });

  // Chat functionality
  sendBtn.addEventListener("click", handleSendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Image generation
  generateBtn.addEventListener("click", handleGenerateImage);

  // Settings
  const saveSettings = document.getElementById("saveSettings");
  if (saveSettings) {
    saveSettings.addEventListener("click", handleSaveSettings);
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById("darkMode");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", handleDarkModeToggle);
  }
}

// Menu event listeners
function setupMenuListeners() {
  if (window.electronAPI) {
    window.electronAPI.onMenuNew(() => {
      clearChat();
    });

    window.electronAPI.onMenuGenerateImage(() => {
      switchView("image");
    });

    window.electronAPI.onMenuChat(() => {
      switchView("chat");
    });
  }
}

// View Management
function switchView(viewName) {
  // Update navigation
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });

  // Update views
  views.forEach((view) => {
    view.classList.toggle("active", view.id === `${viewName}View`);
  });

  currentView = viewName;
  updateStatus(`Switched to ${viewName}`);
}

// Chat Functionality
async function handleSendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  chatInput.value = "";

  // Show typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.className = "message ai typing";
  typingDiv.innerHTML = '<i class="fas fa-ellipsis-h"></i> AI is thinking...';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await chatWithAI(message);
    // Remove typing indicator
    chatMessages.removeChild(typingDiv);
    addMessage(response, "ai");
  } catch (error) {
    // Remove typing indicator
    chatMessages.removeChild(typingDiv);
    addMessage(
      "Sorry, I encountered an error. Please make sure the backend server is running.",
      "ai"
    );
    console.error("Chat error:", error);
  }
}

function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
  const welcomeMessage = chatMessages.querySelector(".welcome-message");
  chatMessages.innerHTML = "";
  if (welcomeMessage) {
    chatMessages.appendChild(welcomeMessage);
  }
  updateStatus("Chat cleared");
}

// Image Generation
async function handleGenerateImage() {
  const prompt = imagePrompt.value.trim();
  if (!prompt) {
    await showError("Please enter a prompt for image generation");
    return;
  }

  if (isGenerating) return;

  isGenerating = true;
  generateBtn.disabled = true;
  generateBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Generating...';

  imageOutput.classList.add("hidden");
  imageLoading.classList.remove("hidden");

  updateStatus("Generating image...");

  try {
    // Get the selected provider or default to Gemini
    const settings = JSON.parse(
      localStorage.getItem("keipesAiSettings") || "{}"
    );
    const provider = settings.imageProvider || "gemini";

    let imageData;
    if (provider === "gemini") {
      imageData = await generateImageWithGemini(prompt);
    } else if (provider === "openai") {
      if (!settings.openaiApiKey) {
        throw new Error(
          "OpenAI API key not configured. Please check Settings."
        );
      }
      imageData = await generateImageWithOpenAI(prompt, settings.openaiApiKey);
    } else {
      throw new Error("Invalid image provider selected");
    }

    showGeneratedImage(imageData.image_base64, imageData.filename);
    updateStatus("Image generated successfully");
  } catch (error) {
    console.error("Image generation failed:", error);
    await showError(`Failed to generate image: ${error.message}`);
    updateStatus("Image generation failed");
  } finally {
    isGenerating = false;
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Image';
    imageLoading.classList.add("hidden");
    imageOutput.classList.remove("hidden");
  }
}

function showGeneratedImage(imageBase64, filename) {
  const img = document.createElement("img");
  img.src = `data:image/png;base64,${imageBase64}`;
  img.alt = "Generated image";

  // Add download button
  const downloadBtn = document.createElement("button");
  downloadBtn.className = "btn btn-secondary download-btn";
  downloadBtn.innerHTML = '<i class="fas fa-download"></i> Save Image';
  downloadBtn.onclick = () => downloadImage(imageBase64, filename);

  imageOutput.innerHTML = "";
  imageOutput.appendChild(img);
  imageOutput.appendChild(downloadBtn);
}

function downloadImage(imageBase64, filename) {
  const link = document.createElement("a");
  link.href = `data:image/png;base64,${imageBase64}`;
  link.download = filename || "generated-image.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  updateStatus("Image downloaded");
}

// Settings Management
async function handleSaveSettings() {
  const settings = {
    geminiApiKey: document.getElementById("geminiApiKey").value,
    openaiApiKey: document.getElementById("openaiApiKey").value,
    darkMode: document.getElementById("darkMode").checked,
    autoSave: document.getElementById("autoSave").checked,
    imageProvider: document.getElementById("imageProvider")?.value || "gemini",
  };

  localStorage.setItem("keipesAiSettings", JSON.stringify(settings));

  // Update backend configuration
  try {
    await updateBackendConfig(settings);
    updateStatus("Settings saved successfully");
    await showInfo("Settings saved successfully!");
  } catch (error) {
    console.error("Failed to update backend config:", error);
    updateStatus("Settings saved locally only");
    await showInfo(
      "Settings saved locally. Backend server may not be running."
    );
  }
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("keipesAiSettings") || "{}");

  if (settings.geminiApiKey) {
    document.getElementById("geminiApiKey").value = settings.geminiApiKey;
  }
  if (settings.openaiApiKey) {
    document.getElementById("openaiApiKey").value = settings.openaiApiKey;
  }
  if (settings.darkMode !== undefined) {
    document.getElementById("darkMode").checked = settings.darkMode;
  }
  if (settings.autoSave !== undefined) {
    document.getElementById("autoSave").checked = settings.autoSave;
  }
  if (settings.imageProvider && document.getElementById("imageProvider")) {
    document.getElementById("imageProvider").value = settings.imageProvider;
  }

  // Check backend status
  checkBackendStatus();
}

function handleDarkModeToggle(e) {
  // Dark mode is always on in this theme, but you can implement light mode here
  updateStatus(`Dark mode ${e.target.checked ? "enabled" : "disabled"}`);
}

// Utility Functions
async function loadAppVersion() {
  if (window.electronAPI) {
    try {
      const version = await window.electronAPI.getAppVersion();
      appVersion.textContent = `v${version}`;
    } catch (error) {
      console.error("Failed to load app version:", error);
    }
  }
}

function updateStatus(message) {
  statusText.textContent = message;
  setTimeout(() => {
    statusText.textContent = "Ready";
  }, 3000);
}

async function showError(message) {
  if (window.electronAPI) {
    await window.electronAPI.showMessageBox({
      type: "error",
      title: "Error",
      message: message,
    });
  } else {
    alert(message);
  }
}

async function showInfo(message) {
  if (window.electronAPI) {
    await window.electronAPI.showMessageBox({
      type: "info",
      title: "Information",
      message: message,
    });
  } else {
    alert(message);
  }
}

// API Integration Functions
const BACKEND_URL = "http://localhost:5001";

async function generateImageWithGemini(prompt) {
  const response = await fetch(`${BACKEND_URL}/api/generate-image/gemini`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate image");
  }

  const data = await response.json();
  return data;
}

async function generateImageWithOpenAI(prompt, apiKey) {
  const response = await fetch(`${BACKEND_URL}/api/generate-image/openai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      api_key: apiKey,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate image");
  }

  const data = await response.json();
  return data;
}

async function chatWithAI(message) {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to get AI response");
  }

  const data = await response.json();
  return data.response;
}

async function updateBackendConfig(settings) {
  const response = await fetch(`${BACKEND_URL}/api/config`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      openai_api_key: settings.openaiApiKey,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update backend configuration");
  }

  return await response.json();
}

async function checkBackendStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      updateStatus("Backend connected");
      console.log("Backend status:", data);
    } else {
      updateStatus("Backend connection failed");
    }
  } catch (error) {
    updateStatus("Backend server not running");
    console.warn("Backend not available:", error.message);
  }
}

async function getAvailableProviders() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/providers`);
    if (response.ok) {
      const data = await response.json();
      return data.providers;
    }
  } catch (error) {
    console.warn("Failed to get providers:", error);
    return [];
  }
}
