// contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const systemTheme = useColorScheme(); // 'light' or 'dark'
  const [theme, setTheme] = useState(systemTheme || 'light');

  useEffect(() => {
    async function loadTheme() {
      const stored = await AsyncStorage.getItem('theme');
      if (stored) {
        setTheme(stored);
      } else {
        setTheme(systemTheme || 'light');
      }
    }
    loadTheme();
  }, [systemTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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