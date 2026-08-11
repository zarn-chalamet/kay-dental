import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'mm';
  setLanguage: (lang: 'en' | 'mm') => void;
  toggleLanguage: () => void;
  t: (en: string, mm: string) => string;
}

// Helper to update <html lang> attribute
const updateHtmlLang = (lang: 'en' | 'mm') => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => {
        set({ language: lang });
        updateHtmlLang(lang);
      },
      toggleLanguage: () =>
        set((state) => {
          const next = state.language === 'en' ? 'mm' : 'en';
          updateHtmlLang(next);
          return { language: next };
        }),
      t: (en, mm) => (get().language === 'en' ? en : mm || en),
    }),
    {
      name: 'kay-dental-language',
      onRehydrateStorage: () => (state) => {
        // Set html lang after language is loaded from localStorage
        if (state) {
          updateHtmlLang(state.language);
        }
      },
    }
  )
);