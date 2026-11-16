"use client";

import { useTheme } from "@/lib/theme/useTheme";
import { Sun, Moon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/useLanguage";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme, isDark } = useTheme();
  const { isVi } = useLanguage();

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-all duration-150 text-xs font-mono font-medium shadow-xs cursor-pointer backdrop-blur-md group apple-press-sm ${className}`}
      title={
        isDark
          ? isVi
            ? "Chuyển sang Giao diện Sáng (Light Mode)"
            : "Switch to Light Mode"
          : isVi
          ? "Chuyển sang Giao diện Tối (Dark Mode)"
          : "Switch to Dark Mode"
      }
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-200" />
          <span className="text-[11px] font-bold text-amber-300 hidden sm:inline">
            {isVi ? "Sáng" : "Light"}
          </span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-blue-500 group-hover:-rotate-12 transition-transform duration-200" />
          <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">
            {isVi ? "Tối" : "Dark"}
          </span>
        </>
      )}
    </button>
  );
}
