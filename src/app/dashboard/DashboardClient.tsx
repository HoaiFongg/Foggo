"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Plus,
  Trophy,
  Swords,
  BookOpen,
  Crown,
  ArrowRight,
  ArrowUpRight,
  Settings,
  Sparkles,
  Shield,
  Hammer,
  GraduationCap,
  School as SchoolIcon,
  Coins,
  Flame,
  Heart,
  Users,
  Target,
  Zap,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { startHomeFarmSession } from "@/app/teacher/worlds/actions";
import { QuickJoinCard } from "@/components/QuickJoinCard";
import { DailyLoginStreakCard } from "@/components/DailyLoginStreakCard";
import { UserSettingsModal } from "@/components/UserSettingsModal";
import { PixelHero } from "@/components/PixelHero";
import { PixelItemIcon } from "@/components/PixelItemIcon";

interface DashboardClientProps {
  user: any;
  profile: any;
  role: string;
  isAdmin: boolean;
  isTeacher: boolean;
  isTeacherOrAdmin: boolean;
  displayName: string;
  recentWorlds: any[];
  recentSets: any[];
  studentSchoolName: string;
  studentClassName: string;
  openClassWorld: any;
  mySoloFarmSession: any;
  myRecentPlayedWorlds: any[];
  totalScore: number;
  currentGold: number;
  currentHp: number;
  equipped: {
    weapon: any;
    helmet: any;
    armor: any;
    shield: any;
  };
  totalDefensePercent: number;
  weaponAtk: number;
  streakData: any;
  classmates?: any[];
  studentQuizHistory?: any[];
}

export function DashboardClient({
  user,
  profile,
  role,
  isAdmin,
  isTeacher,
  isTeacherOrAdmin,
  displayName,
  recentWorlds,
  recentSets,
  studentSchoolName,
  studentClassName,
  openClassWorld,
  mySoloFarmSession,
  myRecentPlayedWorlds,
  totalScore,
  currentGold,
  currentHp,
  equipped,
  totalDefensePercent,
  weaponAtk,
  streakData,
  classmates = [],
  studentQuizHistory = [],
}: DashboardClientProps) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  const [currentDisplayName, setCurrentDisplayName] = useState(displayName);
  const [currentSchool, setCurrentSchool] = useState(studentSchoolName);
  const [currentClass, setCurrentClass] = useState(studentClassName);

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<
    "profile" | "school" | "security" | "preferences"
  >("profile");

  return (
    <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto font-sans">
      {/* ============================================================== */}
      {/* GIAO DIỆN DÀNH CHO GIÁO VIÊN & ADMIN                           */}
      {/* ============================================================== */}
      {isTeacherOrAdmin ? (
        <>
          {/* Executive Command HUD (Apple Glass) */}
          <div className="apple-glass rounded-3xl p-6 sm:p-7 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/25 shrink-0 apple-press-sm">
                {displayName ? displayName.charAt(0).toUpperCase() : "G"}
              </div>
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight apple-headline">
                    {t.dashboard.welcome} {displayName}
                  </h1>
                  {isAdmin ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-400 font-mono text-[10px] font-bold flex items-center gap-1 shadow-xs apple-caption">
                      <Crown className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                      <span>{t.dashboard.adminRole}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono text-[10px] font-bold flex items-center gap-1 shadow-xs apple-caption">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                      <span>{t.dashboard.teacherRole}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  {isAdmin ? t.dashboard.adminDesc : t.dashboard.teacherDesc}
                </p>

                {/* 3 Chỉ số nhanh */}
                <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">{recentWorlds.length}</span>
                    <span className="text-slate-500 dark:text-slate-400">{isEn ? "Dungeons" : "Hầm ngục"}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-bold text-slate-900 dark:text-white">{recentSets.length}</span>
                    <span className="text-slate-500 dark:text-slate-400">{isEn ? "Sets" : "Bộ đề"}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {recentSets.reduce((sum, s) => sum + (s.play_count || 0), 0)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{isEn ? "Plays" : "Lượt chơi"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Link
                href="/teacher/worlds/new"
                className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/25 apple-press cursor-pointer font-mono"
              >
                <Plus className="w-4 h-4" />
                <span>{t.dashboard.openDungeonBtn}</span>
              </Link>

              <Link
                href="/dashboard/sets/new"
                className="px-4 py-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 border border-black/[0.06] dark:border-white/[0.08] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-mono apple-press"
              >
                <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>{t.dashboard.createSetBtn}</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-mono apple-press"
                >
                  <Crown className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>{t.dashboard.adminPortalBtn}</span>
                </Link>
              )}
            </div>
          </div>

          {/* 4 Thẻ Chức Năng Chính (Apple Bento Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* THẺ 1: HẦM NGỤC SINH TỒN */}
            <Link
              href="/teacher/worlds/new"
              className="group p-6 rounded-3xl apple-glass hover:-translate-y-1 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between apple-press"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-xs">
                    <Swords className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 apple-caption">
                    {isEn ? "LIVE RPG" : "SINH TỒN"}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors apple-headline">
                  {t.dashboard.survivalDungeonCard}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
                  {t.dashboard.survivalDungeonCardDesc}
                </p>

                {/* Preview Visual */}
                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] space-y-2 mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{isEn ? "Battle Arena" : "Sàn Đấu Quái"}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{isEn ? "Wave 1/5" : "Đợt 1/5"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center p-1">
                      <img
                        src="/sprites/slime_idle_1_clean.png"
                        alt="Slime"
                        className="w-6 h-6 object-contain pixelated"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] font-sans font-semibold text-slate-700 dark:text-slate-300">
                        <span>Slime Xanh</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">20 HP</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[65%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:text-amber-500">
                <span>{t.dashboard.initRoomBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>

            {/* THẺ 2: BỘ CÂU HỎI */}
            <Link
              href="/dashboard/sets"
              className="group p-6 rounded-3xl apple-glass hover:-translate-y-1 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between apple-press"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 apple-caption">
                    {isEn ? "8 FORMATS" : "8 DẠNG ĐỀ"}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors apple-headline">
                  {t.dashboard.questionSetsCard}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
                  {t.dashboard.questionSetsCardDesc}
                </p>

                {/* Preview Visual */}
                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{isEn ? "Question Bank" : "Ngân Hàng Câu Hỏi"}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold">{recentSets.length} {isEn ? "sets" : "bộ đề"}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      Trắc nghiệm
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      Kéo thả
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Hotspot
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-500">
                <span>{t.dashboard.manageSetsBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>

            {/* THẺ 3: KHÁM PHÁ CỘNG ĐỒNG */}
            <Link
              href="/explore"
              className="group p-6 rounded-3xl apple-glass hover:-translate-y-1 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between apple-press"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-xs">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 apple-caption">
                    {isEn ? "COMMUNITY" : "CỘNG ĐỒNG"}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors apple-headline">
                  {t.dashboard.exploreCard}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
                  {t.dashboard.exploreCardDesc}
                </p>

                {/* Preview Visual */}
                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{isEn ? "Community Library" : "Thư Viện Đề Thi"}</span>
                    <span className="text-amber-500 font-bold">★ 4.9</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      Tin học 7
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                      Kỹ năng số
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      1-chạm sao chép
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500">
                <span>{t.dashboard.viewExploreBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>

            {/* THẺ 4: QUẢN TRỊ (ADMIN) HOẶC THẾ GIỚI (TEACHER) */}
            {isAdmin ? (
              <Link
                href="/admin"
                className="group p-6 rounded-3xl apple-glass hover:-translate-y-1 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between apple-press"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-xs">
                      <Crown className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 apple-caption">
                      {isEn ? "SUPERADMIN" : "QUẢN TRỊ"}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors apple-headline">
                    {t.dashboard.adminCard}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
                    {t.dashboard.adminCardDesc}
                  </p>

                  {/* Preview Visual */}
                  <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{isEn ? "System Telemetry" : "Hệ Thống"}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        0ms
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                        Toàn quốc
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Bảo mật cao
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500">
                  <span>{t.dashboard.adminPortalBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            ) : (
              <Link
                href="/worlds"
                className="group p-6 rounded-3xl apple-glass hover:-translate-y-1 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between apple-press"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-xs">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 apple-caption">
                      {isEn ? "WORLDS" : "THẾ GIỚI"}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors apple-headline">
                    {t.dashboard.yourWorlds}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
                    {t.worlds.subtitle}
                  </p>

                  <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">{isEn ? "Live Leaderboards" : "Bảng Điểm"}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-semibold">{recentWorlds.length} {isEn ? "rooms" : "phòng"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                        Xếp hạng
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Báo cáo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:text-purple-500">
                  <span>{t.dashboard.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            )}
          </div>

          {/* 2 Cột Danh Sách Gần Đây */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột Trái: Hầm ngục gần đây */}
            <div className="apple-glass rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-xs">
                    <Swords className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2 apple-headline">
                    <span>{t.dashboard.yourWorlds}</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      {recentWorlds.length}
                    </span>
                  </h3>
                </div>
                <Link
                  href="/worlds"
                  className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-500 font-semibold flex items-center gap-1 transition-colors apple-press-sm"
                >
                  <span>{t.dashboard.viewAll}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentWorlds.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
                  <Swords className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p>{t.dashboard.noRecentWorlds}</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentWorlds.map((w) => {
                    const playerCount = w.session_players?.[0]?.count ?? 0;
                    const isOpen = w.status === "open";
                    return (
                      <div
                        key={w.id}
                        className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between gap-3 hover:border-black/[0.08] dark:hover:border-white/[0.12] transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{w.title}</p>
                            {isOpen && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-black/[0.05] dark:border-white/[0.06] text-slate-700 dark:text-slate-300">
                              {w.mode === "survival" ? t.dashboard.survival : t.dashboard.freePlay}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Users className="w-3 h-3 text-slate-400" />
                              <span>{playerCount} {t.dashboard.playersCount}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                              isOpen
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                                : "bg-black/[0.03] dark:bg-white/[0.04] text-slate-500 dark:text-slate-400 border-black/[0.05] dark:border-white/[0.06]"
                            }`}
                          >
                            {isOpen ? t.worlds.open : t.worlds.closed}
                          </span>
                          <Link
                            href={`/teacher/worlds/${w.id}`}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs border border-black/[0.05] dark:border-white/[0.08] transition-colors apple-press-sm"
                            title={isEn ? "Room Settings" : "Cài đặt phòng"}
                          >
                            <Settings className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cột Phải: Bộ câu hỏi gần đây */}
            <div className="apple-glass rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 flex items-center gap-2 apple-headline">
                    <span>{t.dashboard.yourSets}</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                      {recentSets.length}
                    </span>
                  </h3>
                </div>
                <Link
                  href="/dashboard/sets"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 font-semibold flex items-center gap-1 transition-colors apple-press-sm"
                >
                  <span>{t.dashboard.viewAll}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentSets.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 dark:text-slate-500 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p>{t.dashboard.noRecentSets}</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentSets.map((s) => {
                    const qCount = s.questions?.[0]?.count ?? 0;
                    return (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between gap-3 hover:border-black/[0.08] dark:hover:border-white/[0.12] transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.title}</p>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                              {s.subject || "General"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {qCount} {t.dashboard.questionsCount} · {s.play_count} {t.dashboard.playsCount}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/dashboard/sets/${s.id}/edit`}
                            className="px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-black/[0.06] dark:border-white/[0.08] transition-colors apple-press-sm"
                          >
                            {t.dashboard.edit}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ============================================================== */
        /* GIAO DIỆN DÀNH CHO HỌC SINH (Apple Design)                     */
        /* ============================================================== */
        <div className="space-y-8">
          {/* 1. HERO PROFILE CARD (Pixel RPG Adventurer Card) */}
          <div className="pixel-panel rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Chibi Knight Live Avatar */}
              <div className="w-20 h-20 rounded-xl bg-slate-950 border-2 border-amber-500/40 flex items-center justify-center p-1 shadow-inner shrink-0 relative">
                <PixelHero
                  weaponId={equipped?.weapon?.itemId}
                  armorId={equipped?.armor?.itemId}
                  helmetId={equipped?.helmet?.itemId}
                  shieldId={equipped?.shield?.itemId}
                  size={76}
                  showShadow={false}
                />
                <span className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-none bg-amber-500 text-slate-950 font-mono text-[9px] font-black border border-amber-600 shadow-sm">
                  Lv.{Math.max(1, Math.floor(totalScore / 100) + 1)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-pixel">
                    {currentDisplayName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[1px_1px_0_rgba(16,185,129,0.3)]">
                    {t.dashboard.explorer}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsInitialTab("profile");
                      setIsSettingsModalOpen(true);
                    }}
                    className="ml-1 px-3 py-1 rounded-none pixel-btn-neutral text-xs flex items-center gap-1.5 cursor-pointer"
                    title={isEn ? "Personal Settings" : "Cài đặt cá nhân"}
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
                    <span className="text-[11px] font-mono font-bold">{isEn ? "Settings" : "Cài đặt"}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <SchoolIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>{currentSchool || (isEn ? "No School" : "Chưa chọn trường")}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <span>{currentClass || (isEn ? "No Class" : "Chưa chọn lớp")}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Chỉ Số Tài Nguyên (Pixel Stats Box) */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border-2 border-black/[0.1] dark:border-white/10 bg-black/[0.02] dark:bg-slate-900/90 shadow-inner">
              <div className="px-3.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold mb-0.5 font-mono">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{currentGold}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase tracking-wider">
                  {t.dashboard.goldEarned}
                </p>
              </div>

              <div className="px-3.5 py-2 text-center border-x-2 border-black/[0.08] dark:border-white/10">
                <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold mb-0.5 font-mono">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{totalScore}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase tracking-wider">
                  {t.dashboard.scoreAchieved}
                </p>
              </div>

              <div className="px-3.5 py-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-bold mb-0.5 font-mono">
                  <Heart className="w-4 h-4 fill-current text-rose-500" />
                  <span className="text-sm">{currentHp}/100</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase tracking-wider">
                  {t.dashboard.vitality}
                </p>
              </div>
            </div>
          </div>

          {/* 2. ĐIỂM DANH 7 NGÀY NHẬN QUÀ */}
          <DailyLoginStreakCard initialStreakData={streakData} />

          {/* 3. HAI CHẾ ĐỘ CHƠI: BÃI FARM QUÁI & HẦM NGỤC LỚP HỌC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: BÃI FARM QUÁI SINH TỒN (Pixel Art Style) */}
            <div className="relative p-6 sm:p-7 rounded-2xl pixel-panel shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-none bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {t.dashboard.soloFarmBadge}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>24/7 Solo</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 font-mono">
                  {t.dashboard.soloFarmTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
                  {t.dashboard.soloFarmDesc}
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-5 text-[11px] text-slate-700 dark:text-slate-300 font-mono">
                  <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
                    <PixelItemIcon itemId="steel_sword" size={18} />
                    <span>{t.dashboard.turnBasedRpg}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{t.dashboard.farmGoldForGear}</span>
                  </div>
                </div>
              </div>

              <form action={startHomeFarmSession} className="w-full">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-none pixel-btn-amber text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer font-mono"
                >
                  <Swords className="w-4 h-4" />
                  <span>
                    {mySoloFarmSession ? t.dashboard.continueSoloFarm : t.dashboard.startSoloFarm}
                  </span>
                </button>
              </form>
            </div>

            {/* Card 2: HẦM NGỤC LỚP HỌC (Pixel Art Style) */}
            <div className="relative p-6 sm:p-7 rounded-2xl pixel-panel shadow-md flex flex-col justify-between hover:-translate-y-1 transition-all duration-200">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-none bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {t.dashboard.arenaBadge}
                  </span>
                  {openClassWorld && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold font-mono">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      {t.dashboard.activeRoomLive}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 font-mono">
                  {openClassWorld ? openClassWorld.title : t.dashboard.arenaTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 font-normal">
                  {openClassWorld
                    ? (isEn
                      ? "Your class dungeon is live. Gear up and join the battle now."
                      : "Hầm ngục của lớp đang mở. Chuẩn bị trang bị và tham gia ngay.")
                    : (isEn
                      ? "Enter the PIN code provided by your teacher to join the arena."
                      : "Nhập mã PIN hoặc liên kết của giáo viên để thi đấu cùng cả lớp.")}
                </p>

                {openClassWorld ? (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border-2 border-amber-500/25 mb-4">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-300 flex items-center gap-1.5 font-mono">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{openClassWorld.title}</span>
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <QuickJoinCard />
                  </div>
                )}
              </div>

              {openClassWorld && (
                <Link
                  href={`/world/${openClassWorld.id}`}
                  className="w-full py-3.5 px-6 rounded-none pixel-btn-amber text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md font-mono"
                >
                  <Flame className="w-4 h-4" />
                  <span>{t.dashboard.joinClassArena}</span>
                </Link>
              )}
            </div>
          </div>

          {/* 3. KHU VỰC TRANG BỊ & KHO ĐỒ */}
          <div className="apple-glass rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/[0.04] dark:border-white/[0.06] mb-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 apple-headline">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>{t.dashboard.currentGear}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.dashboard.currentGearDesc}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                  {t.dashboard.attackBonus}: <strong>+{weaponAtk}</strong>
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400">
                  {t.dashboard.defenseBonus}: <strong>-{totalDefensePercent}%</strong>
                </span>
              </div>
            </div>

            {/* 4 Ô Trang Bị */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Slot 1: Vũ khí */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Swords className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 font-semibold">
                    {t.dashboard.weapon}
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {equipped.weapon?.name || t.dashboard.defaultWeapon}
                  </p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                    +{equipped.weapon?.atk || 25} Atk
                  </p>
                </div>
              </div>

              {/* Slot 2: Mũ bảo hộ */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 font-semibold">
                    {t.dashboard.helmet}
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {equipped.helmet?.name || t.dashboard.noHelmet}
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                    {equipped.helmet
                      ? `-${Math.round((equipped.helmet.defense || 0) * 100)}% Def`
                      : t.dashboard.visitBlacksmith}
                  </p>
                </div>
              </div>

              {/* Slot 3: Áo giáp */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 font-semibold">
                    {t.dashboard.armor}
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {equipped.armor?.name || t.dashboard.noArmor}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {equipped.armor
                      ? `-${Math.round((equipped.armor.defense || 0) * 100)}% Def`
                      : t.dashboard.visitBlacksmith}
                  </p>
                </div>
              </div>

              {/* Slot 4: Khiên chắn */}
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 font-semibold">
                    {t.dashboard.shield}
                  </p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {equipped.shield?.name || t.dashboard.noShield}
                  </p>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-mono mt-0.5">
                    {equipped.shield
                      ? `-${Math.round((equipped.shield.defense || 0) * 100)}% Block`
                      : t.dashboard.visitBlacksmith}
                  </p>
                </div>
              </div>
            </div>

            {/* Gợi ý mua sắm */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <Hammer className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">{t.dashboard.upgradeGearTipPrefix}</span>{" "}
                <span>{t.dashboard.upgradeGearTip}</span>
              </div>
            </div>
          </div>

          {/* 4. LỊCH SỬ LÀM BÀI & LUYỆN TẬP */}
          <div className="apple-glass rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 apple-headline">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <span>{isEn ? "Practice History" : "Lịch Sử Luyện Tập"}</span>
                </h3>
              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-black/[0.03] dark:bg-white/[0.04] px-3 py-1 rounded-full border border-black/[0.05] dark:border-white/[0.06]">
                {studentQuizHistory.length} {isEn ? "sessions" : "lượt"}
              </span>
            </div>

            {studentQuizHistory.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-mono">
                {isEn ? "No quiz history yet. Start a battle hunt to begin!" : "Chưa có lịch sử làm bài. Hãy bước vào bãi săn quái để bắt đầu luyện tập!"}
              </div>
            ) : (
              <div className="space-y-2.5">
                {studentQuizHistory.map((item) => (
                  <div
                    key={item.sessionId}
                    className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] hover:border-black/[0.08] dark:hover:border-white/[0.12] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-md">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full ${
                            item.kind === "solo"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {item.kind === "solo" ? (isEn ? "Solo" : "Tự Luyện") : (isEn ? "Arena" : "Đấu Trường")}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(item.playedAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
                        <span className="text-slate-600 dark:text-slate-400">
                          {item.totalQuestions} câu
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ {item.correctAnswers}
                        </span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          ✗ {item.totalQuestions - item.correctAnswers}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Swords className="w-3.5 h-3.5" />
                          <span>{item.monstersKilled}</span>
                        </span>
                        <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>+{item.gold}</span>
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{item.score} pts</span>
                        </span>
                      </div>

                      <div className="w-full max-w-md bg-slate-200 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden flex mt-1.5">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${item.accuracyPct}%` }}
                        />
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${100 - item.accuracyPct}%` }}
                        />
                      </div>
                    </div>

                    <Link
                      href={`/world/${item.sessionId}`}
                      className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors shrink-0 text-center border border-black/[0.05] dark:border-white/[0.08] apple-press"
                    >
                      {isEn ? "Practice Again" : "Luyện Tập Tiếp"} ➔
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. BẠN CÙNG LỚP & TRƯỜNG */}
          <div className="apple-glass rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 apple-headline">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{isEn ? "Classmates" : "Bạn Cùng Lớp"}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentClass
                    ? (isEn ? `Class ${currentClass} (${currentSchool})` : `Lớp ${currentClass} - ${currentSchool}`)
                    : (isEn ? "Join a class to study with friends." : "Gia nhập lớp học để cùng ôn tập với bạn bè.")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSettingsInitialTab("school");
                  setIsSettingsModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 text-xs font-mono font-bold transition-colors border border-black/[0.05] dark:border-white/[0.08] cursor-pointer self-start sm:self-auto flex items-center gap-1.5 apple-press-sm"
              >
                <Settings className="w-3.5 h-3.5 text-blue-500" />
                <span>{isEn ? "Settings" : "Cài Đặt Lớp"}</span>
              </button>
            </div>

            {classmates.length === 0 ? (
              <div className="p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] text-center space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isEn
                    ? "You haven't set your class yet. Configure your school and class to find your classmates!"
                    : "Bạn chưa chọn lớp học. Hãy bấm nút bên dưới để chọn trường và lớp nhằm kết nối với các bạn!"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsInitialTab("school");
                    setIsSettingsModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs apple-press"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{isEn ? "Configure My Class" : "Cài Đặt Lớp Học Của Tôi"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {classmates.map((mate) => (
                  <div
                    key={mate.id}
                    className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-300 shrink-0">
                      {mate.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {mate.displayName}
                        </span>
                        {mate.displayName === currentDisplayName && (
                          <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.2 rounded-full border border-amber-500/20">
                            {isEn ? "You" : "Bạn"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {mate.className || currentClass || (isEn ? "Student" : "Học sinh")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CÀI ĐẶT CÁ NHÂN */}
      <UserSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        initialTab={settingsInitialTab}
        currentSchoolName={currentSchool}
        currentClassName={currentClass}
        onProfileUpdated={({ displayName: newName, schoolName: newS, className: newC }) => {
          if (newName) setCurrentDisplayName(newName);
          if (newS !== undefined) setCurrentSchool(newS);
          if (newC !== undefined) setCurrentClass(newC);
        }}
      />
    </main>
  );
}
