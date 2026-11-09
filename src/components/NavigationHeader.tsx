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
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-lg font-black tracking-tight text-white font-mono">
              FOG<span className="text-amber-400">GO</span>
            </span>
          </Link>

          {/* Clean Minimal Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium overflow-x-auto py-1 no-scrollbar">
            <Link
              href="/dashboard"
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
                activeItem === "dashboard"
                  ? "bg-slate-800 text-amber-400 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tổng quan</span>
            </Link>

            <Link
              href="/worlds"
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
                activeItem === "worlds"
                  ? "bg-slate-800 text-amber-400 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Hầm ngục</span>
            </Link>

            {isTeacherOrAdmin && (
              <Link
                href="/dashboard/sets"
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeItem === "sets"
                    ? "bg-slate-800 text-amber-400 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bộ câu hỏi</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin?tab=students"
                className="px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors shrink-0"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Học sinh</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin?tab=teachers"
                className="px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors shrink-0"
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Giáo viên</span>
              </Link>
            )}

            {isTeacherOrAdmin && (
              <Link
                href="/explore"
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
                  activeItem === "explore"
                    ? "bg-slate-800 text-amber-400 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Khám phá</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors shrink-0 ${
                  activeItem === "admin"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "text-rose-400 hover:bg-rose-500/10"
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Mở Hầm Ngục</span>
            </Link>
          )}

          {/* Đom Đóm (tiền ngoài ván) */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{fireflies}</span>
          </div>

          {/* Profile & Role */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-200 leading-tight">{displayName}</p>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                  isAdmin
                    ? "text-rose-400"
                    : isTeacher
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
              >
                {isAdmin ? "Admin" : isTeacher ? "Giáo viên" : "Học sinh"}
              </span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                title="Đăng xuất"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors cursor-pointer"
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
