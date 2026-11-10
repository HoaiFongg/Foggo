"use client";

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
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { startHomeFarmSession } from "@/app/teacher/worlds/actions";
import { QuickJoinCard } from "@/components/QuickJoinCard";
import { DailyLoginStreakCard } from "@/components/DailyLoginStreakCard";

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
}

export function DashboardClient({
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
}: DashboardClientProps) {
  const { t, language } = useLanguage();

  return (
    <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
      {/* ============================================================== */}
      {/* GIAO DIỆN DÀNH CHO GIÁO VIÊN & ADMIN                           */}
      {/* ============================================================== */}
      {isTeacherOrAdmin ? (
        <>
          {/* Header Giáo viên / Admin */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {t.dashboard.welcome} {displayName}
                </h1>
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                    {t.dashboard.adminRole}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-semibold">
                    {t.dashboard.teacherRole}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAdmin ? t.dashboard.adminDesc : t.dashboard.teacherDesc}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/teacher/worlds/new"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.dashboard.openDungeonBtn}</span>
              </Link>

              <Link
                href="/dashboard/sets/new"
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.dashboard.createSetBtn}</span>
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{t.dashboard.adminPortalBtn}</span>
                </Link>
              )}
            </div>
          </div>

          {/* 4 Thẻ Quản Trị Giáo Viên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link
              href="/teacher/worlds/new"
              className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Swords className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {t.dashboard.survivalDungeonCard}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.dashboard.survivalDungeonCardDesc}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>{t.dashboard.initRoomBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/dashboard/sets"
              className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {t.dashboard.questionSetsCard}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.dashboard.questionSetsCardDesc}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-400">
                <span>{t.dashboard.manageSetsBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/explore"
              className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  {t.dashboard.exploreCard}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.dashboard.exploreCardDesc}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>{t.dashboard.viewExploreBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {isAdmin ? (
              <Link
                href="/admin"
                className="group p-5 rounded-2xl bg-slate-900/60 border border-rose-500/30 hover:border-rose-500/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-bold text-white mb-1 group-hover:text-rose-400 transition-colors">
                    {t.dashboard.adminCard}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t.dashboard.adminCardDesc}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-rose-400">
                  <span>{t.dashboard.adminPortalBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ) : (
              <Link
                href="/worlds"
                className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h2 className="text-sm font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {t.dashboard.yourWorlds}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t.worlds.subtitle}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-purple-400">
                  <span>{t.dashboard.viewAll}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )}
          </div>

          {/* 2 Cột Danh Sách Nhanh cho Giáo viên */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột Trái: Hầm ngục gần đây */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.dashboard.yourWorlds}</span>
                </h3>
                <Link
                  href="/worlds"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>{t.dashboard.viewAll}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {recentWorlds.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  {t.dashboard.noRecentWorlds}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentWorlds.map((w) => {
                    const playerCount = w.session_players?.[0]?.count ?? 0;
                    return (
                      <div
                        key={w.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{w.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {w.mode === "survival" ? t.dashboard.survival : t.dashboard.freePlay} · {playerCount} {t.dashboard.playersCount}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                              w.status === "open"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {w.status === "open" ? t.worlds.open : t.worlds.closed}
                          </span>
                          <Link
                            href={`/teacher/worlds/${w.id}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cột Phải: Bộ câu hỏi gần đây */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.dashboard.yourSets}</span>
                </h3>
                <Link
                  href="/dashboard/sets"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>{t.dashboard.viewAll}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {recentSets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  {t.dashboard.noRecentSets}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentSets.map((s) => {
                    const qCount = s.questions?.[0]?.count ?? 0;
                    return (
                      <div
                        key={s.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{s.title}</p>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {s.subject || "General"} · {qCount} {t.dashboard.questionsCount} · {s.play_count} {t.dashboard.playsCount}
                          </p>
                        </div>

                        <Link
                          href={`/dashboard/sets/${s.id}/edit`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
                        >
                          {t.dashboard.edit}
                        </Link>
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
        /* GIAO DIỆN DÀNH RIÊNG CHO HỌC SINH (HOÀN TOÀN MỚI & LOGIC)      */
        /* ============================================================== */
        <div className="space-y-8">
          {/* 1. HERO PROFILE CARD: Thông tin Học sinh, Trường, Lớp & Tài nguyên */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {displayName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-semibold">
                    {t.dashboard.explorer}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <SchoolIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{studentSchoolName || t.dashboard.noSchool}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span>{studentClassName || t.dashboard.noClass}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bảng Chỉ Số Tài Nguyên */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{currentGold}</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {t.dashboard.goldEarned}
                </p>
              </div>

              <div className="px-3 py-2 text-center border-x border-slate-800">
                <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{totalScore}</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {t.dashboard.scoreAchieved}
                </p>
              </div>

              <div className="px-3 py-2 text-center">
                <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold mb-0.5">
                  <Heart className="w-3.5 h-3.5" />
                  <span>{currentHp}/100</span>
                </div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {t.dashboard.vitality}
                </p>
              </div>
            </div>
          </div>

          {/* 2. ĐIỂM DANH 7 NGÀY NHẬN QUÀ LIÊN TIẾP */}
          <DailyLoginStreakCard initialStreakData={streakData} />

          {/* 3. HAI CHẾ ĐỘ CHƠI CHÍNH: BÃI FARM QUÁI TẠI NHÀ & HẦM NGỤC LỚP HỌC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: BÃI FARM QUÁI SINH TỒN (Chế độ tự luyện 24/7) */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {t.dashboard.soloFarmBadge}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.dashboard.soloAutoNotice}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">
                  {t.dashboard.soloFarmTitle}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {t.dashboard.soloDetailedDesc}
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-5 text-[11px] text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                    <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t.dashboard.turnBasedRpg}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>{t.dashboard.farmGoldForGear}</span>
                  </div>
                </div>
              </div>

              <form action={startHomeFarmSession} className="w-full">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Swords className="w-4 h-4" />
                  <span>
                    {mySoloFarmSession ? t.dashboard.continueSoloFarm : t.dashboard.startSoloFarm}
                  </span>
                </button>
              </form>
            </div>

            {/* Card 2: HẦM NGỤC LỚP HỌC (Chiến đấu cùng Giáo viên & Lớp) */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-950/25 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {t.dashboard.arenaBadge}
                  </span>
                  {openClassWorld && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      {t.dashboard.activeRoomLive}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-white mb-2">
                  {openClassWorld ? openClassWorld.title : t.dashboard.arenaTitle}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {openClassWorld
                    ? (language === "en"
                      ? "The teacher has opened a live survival dungeon for your class! Prepare your gear and join now."
                      : "Giáo viên đã mở phòng thi đấu sinh tồn cho lớp! Hãy nhanh chóng chuẩn bị trang bị và bấm tham gia ngay.")
                    : (language === "en"
                      ? "Join your classmates when your teacher opens a world session. Enter the PIN or link provided to enter instantly."
                      : "Tham gia cùng các bạn khi Thầy/Cô mở phòng hầm ngục. Nhập mã PIN do giáo viên cung cấp để nhảy vào phòng ngay lập tức.")}
                </p>

                {openClassWorld ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                    <p className="text-xs font-semibold text-amber-300">
                      ⚡ {language === "en" ? "Active room:" : "Phòng đang kích hoạt:"} {openClassWorld.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === "en"
                        ? "Mode: Wave Survival · Mythic character drops enabled!"
                        : "Chế độ: Sinh tồn đợt quái · Tỉ lệ rơi báu vật nhân vật cực hiếm!"}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-[11px] text-slate-400 mb-1 font-semibold">
                      {t.dashboard.enterPinPrompt}
                    </p>
                    <QuickJoinCard />
                  </div>
                )}
              </div>

              {openClassWorld && (
                <Link
                  href={`/world/${openClassWorld.id}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Flame className="w-4 h-4" />
                  <span>{t.dashboard.joinClassArena}</span>
                </Link>
              )}
            </div>
          </div>

          {/* 3. KHU VỰC TRANG BỊ & KHO ĐỒ CHIẾN ĐẤU */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80 mb-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>{t.dashboard.currentGear}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.dashboard.currentGearDesc}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  {t.dashboard.attackBonus}: <strong>+{weaponAtk}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  {t.dashboard.defenseBonus}: <strong>-{totalDefensePercent}%</strong>
                </span>
              </div>
            </div>

            {/* 4 Ô Trang Bị: Vũ khí, Mũ, Giáp, Khiên */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Slot 1: Vũ khí */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl shrink-0">
                  ⚔️
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    {t.dashboard.weapon}
                  </p>
                  <p className="text-xs font-bold text-white truncate">
                    {equipped.weapon?.name || t.dashboard.defaultWeapon}
                  </p>
                  <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                    {t.dashboard.attackBonus}: +{equipped.weapon?.atk || 25} Atk
                  </p>
                </div>
              </div>

              {/* Slot 2: Mũ bảo hộ */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shrink-0">
                  🪖
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    {t.dashboard.helmet}
                  </p>
                  <p className="text-xs font-bold text-white truncate">
                    {equipped.helmet?.name || t.dashboard.noHelmet}
                  </p>
                  <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                    {equipped.helmet
                      ? `${t.dashboard.defenseBonus}: -${Math.round((equipped.helmet.defense || 0) * 100)}%`
                      : t.dashboard.visitBlacksmith}
                  </p>
                </div>
              </div>

              {/* Slot 3: Áo giáp */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                  🛡️
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    {t.dashboard.armor}
                  </p>
                  <p className="text-xs font-bold text-white truncate">
                    {equipped.armor?.name || t.dashboard.noArmor}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    {equipped.armor
                      ? `${t.dashboard.defenseBonus}: -${Math.round((equipped.armor.defense || 0) * 100)}%`
                      : t.dashboard.visitBlacksmith}
                  </p>
                </div>
              </div>

              {/* Slot 4: Khiên chắn */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl shrink-0">
                  🛡️
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    {t.dashboard.shield}
                  </p>
                  <p className="text-xs font-bold text-white truncate">
                    {equipped.shield?.name || t.dashboard.noShield}
                  </p>
                  <p className="text-[11px] text-purple-400 font-mono mt-0.5">
                    {equipped.shield
                      ? `${t.dashboard.blockBonus}: -${Math.round((equipped.shield.defense || 0) * 100)}%`
                      : t.dashboard.visitBlacksmith}
                  </p>
                </div>
              </div>
            </div>

            {/* Gợi ý mua sắm & tăng sức mạnh */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 text-xs text-slate-300">
              <Hammer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">{t.dashboard.upgradeGearTipPrefix}</span>{" "}
                {t.dashboard.upgradeGearTip}
              </div>
            </div>
          </div>

          {/* 4. LỊCH SỬ THÁM HIỂM (ĐẢO SINH TỒN ĐÃ THAM GIA) */}
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.dashboard.historyTitle}</span>
              </h3>
              <Link
                href="/worlds"
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>{t.dashboard.viewAll}</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {myRecentPlayedWorlds.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                {t.dashboard.historyEmpty}
              </div>
            ) : (
              <div className="space-y-2.5">
                {myRecentPlayedWorlds.map((p) => {
                  const s = p.game_sessions;
                  if (!s) return null;
                  const isSolo = s.kind === "solo";
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold text-white truncate">{s.title}</p>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isSolo
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {isSolo ? t.dashboard.soloFarmTag : t.dashboard.classArenaTag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {p.gold ?? 0} {t.common.gold} · {p.score ?? 0} {t.common.score} · {p.state?.hp ?? 100} {t.common.hp}
                        </p>
                      </div>

                      <Link
                        href={`/world/${s.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
                      >
                        {t.dashboard.enterGame}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}