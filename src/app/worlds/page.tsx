import Link from "next/link";
import { Compass, Flame, Play, Trophy, Users, PlusCircle, Settings, Crown, ExternalLink, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOptionalUser } from "@/lib/auth";
import { NavigationHeader } from "@/components/NavigationHeader";

export const dynamic = "force-dynamic";

export default async function WorldsPage() {
  const { user, profile } = await getOptionalUser();
  const supabase = await createClient();

  const role = profile?.role || "student";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isTeacherOrAdmin = isAdmin || isTeacher;

  let myManagedWorlds: any[] = [];
  let allSystemWorlds: any[] = [];
  let joinedWorlds: any[] = [];

  if (user) {
    // 1. Nếu là Teacher hoặc Admin: Lấy danh sách thế giới do chính mình tạo
    if (isTeacherOrAdmin) {
      const { data: hosted } = await supabase
        .from("game_sessions")
        .select("*, session_players(count), question_sets(title)")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });

      myManagedWorlds = hosted || [];
    }

    // 2. Nếu là Admin: Lấy danh sách toàn bộ các phòng trên hệ thống
    if (isAdmin) {
      const { data: allSessions } = await supabase
        .from("game_sessions")
        .select("*, session_players(count), question_sets(title), profiles:host_id(display_name)")
        .neq("host_id", user.id)
        .order("created_at", { ascending: false });

      allSystemWorlds = allSessions || [];
    }

    // 3. Lấy các thế giới mà user này đã tham gia với tư cách người chơi
    const { data: players } = await supabase
      .from("session_players")
      .select("*, game_sessions(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    joinedWorlds = (players || []).map((p) => ({
      playerId: p.id,
      score: p.score,
      gold: p.gold,
      hp: p.state?.hp ?? 100,
      session: p.game_sessions,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      <NavigationHeader profile={profile} activeItem="worlds" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white font-sans flex items-center gap-2.5">
                <Compass className="w-6 h-6 text-amber-400" />
                <span>Hầm Ngục & Thế Giới Sinh Tồn</span>
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[10px] font-bold">
                  Quyền Quản Trị
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý các phòng chơi thế giới, điều khiển sương mù và giám sát lớp học
            </p>
          </div>

          {isTeacherOrAdmin && (
            <Link
              href="/teacher/worlds/new"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mở Hầm Ngục Mới</span>
            </Link>
          )}
        </div>

        {/* Section 1: Hầm Ngục Do Bạn Quản Lý (Giáo viên / Admin) */}
        {isTeacherOrAdmin && (
          <div className="mb-12">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>Hầm ngục do bạn khởi tạo</span>
              <span className="text-xs font-mono text-amber-400">({myManagedWorlds.length})</span>
            </h2>

            {myManagedWorlds.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center max-w-md mx-auto my-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-3">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Chưa mở hầm ngục nào</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Bấm nút bên dưới để chọn một bộ câu hỏi và khởi tạo thế giới cho học sinh vào chơi!
                </p>
                <Link
                  href="/teacher/worlds/new"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Khởi tạo hầm ngục đầu tiên</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myManagedWorlds.map((w) => {
                  const playerCount = w.session_players?.[0]?.count ?? 0;
                  const setName = w.question_sets?.title || "Không chọn bộ đề";

                  return (
                    <div
                      key={w.id}
                      className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                              w.status === "open"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : w.status === "paused"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {w.status === "open"
                              ? "Đang Mở"
                              : w.status === "paused"
                              ? "Tạm Dừng"
                              : "Đã Đóng"}
                          </span>

                          <span className="text-xs font-mono text-slate-400">
                            {w.mode === "survival" ? "Sinh tồn" : "Tự do"}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                          {w.title}
                        </h3>

                        <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                          Bộ đề: <strong className="text-slate-300">{setName}</strong>
                        </p>

                        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-4">
                          <span>{playerCount} người chơi</span>
                          <span>·</span>
                          <span>Mã Token: <code className="text-amber-400 font-bold">{w.join_token || "Không có"}</code></span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
                        <Link
                          href={`/teacher/worlds/${w.id}`}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Bảng Điều Khiển</span>
                        </Link>

                        <Link
                          href={`/world/${w.id}`}
                          title="Chơi thử giao diện học sinh"
                          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center transition-colors"
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

        {/* Section 2: Toàn Bộ Hầm Ngục Hệ Thống (Dành Riêng Cho Admin) */}
        {isAdmin && allSystemWorlds.length > 0 && (
          <div className="mb-12 pt-8 border-t border-slate-800">
            <h2 className="text-sm font-bold text-rose-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Tất cả hầm ngục của giáo viên khác (Quyền Quản Trị Tối Cao)</span>
              <span className="text-xs font-mono text-rose-400">({allSystemWorlds.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allSystemWorlds.map((w) => {
                const playerCount = w.session_players?.[0]?.count ?? 0;
                const hostName = w.profiles?.display_name || "Giáo viên";

                return (
                  <div
                    key={w.id}
                    className="bg-slate-900/40 border border-slate-800/80 hover:border-rose-500/30 rounded-3xl p-6 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-rose-300">
                          Chủ phòng: {hostName}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {w.status}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2">{w.title}</h3>

                      <div className="text-xs font-mono text-slate-400 mb-4">
                        <span>{playerCount} học sinh đang kết nối</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <Link
                        href={`/teacher/worlds/${w.id}`}
                        className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-500/30"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Quản Trị Phòng Này</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 3: Thế Giới Đã Tham Gia (Chơi dưới dạng Nhân Vật / Học Sinh) */}
        <div>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span>Hòn đảo sinh tồn bạn đang chơi</span>
            <span className="text-xs font-mono text-emerald-400">({joinedWorlds.length})</span>
          </h2>

          {joinedWorlds.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center max-w-md mx-auto my-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Chưa tham gia thế giới nào</h3>
              <p className="text-xs text-slate-400">
                Hãy mở một hầm ngục mới hoặc nhập mã liên kết từ giáo viên để vào đảo sinh tồn!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {joinedWorlds.map((w) => {
                const session = w.session;
                if (!session) return null;

                return (
                  <div
                    key={w.playerId}
                    className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {session.status === "open" ? "Đang mở" : "Đã đóng"}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {session.mode === "survival" ? "Sinh tồn" : "Tự do"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2">{session.title}</h3>

                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-4">
                        <span>Máu: <strong className="text-rose-400">{w.hp} HP</strong></span>
                        <span>·</span>
                        <span>Xu: <strong className="text-amber-400">{w.gold}</strong></span>
                        <span>·</span>
                        <span>Điểm: <strong className="text-emerald-400">{w.score}</strong></span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <Link
                        href={`/world/${session.id}`}
                        className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>Tiếp tục cuộc hành trình trên Đảo</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
