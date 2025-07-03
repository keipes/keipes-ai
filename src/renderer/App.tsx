import React, { useState, useEffect } from "react";
import type { MessageData } from "../types/chat-service-interface";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

interface Settings {
  geminiApiKey: string;
  openaiApiKey: string;
  imageProvider: string;
  darkMode: boolean;
  autoSave: boolean;
}

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <i className="fas fa-brain"></i>
          <h1>Keipes AI</h1>
        </div>
        <div className="header-actions">
          <button id="newBtn" className="btn btn-primary">
            <i className="fas fa-plus"></i> New
          </button>
        </div>
      </div>
    </header>
  );
}

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <button
          className={`nav-item${activeView === "chat" ? " active" : ""}`}
          data-view="chat"
          onClick={() => setActiveView("chat")}
        >
          <i className="fas fa-comments"></i> <span>Chat</span>
        </button>
        <button
          className={`nav-item${activeView === "image" ? " active" : ""}`}
          data-view="image"
          onClick={() => setActiveView("image")}
        >
          <i className="fas fa-image"></i> <span>Image Generation</span>
        </button>
        <button
          className={`nav-item${activeView === "settings" ? " active" : ""}`}
          data-view="settings"
          onClick={() => setActiveView("settings")}
        >
          <i className="fas fa-cog"></i> <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
}

interface ChatViewProps {
  onSend: () => void;
  onClearHistory: () => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
}

function ChatView({
  onSend,
  onClearHistory,
  chatMessages,
  chatInput,
  setChatInput,
}: ChatViewProps) {
  return (
    <div id="chatView" className="view active">
      <div className="chat-container">
        <div className="chat-header">
          <h2>
            <i className="fas fa-comments"></i> Chat
          </h2>
          <button
            className="btn btn-secondary"
            onClick={onClearHistory}
            title="Clear chat history"
          >
            <i className="fas fa-trash"></i> Clear History
          </button>
        </div>
        <div className="chat-messages" id="chatMessages">
          {chatMessages.length === 0 ? (
            <div className="welcome-message">
              <i className="fas fa-robot"></i>
              <h2>Welcome to Keipes AI</h2>
              <p>How can I help you today?</p>
            </div>
          ) : (
            chatMessages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "user-message" : "ai-message"}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>
        <div className="chat-input-container">
          <div className="input-wrapper">
            <input
              type="text"
              id="chatInput"
              placeholder="Type your message here..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
            />
            <button id="sendBtn" className="send-btn" onClick={onSend}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImageViewProps {
  onGenerate: () => void;
  imagePrompt: string;
  setImagePrompt: (prompt: string) => void;
  imageOutput: string;
  isGenerating: boolean;
}

function ImageView({
  onGenerate,
  imagePrompt,
  setImagePrompt,
  imageOutput,
  isGenerating,
}: ImageViewProps) {
  return (
    <div id="imageView" className="view">
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

interface SettingsViewProps {
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  onSave: () => void;
}

function SettingsView({ settings, setSettings, onSave }: SettingsViewProps) {
  return (
    <div id="settingsView" className="view">
      <div className="settings-container">
        <h2>
          <i className="fas fa-cog"></i> Settings
        </h2>
        <div className="settings-section">
          <h3>API Configuration</h3>
          <div className="input-group">
            <label htmlFor="geminiApiKey">Gemini API Key:</label>
            <input
              type="password"
              id="geminiApiKey"
              value={settings.geminiApiKey}
              onChange={(e) =>
                setSettings((s) => ({ ...s, geminiApiKey: e.target.value }))
              }
              placeholder="Enter your Gemini API key"
            />
          </div>
          <div className="input-group">
            <label htmlFor="openaiApiKey">OpenAI API Key:</label>
            <input
              type="password"
              id="openaiApiKey"
              value={settings.openaiApiKey}
              onChange={(e) =>
                setSettings((s) => ({ ...s, openaiApiKey: e.target.value }))
              }
              placeholder="Enter your OpenAI API key"
            />
          </div>
          <div className="input-group">
            <label htmlFor="imageProvider">Image Generation Provider:</label>
            <select
              id="imageProvider"
              value={settings.imageProvider}
              onChange={(e) =>
                setSettings((s) => ({ ...s, imageProvider: e.target.value }))
              }
            >
              <option value="gemini">Google Gemini (Free)</option>
              <option value="openai">OpenAI DALL-E (Requires API Key)</option>
            </select>
          </div>
        </div>
        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                id="darkMode"
                checked={settings.darkMode}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, darkMode: e.target.checked }))
                }
              />
              <span>Dark Mode</span>
            </label>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                id="autoSave"
                checked={settings.autoSave}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, autoSave: e.target.checked }))
                }
              />
              <span>Auto-save conversations</span>
            </label>
          </div>
        </div>
        <button id="saveSettings" className="btn btn-primary" onClick={onSave}>
          <i className="fas fa-save"></i> Save Settings
        </button>
      </div>
    </div>
  );
}

interface FooterProps {
  status: string;
  appVersion: string;
}

function Footer({ status, appVersion }: FooterProps) {
  return (
    <footer className="status-bar">
      <div className="status-left">
        <span id="statusText">{status}</span>
      </div>
      <div className="status-right">
        <span id="appVersion">{appVersion}</span>
      </div>
    </footer>
  );
}

export default function App() {
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

  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    setIsGenerating(true);
    setStatus("Generating image...");
    // TODO: Integrate with image-service
    setTimeout(() => {
      setImageOutput("https://placehold.co/400x300?text=Generated+Image");
      setIsGenerating(false);
      setStatus("Image generated");
    }, 2000);
  };

  const handleSaveSettings = () => {
    setStatus("Settings saved");
    // TODO: Persist settings
  };

  return (
    <div className={`app-container${settings.darkMode ? " dark" : ""}`}>
      <Header />
      <main className="main-content">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <section className="content-area">
          {activeView === "chat" && (
            <ChatView
              onSend={handleSendMessage}
              onClearHistory={handleClearHistory}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
            />
          )}
          {activeView === "image" && (
            <ImageView
              onGenerate={handleGenerateImage}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              imageOutput={imageOutput}
              isGenerating={isGenerating}
            />
          )}
          {activeView === "settings" && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
            />
          )}
        </section>
      </main>
      <Footer status={status} appVersion={appVersion} />
    </div>
  );
}
