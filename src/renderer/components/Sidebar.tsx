import React from "react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
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
