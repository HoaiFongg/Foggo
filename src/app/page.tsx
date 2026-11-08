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
  HelpCircle,
  Zap,
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

          <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-semibold">
            <Link
              href="/explore"
              className="text-slate-300 hover:text-white px-2 py-1 transition-colors hidden sm:inline"
            >
              Khám Phá
            </Link>
            <Link
              href="/pricing"
              className="text-slate-300 hover:text-white px-2 py-1 transition-colors hidden sm:inline"
            >
              Gói Plus
            </Link>
            <Link
              href="/login"
              className="text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register/student"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Vào chơi</span>
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
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                <SunMedium className="w-4 h-4" />
                <span>ĐỒNG HỒ ĐẢO FOGGO · NGÀY 1 (BAN NGÀY)</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-rose-400 font-bold">❤️ HP 100/100</span>
                <span className="text-amber-300 font-bold">🍗 ĐÓI 100/100</span>
                <span className="text-amber-400 font-bold">🪙 30 XU</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-2xl mb-2 block">🌲</span>
                <h4 className="font-bold text-white text-sm">Hái Lượm & Chế Tạo</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Trả lời câu hỏi để chặt gỗ rừng, đẽo đá cuội và rèn kiếm săn quái vật.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-2xl mb-2 block">⚔️</span>
                <h4 className="font-bold text-white text-sm">Săn Thú & Đánh Trùm</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Đánh bại Heo Rừng Chúa, Golem Đá và Phù Thủy Đầm Lầy để đoạt kho báu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-2xl mb-2 block">🌙</span>
                <h4 className="font-bold text-white text-sm">Sống Sót Qua Đêm</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Xây dựng hàng rào và giữ lửa trại rực sáng để đẩy lùi đợt quái đêm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 BƯỚC DÀNH CHO GIÁO VIÊN */}
      <section className="relative z-10 py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-900">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-2">
            HƯỚNG DẪN 3 BƯỚC
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            DỄ DÀNG CHO GIÁO VIÊN TRONG 2 PHÚT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
              1
            </span>
            <h3 className="font-bold text-white text-base">Tạo hoặc Nhân Bản Bộ Câu Hỏi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tự soạn với 8 dạng câu hỏi tương tác (Hotspot, Ghép cặp, Điền khuyết...) hoặc chọn ngay từ thư viện cộng đồng chỉ với 1 click.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
              2
            </span>
            <h3 className="font-bold text-white text-base">Mở Thế Giới Không Cần PIN</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chiếu mã QR lên máy chiếu hoặc gửi link vào nhóm lớp. Học sinh chạm là vào ngay thế giới, tự động lưu nhân vật.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
              3
            </span>
            <h3 className="font-bold text-white text-base">Theo Dõi & Xuất Báo Cáo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Xem bảng xếp hạng trực tiếp, thống kê câu hỏi học sinh hay làm sai nhất và xuất dữ liệu điểm số ra file CSV / Excel.
            </p>
          </div>
        </div>
      </section>

      {/* TÍNH NĂNG NỔI BẬT */}
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

      {/* CÂU HỎI THƯỜNG GẶP (FAQ) */}
      <section className="relative z-10 py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-900">
        <div className="text-center mb-10">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-2">
            HỎI ĐÁP
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            CÂU HỎI THƯỜNG GẶP
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
            <h4 className="font-bold text-white text-sm mb-1">
              Học sinh có bắt buộc phải có tài khoản email không?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Không. Foggo hỗ trợ đăng ký học sinh hoàn toàn không cần email (chỉ cần tên đăng nhập, mật khẩu, trường và lớp) hoặc tham gia ẩn danh dưới dạng khách.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
            <h4 className="font-bold text-white text-sm mb-1">
              Học sinh dùng điện thoại chơi có thuận tiện không?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Foggo được thiết kế theo tư duy Mobile-First. Tất cả thao tác chiến đấu, chạm điểm yếu trên ảnh (Hotspot) hay kéo thả đều được tối ưu cảm ứng mượt mà trên mọi kích cỡ màn hình.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
            <h4 className="font-bold text-white text-sm mb-1">
              Tôi có thể tổ chức cho bao nhiêu học sinh cùng chơi một lúc?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gói miễn phí hỗ trợ tối đa 40 học sinh/thế giới. Gói Plus hỗ trợ lên tới 500 học sinh cùng lúc, phù hợp cho quy mô toàn khối hoặc toàn trường.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-mono font-bold text-slate-400">
              FOGGO © 2026 · Nền tảng học tập qua trò chơi sinh tồn
            </p>
            <p className="mt-1">Linh vật chú cáo Gô · "Tan sương, tiến lên!"</p>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <Link href="/explore" className="hover:text-amber-400 transition-colors">
              Khám Phá
            </Link>
            <Link href="/pricing" className="hover:text-amber-400 transition-colors">
              Bảng Giá
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              Điều Khoản
            </Link>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              Bảo Mật
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
