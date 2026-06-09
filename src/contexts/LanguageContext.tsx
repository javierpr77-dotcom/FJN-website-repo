import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from '@/translations';

export { type Language };

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  // Auto-detect language on load
  useEffect(() => {
    let saved: Language | null = null;
    try {
      saved = localStorage.getItem('app-lang') as Language;
    } catch (e) {
      console.warn("localStorage not available");
    }

    if (saved) {
      setLanguage(saved);
    } else {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      const defaultLang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';
      setLanguage(defaultLang);
      try {
        localStorage.setItem('app-lang', defaultLang);
      } catch (e) {
        console.warn("localStorage not available");
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem('app-lang', lang);
    } catch (e) {
      console.warn("localStorage not available");
    }
  };

  const t = (key: string, defaultText: string = key) => {
    return translations[key]?.[language] || defaultText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
