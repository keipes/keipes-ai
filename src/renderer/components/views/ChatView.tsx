import React from "react";
import { ChatMessage } from "../../types/app-types";

interface ChatViewProps {
  onSend: () => void;
  onClearHistory: () => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (input: string) => void;
}

export function ChatView({
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
