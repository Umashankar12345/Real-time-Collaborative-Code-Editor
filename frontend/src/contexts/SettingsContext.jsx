import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const defaultSettings = {
    uiTheme: 'dark', // 'dark' or 'light'
    fontSize: 14,
    theme: 'vs-dark',
    wordWrap: 'off',
    minimap: false,
    tabSize: 2,
    showCursors: true,
    showUserNames: true
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ide-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('ide-settings', JSON.stringify(settings));
    
    // Apply light mode to body
    if (settings.uiTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
