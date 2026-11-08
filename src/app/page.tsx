import Link from "next/link";
import {
  Flame,
  Sparkles,
  Swords,
  Shield,
  Compass,
  ArrowRight,
  SunMedium,
  Moon,
  BookOpen,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 overflow-x-hidden">
      {/* Sương mù động & hiệu ứng ánh sáng đèn lồng */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-mono">
                FOG<span className="text-amber-400">GO</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-mono text-amber-300/80 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                v1.0 Sinh Tồn
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register/student"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Vào chơi ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Khẩu hiệu tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-mono font-medium mb-8 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>"Tan sương, tiến lên!" · Trả lời đúng, tan sương mù.</span>
        </div>

        {/* Headline chính */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto font-mono">
          WEB HỌC TẬP DẠNG{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
            GAME SINH TỒN
          </span>
        </h1>

        <p className="mt-6 text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Học sinh cùng chú cáo nhỏ <strong>Gô</strong> thắp sáng đèn lồng giữa hòn đảo sương mù kỳ bí. Không cần mã PIN — vào chơi lập tức, trả lời câu hỏi để hái lượm, chế tạo vũ khí và sống sót qua bóng đêm!
        </p>

        {/* Nút Call To Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/register/student"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Học sinh: Chơi không cần Email</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
          >
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Giáo viên: Mở Thế giới cho Lớp</span>
          </Link>
        </div>

        {/* Mô phỏng gameplay sinh tồn */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-amber-500/20 to-slate-800/20 shadow-2xl">
          <div className="bg-slate-950/90 rounded-[22px] p-6 sm:p-8 border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400">Đảo Sương Mù · Khu Rừng Bí Ẩn</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-amber-400 flex items-center gap-1">
                  <SunMedium className="w-4 h-4" /> Ngày 1: Ban ngày
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 100 HP
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono mb-1">
                  1. Đi Săn & Hái Lượm
                </div>
                <p className="text-xs text-slate-300">
                  Trả lời câu hỏi trắc nghiệm để gây sát thương lên quái rừng, thu thập gỗ, đá và thức ăn tích trữ cho trại.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono mb-1">
                  2. Chế Tạo & Rèn Đồ
                </div>
                <p className="text-xs text-slate-300">
                  Gặp Bác Búa và Cô Túi để ghép vũ khí mới, dựng hàng rào, sửa chữa giáp trước khi màn đêm buông xuống.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono mb-1 flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5" /> 3. Đợt Quái Đêm
                </div>
                <p className="text-xs text-slate-300">
                  Đêm xuống, sương mù dày đặc! Giải nhanh các câu hỏi đặc biệt để thắp sáng đèn lồng đẩy lùi bầy quái vật.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: 4 điểm khác biệt cốt lõi */}
      <section className="relative z-10 py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            TẠI SAO FOGGO KHÁC BIỆT?
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Giải quyết triệt để những bất tiện của các nền tảng quiz truyền thống
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Không Cần Mã PIN</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Học sinh vào thế giới lớp học trực tiếp qua link/QR hoặc từ dashboard lớp. Nhân vật được lưu trữ vĩnh viễn giữa các buổi học.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Đăng Ký Không Cần Email</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Học sinh đăng ký chỉ bằng tên đăng nhập + trường + lớp. Có mã khôi phục bí mật tự phục hồi tài khoản khi quên mật khẩu.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Swords className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">8 Dạng Câu Hỏi Đa Dạng</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kéo thả sắp xếp, ghép cặp, điền khuyết, chọn nhiều đáp án, và chọn điểm yếu trực tiếp trên ảnh (Hotspot).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Chấm Điểm Phía Server</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tuyệt đối không gửi đáp án đúng xuống trình duyệt. Chống gian lận bằng F12 DevTools triệt để 100%.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-10 px-4 sm:px-6 max-w-6xl mx-auto text-center text-xs text-slate-500">
        <p className="font-mono">FOGGO © 2026 · Nền tảng học tập qua trò chơi sinh tồn</p>
        <p className="mt-1">Linh vật chú cáo Gô · "Tan sương, tiến lên!"</p>
      </footer>
    </div>
  );
}
