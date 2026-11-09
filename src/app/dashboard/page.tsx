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
  Settings,
  Sparkles,
  Shield,
  Hammer,
  GraduationCap,
  School as SchoolIcon,
  Coins,
  Flame,
  Heart,
  Zap,
} from "lucide-react";
import { getOptionalUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NavigationHeader } from "@/components/NavigationHeader";
import { startHomeFarmSession } from "@/app/teacher/worlds/actions";
import { QuickJoinCard } from "@/components/QuickJoinCard";

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

  // Dành riêng cho Giáo viên & Admin: Tải hầm ngục và bộ đề gần nhất
  let recentWorlds: any[] = [];
  let recentSets: any[] = [];
  if (user && isTeacherOrAdmin) {
    const { data: worlds } = await supabase
      .from("game_sessions")
      .select("id, title, status, mode, created_at, session_players(count)")
      .eq("host_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);
    recentWorlds = worlds || [];

    const { data: sets } = await supabase
      .from("question_sets")
      .select("id, title, subject, play_count, questions(count)")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3);
    recentSets = sets || [];
  }

  // Dành riêng cho Học sinh: Tải Trường, Lớp, Hầm ngục đang mở, Phiên solo farm và Trang bị
  let studentSchoolName = "";
  let studentClassName = "";
  let openClassWorld: any = null;
  let mySoloFarmSession: any = null;
  let myRecentPlayedWorlds: any[] = [];
  let totalScore = 0;
  let currentGold = 0;
  let currentHp = 100;
  let equipped: any = {
    weapon: null,
    helmet: null,
    armor: null,
    shield: null,
  };

  if (user && !isTeacherOrAdmin) {
    // 1. Lấy thông tin Trường & Lớp
    if (profile?.school_id) {
      const { data: s } = await supabase
        .from("schools")
        .select("name")
        .eq("id", profile.school_id)
        .maybeSingle();
      if (s) studentSchoolName = s.name;
    }
    if (profile?.class_id) {
      const { data: c } = await supabase
        .from("classes")
        .select("name")
        .eq("id", profile.class_id)
        .maybeSingle();
      if (c) studentClassName = c.name;
    }

    // 2. Lấy danh sách các thế giới đã tham gia
    const { data: playerSessions } = await supabase
      .from("session_players")
      .select("*, game_sessions(*)")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (playerSessions && playerSessions.length > 0) {
      myRecentPlayedWorlds = playerSessions.slice(0, 5);

      // Tìm phòng lớp đang mở
      const classOpen = playerSessions.find(
        (p) =>
          p.game_sessions &&
          p.game_sessions.status === "open" &&
          p.game_sessions.kind !== "solo"
      );
      if (classOpen) {
        openClassWorld = classOpen.game_sessions;
      }

      // Tìm phiên solo farm mở gần nhất
      const soloOpen = playerSessions.find(
        (p) =>
          p.game_sessions &&
          p.game_sessions.status === "open" &&
          p.game_sessions.kind === "solo"
      );
      if (soloOpen) {
        mySoloFarmSession = soloOpen;
      }

      // Lấy trang bị và chỉ số từ phiên mới nhất
      const latestPlayer = mySoloFarmSession || playerSessions[0];
      if (latestPlayer) {
        currentGold = latestPlayer.gold ?? 0;
        totalScore = latestPlayer.score ?? 0;
        const state = latestPlayer.state || {};
        currentHp = state.hp ?? 100;
        if (state.equipped) {
          equipped = {
            weapon: state.equipped.weapon || null,
            helmet: state.equipped.helmet || null,
            armor: state.equipped.armor || null,
            shield: state.equipped.shield || null,
          };
        }
      }
    }
  }

  // Tính tổng chỉ số phòng thủ từ trang bị hiện có
  const helmetDef = equipped.helmet?.defense ?? 0;
  const armorDef = equipped.armor?.defense ?? 0;
  const shieldDef = equipped.shield?.defense ?? 0;
  const totalDefensePercent = Math.min(60, Math.round((helmetDef + armorDef + shieldDef) * 100));
  const weaponAtk = equipped.weapon?.atk ?? 25; // Kiếm Gỗ mặc định Atk 25

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="dashboard" />

      {/* Main Container */}
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
                    Xin chào, {displayName}
                  </h1>
                  {isAdmin ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                      Quản trị viên
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[10px] font-semibold">
                      Giáo viên
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {isAdmin
                    ? "Quản trị toàn bộ hầm ngục sinh tồn, bộ câu hỏi và người dùng hệ thống."
                    : "Khởi tạo hầm ngục sinh tồn và quản lý ngân hàng câu hỏi cho học sinh."}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
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
                    Hầm ngục sinh tồn
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mở phòng chơi cho lớp học, cài đặt đợt quái tấn công đêm.
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>Khởi tạo phòng</span>
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
                    Bộ câu hỏi
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Soạn ngân hàng 8 dạng câu hỏi: Đúng/Sai IC3, trắc nghiệm, kéo thả...
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>Quản lý kho đề</span>
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
                    Khám phá cộng đồng
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hàng ngàn đề thi từ giáo viên toàn quốc, nhân bản 1-chạm.
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Xem thư viện</span>
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
                      Quản trị hệ thống
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Phân quyền tài khoản, duyệt trường học và giám sát số liệu.
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-rose-400">
                    <span>Cổng Admin</span>
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
                      Thế giới của bạn
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Xem danh sách tất cả hầm ngục đã mở và kết quả thi đấu.
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-purple-400">
                    <span>Xem danh sách</span>
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
                      Nhà Thám Hiểm
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <SchoolIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{studentSchoolName || "Chưa chọn trường"}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                      <span>{studentClassName || "Chưa vào lớp"}</span>
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
                    Vàng kiếm được
                  </p>
                </div>

                <div className="px-3 py-2 text-center border-x border-slate-800">
                  <div className="flex items-center justify-center gap-1 text-yellow-300 text-xs font-bold mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{profile?.fireflies ?? 120}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Đom đóm soi sương
                  </p>
                </div>

                <div className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-bold mb-0.5">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{currentHp}/100</span>
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Sinh lực
                  </p>
                </div>
              </div>
            </div>

            {/* 2. HAI CHẾ ĐỘ CHƠI CHÍNH: BÃI FARM QUÁI TẠI NHÀ & HẦM NGỤC LỚP HỌC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: BÃI FARM QUÁI SINH TỒN (Chế độ tự luyện 24/7) */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      Luyện Tập Tại Nhà · 24/7
                    </span>
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      Tự động lấy câu hỏi Trường & Lớp
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2">
                    Bãi Luyện Săn Quái Foggo
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Tập dượt kiến thức không giới hạn. Trả lời đúng để tung đòn tấn công quái vật, chịu lượt phản công và tích lũy Vàng để ghé <strong>Thợ Rèn Bác Búa</strong> rèn kiếm, sắm giáp chuẩn bị cho giải đấu lớp học!
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 mb-5 text-[11px] text-slate-300">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                      <Swords className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Đánh theo lượt (Turn-based RPG)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span>Cày Vàng mua vũ khí & áo giáp</span>
                    </div>
                  </div>
                </div>

                <form action={startHomeFarmSession} className="w-full">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Swords className="w-4 h-4" />
                    <span>{mySoloFarmSession ? "Tiếp Tục Bãi Farm Quái" : "Vào Bãi Farm Quái Ngay"}</span>
                  </button>
                </form>
              </div>

              {/* Card 2: HẦM NGỤC LỚP HỌC (Chiến đấu cùng Giáo viên & Lớp) */}
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-amber-950/25 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                      Đấu Trường Trên Lớp
                    </span>
                    {openClassWorld && (
                      <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        Đang mở trận!
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2">
                    {openClassWorld ? openClassWorld.title : "Hầm Ngục Lớp Học"}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {openClassWorld
                      ? "Giáo viên đã mở phòng thi đấu sinh tồn cho lớp! Hãy nhanh chóng chuẩn bị trang bị và bấm tham gia ngay."
                      : "Tham gia cùng các bạn khi Thầy/Cô mở phòng hầm ngục. Nhập mã PIN do giáo viên cung cấp để nhảy vào phòng ngay lập tức."}
                  </p>

                  {openClassWorld ? (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                      <p className="text-xs font-semibold text-amber-300">
                        ⚡ Phòng đang kích hoạt: {openClassWorld.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Chế độ: Sinh tồn đợt quái · Tỉ lệ rơi báu vật nhân vật cực hiếm!
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-[11px] text-slate-400 mb-1 font-semibold">
                        Nhập mã phòng hoặc link giáo viên gửi:
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
                    <span>Tham Gia Trận Chiến Lớp Ngay</span>
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
                    <span>Trang Bị Nhân Vật Hiện Tại</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trang bị giúp tăng sát thương khi trả lời đúng và giảm sát thương khi quái phản công.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    Sát thương: <strong>+{weaponAtk}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    Giảm thương: <strong>-{totalDefensePercent}%</strong>
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
                      Vũ khí
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {equipped.weapon?.name || "Kiếm Gỗ Rừng Sâu"}
                    </p>
                    <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                      Công: +{equipped.weapon?.atk || 25} Atk
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
                      Mũ bảo hộ
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {equipped.helmet?.name || "Chưa có mũ"}
                    </p>
                    <p className="text-[11px] text-blue-400 font-mono mt-0.5">
                      {equipped.helmet ? `Giảm thương: -${Math.round((equipped.helmet.defense || 0) * 100)}%` : "Ghé Thợ Rèn để mua"}
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
                      Áo giáp thân
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {equipped.armor?.name || "Chưa có áo giáp"}
                    </p>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                      {equipped.armor ? `Giảm thương: -${Math.round((equipped.armor.defense || 0) * 100)}%` : "Ghé Thợ Rèn để mua"}
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
                      Khiên chắn
                    </p>
                    <p className="text-xs font-bold text-white truncate">
                      {equipped.shield?.name || "Chưa có khiên"}
                    </p>
                    <p className="text-[11px] text-purple-400 font-mono mt-0.5">
                      {equipped.shield ? `Chặn đòn: -${Math.round((equipped.shield.defense || 0) * 100)}%` : "Ghé Thợ Rèn để mua"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gợi ý mua sắm & tăng sức mạnh */}
              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 text-xs text-slate-300">
                <Hammer className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Cách nâng cấp trang bị:</span> Khi vào Bãi Farm Quái Sinh Tồn, hãy tương tác với NPC <strong>Thợ Rèn Bác Búa</strong> (để rèn Kiếm Sắt, Giáp Sắt) và <strong>Tiệm Cô Túi</strong> (để mua Thuốc Hồi Máu, Bánh Mì, Đèn Lồng). Trang bị mua được sẽ lưu trữ vĩnh viễn trên nhân vật của bạn!
                </div>
              </div>
            </div>

            {/* 4. LỊCH SỬ THÁM HIỂM (ĐẢO SINH TỒN ĐÃ THAM GIA) */}
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Các Chuyến Thám Hiểm Gần Đây</span>
                </h3>
                <Link
                  href="/worlds"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Xem tất cả thế giới</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {myRecentPlayedWorlds.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Bạn chưa có chuyến thám hiểm nào. Hãy bấm <strong>&quot;Vào Bãi Farm Quái Ngay&quot;</strong> để bắt đầu tích lũy Vàng đầu tiên!
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
                              {isSolo ? "Solo Farm Tại Nhà" : "Đấu Trường Lớp"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {p.gold ?? 0} Vàng · {p.score ?? 0} Điểm · {p.state?.hp ?? 100} HP
                          </p>
                        </div>

                        <Link
                          href={`/world/${s.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
                        >
                          Vào chơi
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
