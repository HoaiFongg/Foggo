import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Compass,
  Plus,
  Trophy,
  Swords,
  BookOpen,
  Crown,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Settings,
  Sparkles,
  Shield,
  Hammer,
  ShoppingBag,
} from "lucide-react";
import { getOptionalUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NavigationHeader } from "@/components/NavigationHeader";
import { startHomeFarmSession } from "@/app/teacher/worlds/actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, profile } = await getOptionalUser();

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !user) {
    redirect("/login");
  }

  const role = profile?.role || "student";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isTeacherOrAdmin = isAdmin || isTeacher;
  const displayName =
    profile?.display_name || user?.user_metadata?.display_name || "Nhà Thám Hiểm";

  const supabase = await createClient();

  // Tải tóm tắt hầm ngục gần nhất
  let recentWorlds: any[] = [];
  if (user && isTeacherOrAdmin) {
    const { data: worlds } = await supabase
      .from("game_sessions")
      .select("id, title, status, mode, created_at, session_players(count)")
      .eq("host_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);
    recentWorlds = worlds || [];
  }

  // Tải tóm tắt bộ câu hỏi gần nhất
  let recentSets: any[] = [];
  if (user && isTeacherOrAdmin) {
    const { data: sets } = await supabase
      .from("question_sets")
      .select("id, title, subject, play_count, questions(count)")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3);
    recentSets = sets || [];
  }

  // Dành riêng cho học sinh: Tìm xem có hầm ngục lớp nào đang mở không, và tìm phiên farm quái gần nhất
  let openClassWorld: any = null;
  let mySoloFarmSession: any = null;
  let myRecentPlayedWorlds: any[] = [];

  if (user && !isTeacherOrAdmin) {
    const { data: playerSessions } = await supabase
      .from("session_players")
      .select("*, game_sessions(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (playerSessions && playerSessions.length > 0) {
      myRecentPlayedWorlds = playerSessions.slice(0, 4);

      const classOpen = playerSessions.find(
        (p) =>
          p.game_sessions &&
          p.game_sessions.status === "open" &&
          p.game_sessions.kind !== "solo"
      );
      if (classOpen) {
        openClassWorld = classOpen.game_sessions;
      }

      const soloOpen = playerSessions.find(
        (p) =>
          p.game_sessions &&
          p.game_sessions.status === "open" &&
          p.game_sessions.kind === "solo"
      );
      if (soloOpen) {
        mySoloFarmSession = soloOpen;
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="dashboard" />

      {/* Main Container - Dàn trải đều, không co cụm */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
        {/* Header tóm tắt ngắn gọn, nhẹ nhàng */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Xin chào, {displayName}
              </h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                  Quản trị viên
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isAdmin
                ? "Quản trị toàn bộ hầm ngục sinh tồn, bộ câu hỏi và người dùng hệ thống."
                : isTeacher
                ? "Khởi tạo hầm ngục sinh tồn và quản lý câu hỏi cho lớp học."
                : "Tham gia các thế giới sinh tồn và ôn luyện kiến thức qua thử thách."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isTeacherOrAdmin && (
              <>
                <Link
                  href="/teacher/worlds/new"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Mở hầm ngục</span>
                </Link>

                <Link
                  href="/dashboard/sets/new"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Tạo bộ câu hỏi</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Trang quản trị</span>
              </Link>
            )}
          </div>
        </div>

        {/* 4 Thẻ Chức Năng Chính - Trải rộng 4 cột thoáng đãng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Hầm Ngục */}
          <Link
            href={isTeacherOrAdmin ? "/teacher/worlds/new" : "/worlds"}
            className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Swords className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                Hầm ngục sinh tồn
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mở phòng chơi, quái vật bóng tối và đợt tấn công đêm cho lớp.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-amber-400">
              <span>{isTeacherOrAdmin ? "Khởi tạo phòng" : "Vào đảo chơi"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Bộ Câu Hỏi */}
          <Link
            href={isTeacherOrAdmin ? "/dashboard/sets" : "/explore"}
            className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                Bộ câu hỏi
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Soạn ngân hàng 8 dạng câu hỏi: trắc nghiệm, kéo thả, ghép cặp.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>Quản lý kho đề</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Khám Phá */}
          <Link
            href="/explore"
            className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                Khám phá cộng đồng
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hàng ngàn đề thi mẫu từ giáo viên toàn quốc, nhân bản 1-chạm.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Xem thư viện</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Quản Trị / Thế Giới Đang Chạy */}
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
                  Quản trị hệ thống
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Phân quyền tài khoản, duyệt trường học và giám sát số liệu.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-rose-400">
                <span>Cổng quản trị Admin</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <Link
              href="/worlds"
              className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  Thế giới của bạn
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Xem lại tiến trình nhân vật, điểm số và hầm ngục đã tham gia.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-purple-400">
                <span>Xem danh sách</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}
        </div>

        {/* 2 Cột Danh Sách Nhanh - Dàn đều 2 bên */}
        {isTeacherOrAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cột Trái: Hầm ngục gần đây */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Swords className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hầm ngục của bạn</span>
                </h3>
                <Link
                  href="/worlds"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {recentWorlds.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Chưa có phòng nào. Bấm &quot;Mở hầm ngục&quot; để tạo phòng đầu tiên.
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
                            {w.mode === "survival" ? "Sinh tồn" : "Tự do"} · {playerCount} người chơi
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
                            {w.status === "open" ? "Mở" : "Đóng"}
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
                  <span>Bộ câu hỏi của bạn</span>
                </h3>
                <Link
                  href="/dashboard/sets"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {recentSets.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Chưa có bộ đề nào. Bấm &quot;Tạo bộ câu hỏi&quot; để bắt đầu soạn bài.
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
                            {s.subject || "Tổng hợp"} · {qCount} câu hỏi · {s.play_count} lượt chơi
                          </p>
                        </div>

                        <Link
                          href={`/dashboard/sets/${s.id}/edit`}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
                        >
                          Chỉnh sửa
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        {/* GIAO DIỆN HỌC SINH: CHẾ ĐỘ HẦM NGỤC LỚP VS FARM QUÁI TẠI NHÀ */}
        {!isTeacherOrAdmin && (
          <div className="space-y-6">
            {/* Banner Thông Báo Trạng Thái: Hầm Ngục Lớp vs Farm Quái Tại Nhà */}
            {openClassWorld ? (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-slate-900 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                      Hầm Ngục Lớp Học Đang Mở
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Trận chiến trên lớp: {openClassWorld.title}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Giáo viên đã mở hầm ngục lớp với tỉ lệ rơi báu vật và trang bị hiếm. Hãy tham gia ngay để cùng các bạn hợp lực đẩy lùi quái vật bóng tối!
                  </p>
                </div>

                <Link
                  href={`/world/${openClassWorld.id}`}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0"
                >
                  <Swords className="w-4 h-4" />
                  <span>Vào Hầm Ngục Lớp Ngay</span>
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      Chế Độ Luyện Tập Tại Nhà
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    Bãi Farm Quái Sinh Tồn · Cày Xu Mua Trang Bị
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Giáo viên chưa mở hầm ngục trên lớp? Hệ thống tự động đưa bạn vào bãi luyện solo để đánh quái, tích lũy Vàng &amp; Đom Đóm, ghé Thợ Rèn Bác Búa và Tiệm Cô Túi mua vũ khí chuẩn bị cho trận chiến lớp học.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cày xu khi hạ quái</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5 text-blue-400" />
                      <span>Mua đồ tại Thợ Rèn</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Lưu đồ mang vào lớp</span>
                    </span>
                  </div>
                </div>

                <form action={startHomeFarmSession}>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Swords className="w-4 h-4" />
                    <span>{mySoloFarmSession ? "Tiếp Tục Farm Quái Tại Nhà" : "Vào Bãi Farm Quái Ngay"}</span>
                  </button>
                </form>
              </div>
            )}

            {/* 2 Cột Trải Đều: Hầm ngục đã chơi & Tiệm đồ / Thợ rèn */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cột 1: Lịch sử các đảo đã chơi */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    <span>Đảo sinh tồn bạn đã tham gia</span>
                  </h3>
                  <Link
                    href="/worlds"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>Xem tất cả</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>

                {myRecentPlayedWorlds.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Bạn chưa tham gia thế giới nào. Bấm &quot;Vào Bãi Farm Quái Ngay&quot; để bắt đầu chuyến phiêu lưu đầu tiên!
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
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-semibold text-white truncate">{s.title}</p>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                  isSolo
                                    ? "bg-slate-800 text-slate-400"
                                    : "bg-amber-500/10 text-amber-400"
                                }`}
                              >
                                {isSolo ? "Solo Farm" : "Lớp học"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {p.gold ?? 0} Vàng · {p.score ?? 0} Điểm · {p.hp ?? 100} HP
                            </p>
                          </div>

                          <Link
                            href={`/world/${s.id}`}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
                          >
                            Vào chơi
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Cột 2: Cẩm nang Thợ Rèn & Chuẩn Bị Trang Bị */}
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Hammer className="w-3.5 h-3.5 text-blue-400" />
                    <span>Thợ Rèn &amp; Tiệm Đồ Sinh Tồn</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Sẵn sàng chiến đấu
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs font-bold text-amber-400 mb-1">🔨 Thợ Rèn Bác Búa</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Đổi Vàng kiếm được để rèn Kiếm Gỗ (Atk 25), Kiếm Sắt (Atk 50) và Giáp Sắt giảm 40% sát thương.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs font-bold text-purple-400 mb-1">🎒 Tiệm Cô Túi</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Mua Thuốc Hồi Máu, Bánh Mì dự trữ và Đèn Lồng xua tan sương mù để tăng cơ hội sống sót về đêm.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="text-base">💡</span>
                  <div className="text-[11px] leading-relaxed">
                    <strong>Mẹo sinh tồn:</strong> Trả lời đúng liên tiếp tạo <em>Streak x3 sát thương</em> giúp hạ quái nhanh gấp 3 lần và tiết kiệm độ bền vũ khí!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
