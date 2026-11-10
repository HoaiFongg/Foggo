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
        className={`inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono select-none backdrop-blur-md shadow-inner ${className}`}
      >
        <button
          type="button"
          onClick={() => setLanguage("vi")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
            isVi
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
          title="Tiếng Việt"
        >
          <span>🇻🇳</span>
          <span>VI</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
            isEn
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
              : "text-slate-400 hover:text-white"
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
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-white transition-all text-xs font-mono font-medium shadow-sm active:scale-95 cursor-pointer backdrop-blur-md group ${className}`}
      title={isVi ? "Chuyển sang Tiếng Anh (English)" : "Switch to Vietnamese (Tiếng Việt)"}
    >
      <Languages className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
      <div className="flex items-center gap-1">
        <span>{isVi ? "🇻🇳" : "🇬🇧"}</span>
        <span className="font-bold text-amber-300">{isVi ? "VI" : "EN"}</span>
      </div>
    </button>
  );
}

