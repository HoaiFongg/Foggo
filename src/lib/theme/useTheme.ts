"use client";

import { useState, useEffect } from "react";

export type AppTheme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<AppTheme>("light");

  useEffect(() => {
    try {
      const v = localStorage.getItem("foggo_theme_v_light");
      if (!v) {
        localStorage.setItem("foggo_theme", "light");
        localStorage.setItem("foggo_theme_v_light", "1");
        setThemeState("light");
        applyThemeToDOM("light");
        return;
      }
      const saved = localStorage.getItem("foggo_theme") as AppTheme | null;
      if (saved === "light" || saved === "dark") {
        setThemeState(saved);
        applyThemeToDOM(saved);
      } else {
        setThemeState("light");
        applyThemeToDOM("light");
      }
    } catch {}
  }, []);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("foggo_theme", newTheme);
      applyThemeToDOM(newTheme);
    } catch {}
  };

  return { theme, setTheme, isDark: theme === "dark" };
}

function applyThemeToDOM(theme: AppTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }
}

