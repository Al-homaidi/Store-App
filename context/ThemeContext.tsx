import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '@/utils/storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: string;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  themeMode: 'system',
  setThemeMode: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<string>(systemColorScheme || 'light');

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await storage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  useEffect(() => {
    let currentTheme: string;
    
    if (themeMode === 'system') {
      currentTheme = systemColorScheme || 'light';
    } else {
      currentTheme = themeMode;
    }
    
    setTheme(currentTheme);
    
    const saveThemePreference = async () => {
      try {
        await storage.setItem('themeMode', themeMode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [themeMode, systemColorScheme]);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};