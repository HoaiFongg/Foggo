import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Flame,
  Sparkles,
  Compass,
  PlusCircle,
  Trophy,
  Users,
  LogOut,
  Swords,
  BookOpen,
  ShoppingBag,
} from "lucide-react";
import { getOptionalUser } from "@/lib/auth";
import { logout } from "@/app/(auth)/actions";

export default async function DashboardPage() {
  const { user, profile } = await getOptionalUser();

  // Nếu đã cấu hình Supabase và không có user -> redirect login
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !user) {
    redirect("/login");
  }

  const displayName = profile?.display_name || user?.user_metadata?.display_name || "Nhà Thám Hiểm";
  const role = profile?.role || "student";
  const fireflies = profile?.fireflies ?? 120;
  const isTeacher = role === "teacher";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-mono">
              FOG<span className="text-amber-400">GO</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Đom Đóm (tiền ngoài ván) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{fireflies} Đom Đóm</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200">{displayName}</p>
                <p className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">
                  {isTeacher ? "Giáo viên" : "Học sinh"}
                </p>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  title="Đăng xuất"
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner chào mừng */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 p-8 sm:p-10 mb-8 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
              <span>Đèn lồng cấp 1 · Sương mù bao phủ đảo</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Xin chào, <span className="text-amber-400">{displayName}</span>!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Sẵn sàng cùng chú cáo <strong>Gô</strong> thắp sáng đèn lồng, trả lời đúng để xua tan màn sương và sinh tồn qua ngày đêm chưa?
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/worlds"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>Khám phá Thế giới</span>
              </Link>

              {isTeacher && (
                <Link
                  href="/dashboard/sets/new"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm flex items-center gap-2 transition-all border border-slate-700"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Tạo bộ câu hỏi mới</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Grid tính năng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Chế độ Sinh tồn tri thức */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Swords className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Sinh Tồn Tri Thức</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Chế độ chơi chính: Trả lời câu hỏi để hái lượm, chế tạo vũ khí, chống chọi quái vật bóng tối khi màn đêm buông xuống.
            </p>
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:underline">
              Vào đảo sinh tồn →
            </span>
          </div>

          {/* Card 2: Thế giới của Lớp */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Thế Giới Của Lớp</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Không cần mã PIN! Vào thế giới lớp học trực tiếp qua link hoặc từ trang cá nhân, nhân vật được lưu liên tục nhiều ngày.
            </p>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:underline">
              Xem lớp học của bạn →
            </span>
          </div>

          {/* Card 3: Cửa hàng Skin & Thương nhân */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-6 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Tiệm Cô Túi & Bác Búa</h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Đổi Đom Đóm lấy trang phục độc quyền cho Cáo Gô, đèn lồng huyền thoại và nâng cấp công cụ sinh tồn.
            </p>
            <span className="text-xs font-semibold text-purple-400 flex items-center gap-1 group-hover:underline">
              Khám phá tiệm đồ →
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
