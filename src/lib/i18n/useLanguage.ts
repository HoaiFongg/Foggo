"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, Translations } from "./types";
import { vi } from "./vi";
import { en } from "./en";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "vi",
      setLanguage: (lang: Language) => {
        if (typeof document !== "undefined") {
          document.cookie = `foggo_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.lang = lang;
        }
        set({ language: lang });
      },
      toggleLanguage: () => {
        const nextLang: Language = get().language === "vi" ? "en" : "vi";
        get().setLanguage(nextLang);
      },
    }),
    {
      name: "foggo_user_language",
    }
  )
);

export function useLanguage() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const toggleLanguage = useLanguageStore((s) => s.toggleLanguage);

  const t: Translations = language === "en" ? en : vi;

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isEn: language === "en",
    isVi: language === "vi",
  };
}
