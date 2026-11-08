"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Copy,
  Check,
  RefreshCw,
  Pause,
  Play,
  XCircle,
  Users,
  Trophy,
  Compass,
  Lock,
  Unlock,
  ArrowLeft,
  Share2,
} from "lucide-react";
import {
  pauseWorld,
  resumeWorld,
  closeWorld,
  regenerateJoinToken,
  toggleBanPlayer,
} from "../actions";

interface TeacherWorldClientProps {
  session: {
    id: string;
    title: string;
    mode: string;
    status: string;
    join_token: string;
    allow_guests: boolean;
  };
  players: Array<{
    id: string;
    nickname: string;
    score: number;
    gold: number;
    banned: boolean;
    state: any;
    joined_at: string;
  }>;
}

export function TeacherWorldClient({
  session: initialSession,
  players: initialPlayers,
}: TeacherWorldClientProps) {
  const [session, setSession] = useState(initialSession);
  const [players, setPlayers] = useState(initialPlayers);
  const [copied, setCopied] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const joinUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/j/${session.join_token}`
      : `/j/${session.join_token}`;

  function handleCopy() {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleToggleStatus() {
    setLoadingAction(true);
    if (session.status === "open") {
      await pauseWorld(session.id);
      setSession({ ...session, status: "paused" });
    } else if (session.status === "paused") {
      await resumeWorld(session.id);
      setSession({ ...session, status: "open" });
    }
    setLoadingAction(false);
  }

  async function handleCloseWorld() {
    if (!confirm("Bạn có chắc chắn muốn đóng thế giới này không? Học sinh sẽ không thể tiếp tục chơi.")) {
      return;
    }
    setLoadingAction(true);
    await closeWorld(session.id);
    setSession({ ...session, status: "closed" });
    setLoadingAction(false);
  }

  async function handleRegenerateToken() {
    if (!confirm("Đổi link mới sẽ khiến link cũ không thể sử dụng được nữa. Tiếp tục?")) {
      return;
    }
    setLoadingAction(true);
    const res = await regenerateJoinToken(session.id);
    if (res?.newToken) {
      setSession({ ...session, join_token: res.newToken });
    }
    setLoadingAction(false);
  }

  async function handleToggleBan(player: (typeof players)[0]) {
    const nextBanned = !player.banned;
    await toggleBanPlayer(player.id, session.id, nextBanned);
    setPlayers(
      players.map((p) => (p.id === player.id ? { ...p, banned: nextBanned } : p))
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white font-mono">{session.title}</h1>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                  session.status === "open"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : session.status === "paused"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {session.status === "open"
                  ? "Đang mở"
                  : session.status === "paused"
                  ? "Tạm dừng"
                  : "Đã đóng"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Bảng điều khiển Giáo viên</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/world/${session.id}`}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Vào xem Đảo</span>
          </Link>

          {session.status !== "closed" && (
            <>
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={loadingAction}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {session.status === "open" ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tạm dừng</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mở lại</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCloseWorld}
                disabled={loadingAction}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Đóng thế giới</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hộp chia sẻ Link tham gia (Không cần mã PIN) */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Share2 className="w-4 h-4" />
                <span>Link Tham Gia Thế Giới (Không cần mã PIN)</span>
              </div>
              <p className="text-xs text-slate-400">
                Học sinh quét mã QR hoặc bấm link này để vào chơi ngay.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Đã sao chép Link!" : "Sao chép Link"}</span>
              </button>

              <button
                type="button"
                onClick={handleRegenerateToken}
                title="Đổi sang link mới (thu hồi link cũ khi cần bảo mật)"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 break-all select-all flex items-center justify-between">
            <span>{joinUrl}</span>
          </div>
        </div>

        {/* Danh sách học sinh tham gia */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white font-mono">
                DANH SÁCH HỌC SINH ({players.length} người)
              </h2>
            </div>
          </div>

          {players.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Chưa có học sinh nào tham gia thế giới này. Hãy gửi link cho lớp!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3 pl-2">#</th>
                    <th className="pb-3">Học sinh</th>
                    <th className="pb-3">Máu HP</th>
                    <th className="pb-3">Tiền Xu</th>
                    <th className="pb-3">Điểm số</th>
                    <th className="pb-3 text-right pr-2">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {players.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 pl-2 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        <span>{p.nickname}</span>
                        {p.banned && (
                          <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            Đã khóa
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono text-slate-300">
                        {p.state?.hp ?? 100} / {p.state?.maxHp ?? 100}
                      </td>
                      <td className="py-3 font-mono text-amber-400 font-semibold">
                        {p.gold} Xu
                      </td>
                      <td className="py-3 font-mono text-emerald-400 font-bold">
                        {p.score} đ
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          type="button"
                          onClick={() => handleToggleBan(p)}
                          className={`p-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                            p.banned
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          }`}
                          title={p.banned ? "Mở khóa học sinh" : "Khóa học sinh"}
                        >
                          {p.banned ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>{p.banned ? "Mở khóa" : "Khóa"}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

