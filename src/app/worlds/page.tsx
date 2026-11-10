import Link from "next/link";
import { Compass, Flame, Play, Plus, Settings, Crown, ShieldAlert, Swords, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOptionalUser } from "@/lib/auth";
import { NavigationHeader } from "@/components/NavigationHeader";
import { startHomeFarmSession } from "@/app/teacher/worlds/actions";

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
    if (isTeacherOrAdmin) {
      const { data: hosted } = await supabase
        .from("game_sessions")
        .select("*, session_players(count), question_sets(title)")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });

      myManagedWorlds = hosted || [];
    }

    if (isAdmin) {
      const { data: allSessions } = await supabase
        .from("game_sessions")
        .select("*, session_players(count), question_sets(title), profiles:host_id(display_name)")
        .neq("host_id", user.id)
        .order("created_at", { ascending: false });

      allSystemWorlds = allSessions || [];
    }

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="worlds" />

      {/* Main Container - Dàn trải đều toàn màn hình */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Hầm ngục sinh tồn
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isTeacherOrAdmin
                ? "Quản lý các phòng chơi, kiểm soát sương mù và giám sát tiến trình học sinh."
                : "Tham gia các hầm ngục lớp học hoặc tiếp tục chuyến thám hiểm săn quái của bạn."}
            </p>
          </div>

          {isTeacherOrAdmin ? (
            <Link
              href="/teacher/worlds/new"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Mở hầm ngục mới</span>
            </Link>
          ) : (
            <form action={startHomeFarmSession}>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Vào bãi farm quái tại nhà</span>
              </button>
            </form>
          )}
        </div>

        {/* Section 1: Hầm ngục do bạn quản lý */}
        {isTeacherOrAdmin && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Hầm ngục của bạn ({myManagedWorlds.length})
            </h2>

            {myManagedWorlds.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-sm mx-auto my-6">
                <Flame className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-white mb-1">Chưa có hầm ngục nào</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Bấm nút bên dưới để chọn bộ đề và mở phòng cho học sinh vào chơi.
                </p>
                <Link
                  href="/teacher/worlds/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mở phòng</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myManagedWorlds.map((w) => {
                  const playerCount = w.session_players?.[0]?.count ?? 0;
                  const setName = w.question_sets?.title || "Tổng hợp";

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
                            {w.status === "open" ? "Đang mở" : "Đã đóng"}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {w.mode === "survival" ? "Sinh tồn" : "Tự do"}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {w.title}
                        </h3>

                        <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                          Đề: <span className="text-slate-300">{setName}</span>
                        </p>

                        <div className="text-[11px] font-mono text-slate-400 mb-4">
                          <span>{playerCount} người chơi</span>
                          <span> · Mã: </span>
                          <span className="text-amber-400 font-bold">{w.join_token || "—"}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                        <Link
                          href={`/teacher/worlds/${w.id}`}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Điều khiển</span>
                        </Link>

                        <Link
                          href={`/world/${w.id}`}
                          title="Chơi thử"
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
              <span>Hầm ngục của giáo viên khác ({allSystemWorlds.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allSystemWorlds.map((w) => {
                const playerCount = w.session_players?.[0]?.count ?? 0;
                const hostName = w.profiles?.display_name || "Giáo viên";

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
                      <p className="text-xs text-slate-400 font-mono mb-4">{playerCount} học sinh</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <Link
                        href={`/teacher/worlds/${w.id}`}
                        className="w-full py-1.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-rose-500/20"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Quản trị phòng</span>
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
            Đảo bạn đang chơi ({joinedWorlds.length})
          </h2>

          {joinedWorlds.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto my-6 space-y-3">
              <Compass className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Chưa có hầm ngục nào được mở</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Giáo viên chưa mở hầm ngục lớp? Bạn có thể vào ngay <strong>Bãi Farm Quái Sinh Tồn Tại Nhà</strong> để cày Vàng, tích lũy Đom Đóm và ghé Thợ Rèn mua trang bị chuẩn bị cho trận chiến lớp học!
              </p>
              {!isTeacherOrAdmin && (
                <form action={startHomeFarmSession} className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Vào bãi farm quái tại nhà ngay</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {joinedWorlds.map((w) => {
                const session = w.session;
                if (!session) return null;

                return (
                  <div
                    key={w.playerId}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          {session.status === "open" ? "Mở" : "Đóng"}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {w.hp} HP · {w.gold} xu
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{session.title}</h3>
                      <p className="text-xs font-mono text-emerald-400 mb-4">{w.score} điểm</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800">
                      <Link
                        href={`/world/${session.id}`}
                        className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Vào chơi</span>
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
