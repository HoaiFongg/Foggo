import Link from "next/link";
import {
  Flame,
  Sparkles,
  Compass,
  PlusCircle,
  LogOut,
  Swords,
  BookOpen,
  ShieldCheck,
  Crown,
  LayoutDashboard,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import type { Profile } from "@/types/database";

interface NavigationHeaderProps {
  profile: Profile | null;
  activeItem?: "dashboard" | "worlds" | "sets" | "explore" | "admin" | "subscription";
}

export function NavigationHeader({
  profile,
  activeItem = "dashboard",
}: NavigationHeaderProps) {
  const role = profile?.role || "student";
  const plan = profile?.plan || "free";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isTeacherOrAdmin = isAdmin || isTeacher;
  const fireflies = profile?.fireflies ?? (isAdmin ? 9999 : 120);
  const displayName = profile?.display_name || "Nhà Thám Hiểm";

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-mono">
              FOG<span className="text-amber-400">GO</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeItem === "dashboard"
                  ? "bg-slate-800 text-amber-400 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tổng quan</span>
            </Link>

            <Link
              href="/worlds"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeItem === "worlds"
                  ? "bg-slate-800 text-amber-400 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Hầm Ngục & Thế Giới</span>
            </Link>

            <Link
              href="/explore"
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activeItem === "explore"
                  ? "bg-slate-800 text-amber-400 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Khám Phá Đề</span>
            </Link>

            {isTeacherOrAdmin && (
              <Link
                href="/dashboard/sets"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeItem === "sets"
                    ? "bg-slate-800 text-amber-400 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bộ Câu Hỏi</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all shadow-sm ${
                  activeItem === "admin"
                    ? "bg-rose-500 text-white shadow-rose-500/20"
                    : "bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white"
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Quản Trị Hệ Thống</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Quick Actions, Currency, User Profile & Logout */}
        <div className="flex items-center gap-3">
          {/* Quick Action Button for Teacher & Admin */}
          {isTeacherOrAdmin && (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/teacher/worlds/new"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Mở Hầm Ngục</span>
              </Link>

              <Link
                href="/dashboard/sets/new"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <span>+ Thêm Câu Hỏi</span>
              </Link>
            </div>
          )}

          {/* Đom Đóm (tiền ngoài ván) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{fireflies} Đom Đóm</span>
          </div>

          {/* User Profile & Role Info */}
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200 flex items-center justify-end gap-1">
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                ) : null}
                <span>{displayName}</span>
              </p>

              <div className="flex items-center justify-end gap-1 mt-0.5">
                {isAdmin ? (
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[9px] font-black uppercase tracking-wider">
                    QUẢN TRỊ VIÊN (ADMIN)
                  </span>
                ) : isTeacher ? (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                    GIÁO VIÊN
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                    HỌC SINH
                  </span>
                )}

                {plan === "plus" && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono text-[9px] font-black uppercase tracking-wider">
                    PLUS
                  </span>
                )}
              </div>
            </div>

            <form action={logout}>
              <button
                type="submit"
                title="Đăng xuất"
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}

