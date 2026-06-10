"use client";

type TabBarProps = {
  activeTab: "editor" | "settings";
  onTabChange: (tab: "editor" | "settings") => void;
};

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="tab-bar">
      <button
        className={`tab-button ${activeTab === "editor" ? "active" : ""}`}
        onClick={() => onTabChange("editor")}
      >
        Editor
      </button>
      <button
        className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
        onClick={() => onTabChange("settings")}
      >
        Configurações
      </button>
    </div>
  );
}
