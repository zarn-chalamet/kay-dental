import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'mm';
  setLanguage: (lang: 'en' | 'mm') => void;
  toggleLanguage: () => void;
  t: (en: string, mm: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'mm' : 'en' })),
      t: (en, mm) => get().language === 'en' ? en : (mm || en),
    }),
    { name: 'kay-dental-language' }
  )
);
