import React from "react";
import type { ElectronAPI } from "../preload/api";
import { Header, Sidebar, Footer } from "./components";
import { ChatView, ImageView, SettingsView } from "./components/views";
import { useApp } from "./hooks/useApp";

// Extend the Window interface to include electronAPI
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export default function App() {
  const {
    activeView,
    chatInput,
    chatMessages,
    imagePrompt,
    imageOutput,
    isGenerating,
    status,
    appVersion,
    settings,
    setActiveView,
    setChatInput,
    setImagePrompt,
    setSettings,
    handleSendMessage,
    handleClearHistory,
    handleGenerateImage,
    handleSaveSettings,
  } = useApp();

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
              className="view active"
            />
          )}
          {activeView === "settings" && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveSettings}
              className="view active"
            />
          )}
        </section>
      </main>
      <Footer status={status} appVersion={appVersion} />
    </div>
  );
}
