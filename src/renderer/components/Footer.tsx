import React, { useState, useEffect } from "react";

interface FooterProps {
  status: string;
  appVersion: string;
}

export function Footer({ status, appVersion }: FooterProps) {
  const [currentProvider, setCurrentProvider] = useState<string>("openai");
  const [providers] = useState<string[]>(["openai", "anthropic"]);

  useEffect(() => {
    // Get current provider on mount
    const getCurrentProvider = async () => {
      try {
        const provider = await window.electronAPI.getProviderName();
        setCurrentProvider(provider);
      } catch (error) {
        console.error("Failed to get current provider:", error);
      }
    };
    getCurrentProvider();
  }, []);

  const handleProviderChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newProvider = event.target.value;
    try {
      await window.electronAPI.setProvider(newProvider);
      setCurrentProvider(newProvider);
    } catch (error) {
      console.error("Failed to set provider:", error);
    }
  };

  return (
    <footer className="status-bar">
      <div className="status-left">
        <span id="statusText">{status}</span>
      </div>
      <div className="status-center">
        <label
          htmlFor="provider-select"
          style={{ marginRight: "0.5rem", fontSize: "0.75rem" }}
        >
          Provider:
        </label>
        <select
          id="provider-select"
          value={currentProvider}
          onChange={handleProviderChange}
          style={{
            fontSize: "0.75rem",
            padding: "0.25rem 0.5rem",
            minWidth: "100px",
            backgroundColor: "var(--background-color)",
            border: "1px solid var(--border-color)",
            borderRadius: "4px",
            color: "var(--text-primary)",
          }}
        >
          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="status-right">
        <span id="appVersion">{appVersion}</span>
      </div>
    </footer>
  );
}
