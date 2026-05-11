"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLocale, getDirection, locales, translations, type Locale } from "@/lib/translations";

type LanguageContextValue = {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: string, defaultText: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function normalizeLookupValue(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function findTranslationKey(candidate: string) {
  const normalizedCandidate = normalizeLookupValue(candidate);

  for (const [translationKey, englishText] of Object.entries(translations.en)) {
    if (normalizeLookupValue(englishText) === normalizedCandidate) {
      return translationKey;
    }
  }

  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem("site-language") as Locale | null;
    const nextLanguage = stored && locales.includes(stored) ? stored : defaultLocale;
    setLanguageState(nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = getDirection(nextLanguage);
  }, []);

  const setLanguage = (nextLanguage: Locale) => {
    if (!locales.includes(nextLanguage)) return;
    setLanguageState(nextLanguage);
    window.localStorage.setItem("site-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = getDirection(nextLanguage);
  };

  const t = useMemo(
    () => (key: string, defaultText: string) => {
      const directMatch = translations[language]?.[key];

      if (directMatch) {
        return directMatch;
      }

      const resolvedKey = findTranslationKey(defaultText) ?? findTranslationKey(key);

      if (resolvedKey) {
        return translations[language]?.[resolvedKey] ?? defaultText;
      }

      return defaultText;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
