import { useState, useEffect } from "react";
import { ChatMessage, Settings } from "../types/app-types";
import type { MessageData } from "../../types/chat-service-interface";

export function useApp() {
  const [activeView, setActiveView] = useState(
    () => localStorage.getItem("activeView") || "chat"
  );
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageOutput, setImageOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [appVersion, setAppVersion] = useState("v1.0.0");
  const [settings, setSettings] = useState<Settings>({
    geminiApiKey: "",
    openaiApiKey: "",
    anthropicApiKey: "",
    imageProvider: "gemini",
    darkMode: true,
    autoSave: false,
  });

  useEffect(() => {
    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  useEffect(() => {
    // Load chat history and app version on component mount
    const loadInitialData = async () => {
      try {
        if (window.electronAPI) {
          // Load chat history
          const history = await window.electronAPI.chatGetHistory();
          const formattedMessages: ChatMessage[] = history.map(
            (msg: MessageData) => ({
              role: msg.sender === "user" ? "user" : "ai",
              text: msg.text,
            })
          );
          setChatMessages(formattedMessages);

          // Load app version
          const version = await window.electronAPI.getAppVersion();
          setAppVersion(`v${version}`);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setStatus("Failed to load initial data");
      }
    };

    loadInitialData();
  }, []);

  // Load stored API keys on mount
  useEffect(() => {
    (async () => {
      if (window.electronAPI) {
        const [gemKey, openKey, anthropicKey] = await Promise.all([
          window.electronAPI.getApiKey("gemini"),
          window.electronAPI.getApiKey("openai"),
          window.electronAPI.getApiKey("anthropic"),
        ]);
        setSettings((s) => ({
          ...s,
          geminiApiKey: gemKey || "",
          openaiApiKey: openKey || "",
          anthropicApiKey: anthropicKey || "",
        }));
      }
    })();
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: "user", text: chatInput };
    setChatMessages((msgs) => [...msgs, userMessage]);
    const currentInput = chatInput;
    setChatInput("");
    setStatus("Sending message...");

    try {
      if (window.electronAPI) {
        const response = await window.electronAPI.chatSendMessage(currentInput);
        const aiMessage: ChatMessage = { role: "ai", text: response };
        setChatMessages((msgs) => [...msgs, aiMessage]);
        setStatus("Message sent");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setStatus("Failed to send message");
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: "ai",
        text: "Sorry, I encountered an error processing your message.",
      };
      setChatMessages((msgs) => [...msgs, errorMessage]);
    }
  };

  const handleClearHistory = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.chatClearHistory();
        setChatMessages([]);
        setStatus("Chat history cleared");
      }
    } catch (error) {
      console.error("Failed to clear chat history:", error);
      setStatus("Failed to clear chat history");
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGenerating(true);
    setStatus("Generating image...");

    try {
      const imageData = await window.electronAPI.imageGenerate(
        imagePrompt,
        settings.imageProvider
      );
      setImageOutput(`data:image/png;base64,${imageData.image_base64}`);
      setStatus("Image generated");
    } catch (error) {
      console.error("Failed to generate image via IPC:", error);
      setStatus("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle saving settings, including secure storage
  const handleSaveSettings = async () => {
    if (window.electronAPI) {
      await window.electronAPI.storeApiKey("gemini", settings.geminiApiKey);
      await window.electronAPI.storeApiKey("openai", settings.openaiApiKey);
      await window.electronAPI.storeApiKey(
        "anthropic",
        settings.anthropicApiKey
      );
    }
    setStatus("Settings saved");
    if (settings.autoSave) {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  };

  return {
    // State
    activeView,
    chatInput,
    chatMessages,
    imagePrompt,
    imageOutput,
    isGenerating,
    status,
    appVersion,
    settings,
    // State setters
    setActiveView,
    setChatInput,
    setImagePrompt,
    setSettings,
    // Handlers
    handleSendMessage,
    handleClearHistory,
    handleGenerateImage,
    handleSaveSettings,
  };
}
