"use client";

import { useLanguage } from "@/lib/i18n/useLanguage";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "pill" | "segmented" | "compact";
  className?: string;
}

export function LanguageSwitcher({
  variant = "pill",
  className = "",
}: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage, isVi, isEn } = useLanguage();

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono select-none backdrop-blur-md ${className}`}
      >
        <button
          type="button"
          onClick={() => setLanguage("vi")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold apple-press-sm ${
            isVi
              ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-300 border border-black/[0.05] dark:border-white/[0.1] shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          title="Tiếng Việt"
        >
          <span>🇻🇳</span>
          <span>VI</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer font-bold apple-press-sm ${
            isEn
              ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-300 border border-black/[0.05] dark:border-white/[0.1] shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
          title="English"
        >
          <span>🇬🇧</span>
          <span>EN</span>
        </button>
      </div>
    );
  }

  // Mặc định: Nút bấm Pill 1 chạm chuyển đổi ngôn ngữ
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all duration-150 text-xs font-mono font-medium shadow-xs cursor-pointer backdrop-blur-md group apple-press-sm ${className}`}
      title={isVi ? "Chuyển sang Tiếng Anh (English)" : "Switch to Vietnamese (Tiếng Việt)"}
    >
      <Languages className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 group-hover:rotate-12 transition-transform duration-200" />
      <div className="flex items-center gap-1">
        <span>{isVi ? "🇻🇳" : "🇬🇧"}</span>
        <span className="font-bold text-amber-600 dark:text-amber-300">{isVi ? "VI" : "EN"}</span>
      </div>
    </button>
  );
}

