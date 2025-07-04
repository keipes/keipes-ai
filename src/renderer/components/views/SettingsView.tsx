import React from "react";
import { Settings } from "../../types/app-types";

interface SettingsViewProps {
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  onSave: () => void;
  className?: string;
}

export function SettingsView({
  settings,
  setSettings,
  onSave,
  className,
}: SettingsViewProps) {
  return (
    <div id="settingsView" className={className || "view"}>
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
            <label htmlFor="anthropicApiKey">Anthropic API Key:</label>
            <input
              type="password"
              id="anthropicApiKey"
              value={settings.anthropicApiKey}
              onChange={(e) =>
                setSettings((s) => ({ ...s, anthropicApiKey: e.target.value }))
              }
              placeholder="Enter your Anthropic API key"
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
              <option value="anthropic">Anthropic Claude (Chat Only)</option>
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
