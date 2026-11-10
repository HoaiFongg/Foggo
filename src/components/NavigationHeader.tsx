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
  Users,
  GraduationCap,
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
  const displayName = profile?.display_name || "Người chơi";
  const role = profile?.role || "student";
  const isAdmin = role === "admin" || displayName.toLowerCase().includes("admin");
  const isTeacher = role === "teacher" || isAdmin;
  const isTeacherOrAdmin = isAdmin || isTeacher;
  const fireflies = profile?.fireflies ?? (isAdmin ? 9999 : 120);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400/60 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.25)] transition-all">
              <Flame className="w-4 h-4 animate-pulse fill-amber-400/30 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black tracking-tight text-white font-mono">
                FOG<span className="text-amber-400">GO</span>
              </span>
              <span className="hidden md:inline-block text-[9px] font-mono text-amber-400/80 uppercase font-bold tracking-widest bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                RPG
              </span>
            </div>
          </Link>

          {/* Clean Minimal Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium overflow-x-auto py-1 no-scrollbar">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 font-mono text-xs ${
                activeItem === "dashboard"
                  ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tổng quan</span>
            </Link>

            <Link
              href="/worlds"
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 font-mono text-xs ${
                activeItem === "worlds"
                  ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Hầm ngục</span>
            </Link>

            {isTeacherOrAdmin && (
              <Link
                href="/dashboard/sets"
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 font-mono text-xs ${
                  activeItem === "sets"
                    ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bộ câu hỏi</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin?tab=students"
                className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-900 transition-all shrink-0 font-mono text-xs border border-transparent"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Học sinh</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin?tab=teachers"
                className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-400 hover:text-white hover:bg-slate-900 transition-all shrink-0 font-mono text-xs border border-transparent"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Giáo viên</span>
              </Link>
            )}

            {isTeacherOrAdmin && (
              <Link
                href="/explore"
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 font-mono text-xs ${
                  activeItem === "explore"
                    ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Khám phá</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold transition-all shrink-0 font-mono text-xs ${
                  activeItem === "admin"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                    : "text-rose-400 hover:bg-rose-500/10 border border-transparent"
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Quản trị</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Create Button */}
          {isTeacherOrAdmin && (
            <Link
              href="/teacher/worlds/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold font-mono transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Mở Hầm Ngục</span>
            </Link>
          )}

          {/* Đom Đóm (tiền ngoài ván) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-mono shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-300">{fireflies}</span>
          </div>

          {/* Profile & Role */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            {/* Avatar Pill */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200 leading-tight truncate max-w-[120px]">{displayName}</p>
              <span
                className={`text-[9px] font-mono uppercase tracking-wider font-bold inline-flex items-center gap-1 ${
                  isAdmin
                    ? "text-rose-400"
                    : isTeacher
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? "bg-rose-400" : isTeacher ? "bg-amber-400" : "bg-emerald-400"}`} />
                {isAdmin ? "Admin" : isTeacher ? "Giáo viên" : "Học sinh"}
              </span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                title="Đăng xuất"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
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
