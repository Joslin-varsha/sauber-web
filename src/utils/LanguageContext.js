'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import de from '../locales/de.json';
import ar from '../locales/ar.json';

const LanguageContext = createContext();

const translations = {
  English: en,
  German: de,
  Arabic: ar
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('English');

  // Load language from storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = sessionStorage.getItem('app_language');
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguageState(newLang);
      sessionStorage.setItem('app_language', newLang);
      
      // Dispatch a custom event to alert other windows/non-context listening systems if needed
      window.dispatchEvent(new Event('languageChange'));
    }
  };

  const t = (key, defaultValue = '') => {
    const langDict = translations[language] || translations['English'];
    return langDict[key] || defaultValue || key;
  };

  const tr = t;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
