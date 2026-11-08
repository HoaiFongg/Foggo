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
} from "lucide-react";
import { getOptionalUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NavigationHeader } from "@/components/NavigationHeader";

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
        )}
      </main>
    </div>
  );
}
