import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (en: string, ar: string) => string;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
  isRtl: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('expo_lang') as Language) || 'en';
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('expo_lang', lang);
  }, [lang]);

  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRtl: lang === 'ar' }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
