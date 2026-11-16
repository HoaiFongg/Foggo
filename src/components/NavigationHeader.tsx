"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Compass,
  Plus,
  LogOut,
  Swords,
  BookOpen,
  Crown,
  LayoutDashboard,
  Settings,
  ArrowLeft,
  LogIn,
  UserPlus,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserSettingsModal } from "@/components/UserSettingsModal";
import type { Profile } from "@/types/database";

interface NavigationHeaderProps {
  profile: Profile | null;
  activeItem?: "dashboard" | "worlds" | "sets" | "explore" | "admin" | "subscription" | "pricing";
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function NavigationHeader({
  profile,
  activeItem = "dashboard",
  showBackButton = false,
  backHref,
  backLabel,
}: NavigationHeaderProps) {
  const { t, isEn } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isLoggedIn = !!profile;
  const displayName = profile?.display_name || (isEn ? "Student" : "Học sinh");
  const role = profile?.role || "student";
  const isAdmin = role === "admin" || displayName.toLowerCase().includes("admin");
  const isTeacher = role === "teacher" || isAdmin;
  const isTeacherOrAdmin = isAdmin || isTeacher;
  const fireflies = profile?.fireflies ?? (isAdmin ? 9999 : 120);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 border-b-2 border-black/[0.08] dark:border-white/10 backdrop-blur-md shadow-xs">
        <div className="w-full px-3 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Back button (optional) & Logo & Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Optional Back Button */}
            {(showBackButton || backHref) && (
              <Link
                href={backHref || "/dashboard"}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-800 shadow-2xs cursor-pointer active:scale-95 shrink-0"
                title={backLabel || (isEn ? "Back" : "Quay lại")}
              >
                <ArrowLeft className="w-4 h-4 text-amber-500" />
                <span className="hidden md:inline">{backLabel || (isEn ? "Back" : "Quay lại")}</span>
              </Link>
            )}

            {/* Foggo Logo */}
            <Link
              href={isLoggedIn ? "/dashboard" : "/"}
              className="flex items-center gap-2 group shrink-0 active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/25 transition-all shadow-inner">
                <Flame className="w-4 h-4 animate-pulse fill-amber-400/30 text-amber-500 dark:text-amber-400 motion-reduce:animate-none" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white font-pixel">
                  FOG<span className="text-amber-500 dark:text-amber-400">GO</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1 py-0.2 rounded-none border border-amber-500/30 uppercase tracking-wider">
                  RPG
                </span>
              </div>
            </Link>

            {/* Apple Segmented Pill Navigation */}
            <nav className="flex items-center gap-0.5 sm:gap-1 text-xs font-medium overflow-x-auto py-1 no-scrollbar p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.05]">
              {/* Trang Chủ */}
              <Link
                href="/dashboard"
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 shrink-0 font-medium text-xs apple-press-sm ${activeItem === "dashboard"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-black/[0.05] dark:border-white/[0.1]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t.nav.dashboard}</span>
              </Link>

              {/* Hầm Ngục */}
              <Link
                href="/worlds"
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 shrink-0 font-medium text-xs apple-press-sm ${activeItem === "worlds"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-black/[0.05] dark:border-white/[0.1]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
              >
                <Swords className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t.nav.worlds}</span>
              </Link>

              {/* Bộ câu hỏi (Giáo viên / Admin) */}
              {isTeacherOrAdmin && (
                <Link
                  href="/dashboard/sets"
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 shrink-0 font-medium text-xs apple-press-sm ${activeItem === "sets"
                      ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-black/[0.05] dark:border-white/[0.1]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    }`}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{t.nav.questionSets}</span>
                </Link>
              )}

              {/* Khám Phá */}
              {isTeacherOrAdmin && (
                <Link
                  href="/explore"
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 shrink-0 font-medium text-xs apple-press-sm ${activeItem === "explore"
                      ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-black/[0.05] dark:border-white/[0.1]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    }`}
                >
                  <Compass className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{t.nav.explore}</span>
                </Link>
              )}

              {/* Bảng Giá / Gói Plus */}
              <Link
                href="/pricing"
                className={`px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 shrink-0 font-medium text-xs apple-press-sm ${activeItem === "pricing" || activeItem === "subscription"
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs border border-black/[0.05] dark:border-white/[0.1]"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="hidden sm:inline">{t.nav.pricing}</span>
              </Link>

              {/* Quản Trị (Admin tối cao) */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium transition-all duration-150 shrink-0 text-xs apple-press-sm ${activeItem === "admin"
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold shadow-xs border border-indigo-200 dark:border-indigo-500/30"
                      : "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                    }`}
                >
                  <Crown className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{t.nav.admin}</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right: Actions, Language, Theme & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Create Button */}
            {isTeacherOrAdmin && (
              <Link
                href="/teacher/worlds/new"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm shadow-amber-500/20 apple-press cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.nav.openDungeon}</span>
              </Link>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Logged in state */}
            {isLoggedIn ? (
              <>
                {/* Điểm Thành Tích (Retro Pixel Chip) */}
                <div
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-none bg-amber-500/10 border-2 border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold shadow-[2px_2px_0_rgba(245,158,11,0.2)]"
                  title={isEn ? "Achievement Points" : "Điểm Thành Tích"}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className="font-bold text-amber-600 dark:text-amber-400">{fireflies}</span>
                </div>

                {/* Profile Squircle & Role */}
                <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2.5 border-l border-black/[0.06] dark:border-white/[0.08]">
                  <div
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-xs shrink-0 cursor-pointer"
                    onClick={() => setIsSettingsOpen(true)}
                    title={displayName}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  <div className="text-right hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[110px]">
                      {displayName}
                    </p>
                    <span
                      className={`text-[10px] font-mono font-bold inline-flex items-center gap-1 ${isAdmin
                          ? "text-indigo-600 dark:text-indigo-400"
                          : isTeacher
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-indigo-500" : isTeacher ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                      />
                      {isAdmin ? t.common.admin : isTeacher ? t.common.teacher : t.common.student}
                    </span>
                  </div>

                  {/* Settings Modal Button */}
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    title={t.common.personalSettings}
                    className="p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer group apple-press-sm"
                  >
                    <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300 text-slate-500 dark:text-slate-400 group-hover:text-amber-500" />
                  </button>

                  {/* Logout */}
                  <form action={logout}>
                    <button
                      type="submit"
                      title={t.common.logout}
                      className="p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer apple-press-sm"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Guest state (not logged in) */
              <div className="flex items-center gap-2 pl-2 border-l border-black/[0.06] dark:border-white/[0.08]">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t.common.login}</span>
                </Link>
                <Link
                  href="/register/student"
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t.common.register}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Cài Đặt Cá Nhân */}
      {isLoggedIn && (
        <UserSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={profile}
        />
      )}
    </>
  );
}
