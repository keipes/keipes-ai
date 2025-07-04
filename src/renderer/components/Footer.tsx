import React from "react";

interface FooterProps {
  status: string;
  appVersion: string;
}

export function Footer({ status, appVersion }: FooterProps) {
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
