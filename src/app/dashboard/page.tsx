import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Flame,
  Sparkles,
  Compass,
  PlusCircle,
  Trophy,
  Users,
  Swords,
  BookOpen,
  ShoppingBag,
  Crown,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  School,
  Layers,
  Settings2,
} from "lucide-react";
import { getOptionalUser } from "@/lib/auth";
import { NavigationHeader } from "@/components/NavigationHeader";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { user, profile } = await getOptionalUser();

  // Nếu đã cấu hình Supabase và không có user -> redirect login
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !user) {
    redirect("/login");
  }

  const role = profile?.role || "student";
  const plan = profile?.plan || "free";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isTeacherOrAdmin = isAdmin || isTeacher;
  const displayName =
    profile?.display_name || user?.user_metadata?.display_name || "Nhà Thám Hiểm";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Top Navbar */}
      <NavigationHeader profile={profile} activeItem="dashboard" />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner chào mừng thông minh dựa trên Role */}
        <div
          className={`relative rounded-3xl overflow-hidden border p-8 sm:p-10 mb-8 shadow-2xl ${
            isAdmin
              ? "bg-gradient-to-r from-slate-900 via-rose-950/20 to-amber-950/30 border-rose-500/30"
              : isTeacher
              ? "bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-amber-500/30"
              : "bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border-slate-800"
          }`}
        >
          <div className="relative z-10 max-w-3xl">
            {isAdmin ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold mb-4">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Trung Tâm Điều Hành Quản Trị Tối Cao (Admin Command Center)</span>
              </div>
            ) : isTeacher ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
                <span>Không Gian Giáo Viên · Mở Hầm Ngục & Soạn Câu Hỏi</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
                <span>Học Sinh · Đèn lồng sinh tồn cấp 1</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Xin chào,{" "}
              <span className={isAdmin ? "text-rose-400" : isTeacher ? "text-amber-400" : "text-emerald-400"}>
                {displayName}
              </span>
              !
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              {isAdmin ? (
                <>
                  Bạn có <strong>toàn quyền quản trị cao nhất</strong> trên hệ thống Foggo: Mở và điều phối mọi hầm ngục sinh tồn, biên soạn ngân hàng 8 dạng câu hỏi, duyệt trường học, phân quyền tài khoản và kích hoạt gói Plus.
                </>
              ) : isTeacher ? (
                <>
                  Sẵn sàng cùng học sinh thắp sáng đảo sương mù! Mở một Thế Giới mới để lớp thi đấu sinh tồn hoặc tạo thêm các bộ câu hỏi mới.
                </>
              ) : (
                <>
                  Cùng chú cáo <strong>Gô</strong> thắp sáng đèn lồng, trả lời đúng để hái lượm nguyên liệu, chế tạo vũ khí và chống lại quái vật bóng đêm!
                </>
              )}
            </p>

            {/* Phím tắt hành động nổi bật */}
            <div className="flex flex-wrap gap-3 mt-6">
              {isTeacherOrAdmin && (
                <Link
                  href="/teacher/worlds/new"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Mở Hầm Ngục Mới (Thế Giới)</span>
                </Link>
              )}

              {isTeacherOrAdmin && (
                <Link
                  href="/dashboard/sets/new"
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm flex items-center gap-2 transition-all border border-slate-700"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Tạo Bộ Câu Hỏi Mới</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-6 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-sm flex items-center gap-2 transition-all border border-rose-500/40 shadow-lg shadow-rose-500/10"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-300" />
                  <span>Vào Cổng Admin Quản Trị</span>
                </Link>
              )}

              <Link
                href="/worlds"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm flex items-center gap-2 transition-all border border-slate-800"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Xem Các Thế Giới Đang Chạy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Hầm Ngục & Thế Giới Sinh Tồn */}
          <Link
            href={isTeacherOrAdmin ? "/teacher/worlds/new" : "/worlds"}
            className="group bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Swords className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                {isTeacherOrAdmin ? "Quản Lý Phòng" : "Tham Gia"}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              Hầm Ngục & Thế Giới Sinh Tồn
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              {isTeacherOrAdmin
                ? "Khởi tạo thế giới lớp học, cấu hình mật độ sương mù, điều khiển đợt quái vật bóng đêm và chiếu mã QR cho học sinh vào chơi."
                : "Tham gia thế giới của lớp hoặc tự thám hiểm hòn đảo sinh tồn sương mù, trả lời câu hỏi để nhặt đồ và sinh tồn."}
            </p>
            <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:underline">
              <span>{isTeacherOrAdmin ? "Mở phòng / Điều khiển hầm ngục" : "Vào đảo sinh tồn"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Kho Bộ Câu Hỏi */}
          {isTeacherOrAdmin ? (
            <Link
              href="/dashboard/sets"
              className="group bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  8 Dạng Câu Hỏi
                </span>
              </div>
              <h2 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                Ngân Hàng Câu Hỏi & Bộ Đề
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Tạo và chỉnh sửa câu hỏi: Trắc nghiệm, Đúng/Sai, Kéo thả thứ tự, Chạm điểm yếu hình ảnh, Ghép cặp, Điền từ khuyết, Đúng/Sai nhiều ý.
              </p>
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:underline">
                <span>Quản lý kho đề thi & câu hỏi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <Link
              href="/worlds"
              className="group bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Lưu Tiến Trình
                </span>
              </div>
              <h2 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                Thế Giới Của Lớp
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Không cần mã PIN! Vào lại thế giới của lớp qua link hoặc danh sách thế giới đã tham gia, trang bị và điểm số được lưu liên tục.
              </p>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:underline">
                <span>Xem danh sách thế giới</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}

          {/* Card 3: Cổng Quản Trị Hệ Thống (Dành Riêng Cho Admin) */}
          {isAdmin ? (
            <Link
              href="/admin"
              className="group bg-slate-900/60 border border-rose-500/30 hover:border-rose-500/70 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase">
                  Admin Portal
                </span>
              </div>
              <h2 className="text-base font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                Cổng Quản Trị Toàn Hệ Thống
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Phân quyền tài khoản (Học sinh, Giáo viên, Admin), duyệt trường học, nâng cấp gói Plus cho giáo viên và giám sát mọi hoạt động.
              </p>
              <div className="text-xs font-semibold text-rose-400 flex items-center gap-1 group-hover:underline">
                <span>Mở bảng điều khiển Admin</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ) : (
            <Link
              href="/dashboard/subscription"
              className="group bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                  Cửa Hàng
                </span>
              </div>
              <h2 className="text-base font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                Tiệm Đồ & Gói Plus
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Đổi Đom Đóm lấy trang phục độc quyền cho Cáo Gô, đèn lồng huyền thoại và nâng cấp gói Plus không giới hạn học sinh.
              </p>
              <div className="text-xs font-semibold text-purple-400 flex items-center gap-1 group-hover:underline">
                <span>Khám phá tiệm đồ</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          )}

          {/* Card 4: Thư Viện Cộng Đồng */}
          <Link
            href="/explore"
            className="group bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold">
                Khám Phá
              </span>
            </div>
            <h2 className="text-base font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
              Thư Viện Đề Thi Cộng Đồng
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Khám phá hàng ngàn bộ đề thi môn Toán, Tiếng Anh, KHTN do giáo viên toàn quốc chia sẻ. Sao chép 1 chạm vào kho đề cá nhân.
            </p>
            <div className="text-xs font-semibold text-sky-400 flex items-center gap-1 group-hover:underline">
              <span>Khám phá kho đề cộng đồng</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 5: Thế Giới Đang Chạy & Báo Cáo */}
          <Link
            href="/worlds"
            className="group bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                Báo Cáo
              </span>
            </div>
            <h2 className="text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Hầm Ngục Đang Chạy & Báo Cáo
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Kiểm tra tình trạng các hầm ngục đang mở, xem bảng xếp hạng học sinh, thống kê câu hỏi hay làm sai và xuất báo cáo CSV.
            </p>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:underline">
              <span>Xem danh sách và báo cáo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 6: Gói Plus & Nâng Cấp */}
          <Link
            href="/pricing"
            className="group bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90 rounded-2xl p-6 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 block"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                {plan === "plus" ? "Đã Kích Hoạt" : "Nâng Cấp"}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              Gói Bản Quyền Foggo Plus
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Hỗ trợ lên tới 500 học sinh cùng chơi cùng lúc, mở khóa đầy đủ 8 dạng câu hỏi, không giới hạn số lượng thế giới và bộ câu hỏi.
            </p>
            <div className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:underline">
              <span>{plan === "plus" ? "Xem quyền lợi gói Plus của bạn" : "Tìm hiểu gói Foggo Plus"}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
