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

function getDungeonExpiryInfo(
  session: { status: string; ends_at?: string | null; created_at?: string | null },
  isEn: boolean
) {
  if (session.status === "closed") {
    return {
      isClosed: true,
      label: isEn ? "Closed (after 1 day)" : "Đã đóng (sau 1 ngày)",
      badgeClass: "bg-slate-800 text-slate-400 border-slate-700",
    };
  }

  const targetTime = session.ends_at
    ? new Date(session.ends_at).getTime()
    : session.created_at
    ? new Date(session.created_at).getTime() + 24 * 60 * 60 * 1000
    : null;

  if (!targetTime) {
    return {
      isClosed: false,
      label: isEn ? "Open" : "Đang mở",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    };
  }

  const remainingMs = targetTime - Date.now();
  if (remainingMs <= 0) {
    return {
      isClosed: true,
      label: isEn ? "Closed (1 day expired)" : "Đã đóng (hết 1 ngày)",
      badgeClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    };
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    isClosed: false,
    label: isEn
      ? `Open · ${hours}h ${mins}m left`
      : `Mở · Đóng sau ${hours}h ${mins}p`,
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
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
            <h1 className="text-xl sm:text-2xl font-black text-white font-pixel tracking-tight">
              {t.worlds.title}
            </h1>
            {isAdmin && (
              <span className="px-2 py-0.5 pixel-panel rounded-none border border-rose-500/50 bg-rose-500/15 text-rose-300 font-pixel text-[9px] font-semibold">
                ADMIN
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
            className="px-4 py-2.5 rounded-xl pixel-btn-amber text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm uppercase font-mono"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.worlds.createNew}</span>
          </Link>
        ) : (
          <form action={startHomeFarmSession}>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl pixel-btn-amber text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer font-mono uppercase"
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
          <h2 className="text-xs font-bold text-amber-400 font-pixel uppercase tracking-wider mb-4">
            [ {isEn ? `YOUR DUNGEONS (${myManagedWorlds.length})` : `HẦM NGỤC CỦA BẠN (${myManagedWorlds.length})`} ]
          </h2>

          {myManagedWorlds.length === 0 ? (
            <div className="p-8 rounded-2xl pixel-panel bg-slate-900/60 border-2 border-slate-800 text-center max-w-sm mx-auto my-6">
              <Flame className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1 font-mono">{isEn ? "No worlds created yet" : "Chưa có hầm ngục nào"}</h3>
              <p className="text-xs text-slate-400 mb-4">
                {isEn ? "Click below to select a question set and open a world for your class." : "Bấm nút bên dưới để chọn bộ đề và mở phòng cho học sinh vào chơi."}
              </p>
              <Link
                href="/teacher/worlds/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl pixel-btn-amber text-slate-950 font-bold text-xs font-mono uppercase"
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

                const expiryInfo = getDungeonExpiryInfo(w, isEn);

                return (
                  <div
                    key={w.id}
                    className="p-5 rounded-2xl pixel-panel bg-slate-900/80 border-2 border-slate-700/80 hover:border-amber-400/80 transition-all flex flex-col justify-between group shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-none pixel-panel ${expiryInfo.badgeClass}`}
                          title={isEn ? "Dungeons auto-close after 24 hours (1 day)" : "Hầm ngục tự động đóng sau 1 ngày (24 giờ)"}
                        >
                          {expiryInfo.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {w.mode === "survival" ? (isEn ? "Survival" : "Sinh tồn") : (isEn ? "Free" : "Tự do")}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors font-mono">
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
                        className="flex-1 py-2 px-3 rounded-xl pixel-btn-amber text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors font-mono uppercase"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>{isEn ? "Control" : "Điều khiển"}</span>
                      </Link>

                      <Link
                        href={`/world/${w.id}`}
                        title={isEn ? "Play Test" : "Chơi thử"}
                        className="p-2 rounded-xl pixel-btn-neutral text-slate-300 transition-colors"
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
        <h2 className="text-xs font-bold text-amber-400 font-pixel uppercase tracking-wider mb-4">
          [ {isEn ? `WORLDS YOU JOINED (${joinedWorlds.length})` : `ĐẢO BẠN ĐANG CHƠI (${joinedWorlds.length})`} ]
        </h2>

        {joinedWorlds.length === 0 ? (
          <div className="p-8 rounded-2xl pixel-panel bg-slate-900/60 border-2 border-slate-800 text-center max-w-md mx-auto my-6 space-y-3">
            <Compass className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-white font-mono">{isEn ? "No open worlds joined yet" : "Chưa có hầm ngục nào được mở"}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isEn
                ? "Ask your teacher for the QR or world link, or start training solo right now in the 24/7 personal dungeon."
                : "Hãy hỏi thầy cô link/QR hầm ngục của lớp, hoặc tự luyện tập sinh tồn ngay ở hầm ngục solo cá nhân mở 24/7."}
            </p>
            <div className="pt-2">
              <form action={startHomeFarmSession}>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl pixel-btn-amber text-slate-950 font-bold text-xs flex items-center gap-1.5 mx-auto transition-all shadow-md cursor-pointer font-mono uppercase"
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

              const expiryInfo = getDungeonExpiryInfo(session, isEn);

              return (
                <div
                  key={p.playerId}
                  className="p-5 rounded-2xl pixel-panel bg-slate-900/80 border-2 border-slate-700/80 hover:border-amber-400/80 transition-all flex flex-col justify-between group shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-none pixel-panel ${expiryInfo.badgeClass}`}
                        title={isEn ? "Dungeons auto-close after 24 hours (1 day)" : "Hầm ngục tự động đóng sau 1 ngày (24 giờ)"}
                      >
                        {expiryInfo.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {session.mode === "survival" ? (isEn ? "Survival" : "Sinh tồn") : (isEn ? "Free" : "Tự do")}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors font-mono">
                      {session.title}
                    </h3>

                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 text-center font-mono shadow-inner">
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
                      className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm font-mono uppercase ${isClosed
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed pointer-events-none"
                        : "pixel-btn-amber text-slate-950 cursor-pointer"
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

