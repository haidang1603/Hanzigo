import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('hanzigo_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('hanzigo_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('hanzigo_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('hanzigo_theme', 'light');
      }
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('hanzigo_sound_enabled', String(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleSound = () => setSoundEnabled(prev => !prev);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleDarkMode,
        soundEnabled,
        setSoundEnabled,
        toggleSound
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
