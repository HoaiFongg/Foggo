"use client";

import Link from "next/link";
import { Compass, Flame, Play, Plus, Settings, Crown, ShieldAlert, Swords, Sparkles } from "lucide-react";
import { startHomeFarmSession } from "@/app/teacher/worlds/actions";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { localizeQuestionSet } from "@/lib/i18n/questions-translation";

interface WorldsClientProps {
  myManagedWorlds: any[];
  allSystemWorlds: any[];
  joinedWorlds: any[];
  isAdmin: boolean;
  isTeacherOrAdmin: boolean;
}

export function WorldsClient({
  myManagedWorlds,
  allSystemWorlds,
  joinedWorlds,
  isAdmin,
  isTeacherOrAdmin,
}: WorldsClientProps) {
  const { t, language, isEn } = useLanguage();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.worlds.title}
            </h1>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {isTeacherOrAdmin
              ? (isEn ? "Manage game worlds, control fog of war, and monitor student progress in real-time." : "Quản lý các phòng chơi, kiểm soát sương mù và giám sát tiến trình học sinh.")
              : t.worlds.subtitle}
          </p>
        </div>

        {isTeacherOrAdmin ? (
          <Link
            href="/teacher/worlds/new"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.worlds.createNew}</span>
          </Link>
        ) : (
          <form action={startHomeFarmSession}>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-mono"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>{t.dashboard.soloFarmBtn}</span>
            </button>
          </form>
        )}
      </div>

      {/* Section 1: Hầm ngục do bạn quản lý */}
      {isTeacherOrAdmin && (
        <div className="mb-10">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            {isEn ? `Your Dungeons (${myManagedWorlds.length})` : `Hầm ngục của bạn (${myManagedWorlds.length})`}
          </h2>

          {myManagedWorlds.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-sm mx-auto my-6">
              <Flame className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">{isEn ? "No worlds created yet" : "Chưa có hầm ngục nào"}</h3>
              <p className="text-xs text-slate-400 mb-4">
                {isEn ? "Click below to select a question set and open a world for your class." : "Bấm nút bên dưới để chọn bộ đề và mở phòng cho học sinh vào chơi."}
              </p>
              <Link
                href="/teacher/worlds/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.worlds.createNew}</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myManagedWorlds.map((w) => {
                const playerCount = w.session_players?.[0]?.count ?? 0;
                const rawSet = w.question_sets || { title: "Tổng hợp" };
                const localizedSet = localizeQuestionSet(rawSet, language);

                return (
                  <div
                    key={w.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${w.status === "open"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-400"
                            }`}
                        >
                          {w.status === "open" ? t.worlds.open : t.worlds.closed}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {w.mode === "survival" ? (isEn ? "Survival" : "Sinh tồn") : (isEn ? "Free" : "Tự do")}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                        {w.title}
                      </h3>

                      <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                        {t.worlds.questionSet}: <span className="text-slate-300">{localizedSet.title}</span>
                      </p>

                      <div className="text-[11px] font-mono text-slate-400 mb-4">
                        <span>{playerCount} {t.worlds.players}</span>
                        <span> · {isEn ? "PIN: " : "Mã: "}</span>
                        <span className="text-amber-400 font-bold">{w.join_token || "—"}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                      <Link
                        href={`/teacher/worlds/${w.id}`}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors font-mono"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>{isEn ? "Control" : "Điều khiển"}</span>
                      </Link>

                      <Link
                        href={`/world/${w.id}`}
                        title={isEn ? "Play Test" : "Chơi thử"}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Section 2: Hầm ngục hệ thống (Chỉ Admin) */}
      {isAdmin && allSystemWorlds.length > 0 && (
        <div className="mb-10 pt-8 border-t border-slate-800/80">
          <h2 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            <span>{isEn ? `Other Teachers' Worlds (${allSystemWorlds.length})` : `Hầm ngục của giáo viên khác (${allSystemWorlds.length})`}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allSystemWorlds.map((w) => {
              const playerCount = w.session_players?.[0]?.count ?? 0;
              const hostName = w.profiles?.display_name || (isEn ? "Teacher" : "Giáo viên");

              return (
                <div
                  key={w.id}
                  className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-rose-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300 truncate max-w-[120px]">
                        {hostName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {w.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{w.title}</h3>
                    <p className="text-xs text-slate-400 font-mono mb-4">{playerCount} {t.worlds.players}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <Link
                      href={`/teacher/worlds/${w.id}`}
                      className="w-full py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-500/20 font-mono"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{isEn ? "Administer World" : "Quản trị phòng"}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 3: Thế giới đã tham gia */}
      <div>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
          {isEn ? `Worlds You Joined (${joinedWorlds.length})` : `Đảo bạn đang chơi (${joinedWorlds.length})`}
        </h2>

        {joinedWorlds.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto my-6 space-y-3">
            <Compass className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">{isEn ? "No open worlds joined yet" : "Chưa có hầm ngục nào được mở"}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn
                ? "Ask your teacher for the QR or world link, or start training solo right now in the 24/7 personal dungeon."
                : "Hãy hỏi thầy cô link/QR hầm ngục của lớp, hoặc tự luyện tập sinh tồn ngay ở hầm ngục solo cá nhân mở 24/7."}
            </p>
            <div className="pt-2">
              <form action={startHomeFarmSession}>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 mx-auto transition-all shadow-md cursor-pointer font-mono"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{t.dashboard.soloFarmBtn}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {joinedWorlds.map((p) => {
              const session = p.session;
              if (!session) return null;
              const isClosed = session.status === "closed";

              return (
                <div
                  key={p.playerId}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${isClosed
                          ? "bg-slate-800 text-slate-400"
                          : "bg-emerald-500/10 text-emerald-400"
                          }`}
                      >
                        {isClosed ? t.worlds.closed : t.worlds.open}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {session.mode === "survival" ? (isEn ? "Survival" : "Sinh tồn") : (isEn ? "Free" : "Tự do")}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {session.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-center font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">HP</span>
                        <span className="text-xs font-bold text-rose-400">{p.hp}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">{t.common.coins}</span>
                        <span className="text-xs font-bold text-amber-400">{p.gold}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">{t.common.score}</span>
                        <span className="text-xs font-bold text-emerald-400">{p.score}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <Link
                      href={`/world/${session.id}`}
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm font-mono ${isClosed
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed pointer-events-none"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
                        }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isClosed ? t.worlds.closed : t.worlds.joinNow}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
