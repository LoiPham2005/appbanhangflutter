import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    textColor: isDarkMode ? '#ffffff' : '#000000',
    secondaryBackground: isDarkMode ? '#333' : '#f4f4f4',
    borderColor: isDarkMode ? '#333' : '#f4f4f4',
    placeholderColor: isDarkMode ? '#888' : '#999',
    primaryColor: '#2196F3',
    secondaryColor: '#4CAF50',
    errorColor: '#ff0000',
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};