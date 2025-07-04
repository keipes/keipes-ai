import React from "react";

export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
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
