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

        {/* Mô phỏng gameplay RPG sinh tồn trực quan */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-amber-500/30 via-slate-800/40 to-slate-900/60 shadow-2xl">
          <div className="bg-slate-950/95 rounded-[22px] p-6 sm:p-8 border border-slate-800/80 backdrop-blur-xl space-y-6">
            {/* Header thanh trạng thái RPG */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                <SunMedium className="w-4 h-4 text-amber-400" />
                <span>ĐẢO FOGGO · ĐẤU TRƯỜNG SĂN QUÁI RPG</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  ❤️ HP 100/100
                </span>
                <span className="text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  🛡️ GIÁP -24%
                </span>
                <span className="text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  🪙 30 XU
                </span>
              </div>
            </div>

            {/* Sân đấu Pixel Art (Battle Stage Mockup) */}
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

              {/* Nhân vật thám hiểm */}
              <div className="flex flex-col items-center gap-2 z-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border-2 border-amber-500/40 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/15 animate-bounce">
                    🦊
                  </div>
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-mono text-[9px] font-black uppercase">
                    Lv.5
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-xs text-white block">Nhà Thám Hiểm</span>
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-rose-500 h-full w-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Hiệu ứng Combat & Streak */}
              <div className="flex flex-col items-center justify-center gap-1.5 z-10 text-center">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>TRẢ LỜI ĐÚNG · TẤN CÔNG!</span>
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                  ⚔️ -25 SÁT THƯƠNG
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Chuỗi x3 (+24% sát thương thưởng)
                </span>
              </div>

              {/* Quái vật Slime */}
              <div className="flex flex-col items-center gap-2 z-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 border-2 border-emerald-500/40 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/15 animate-pulse">
                    🟢
                  </div>
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-mono text-[9px] font-black uppercase">
                    Quái
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-xs text-emerald-300 block">Slime Rừng Xanh</span>
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[35%] rounded-full" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">10/30 HP</span>
                </div>
              </div>
            </div>

            {/* Bảng câu hỏi tương tác mẫu */}
            <div className="space-y-3 pt-2 text-left">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  Câu hỏi 3/10 · Tin học &amp; Kỹ năng số
                </span>
                <span>Thời gian: 25s</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                Hành động nào sau đây là an toàn nhất khi nhận được tin nhắn kèm liên kết lạ từ người không quen?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-400 mr-2 font-mono">A.</span> Bấm ngay vào liên kết để kiểm tra
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15 border-2 border-emerald-500 text-xs text-emerald-200 font-bold shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-400 mr-2 font-mono">B.</span> Không bấm và báo cáo tin nhắn rác
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-400 mr-2 font-mono">C.</span> Chuyển tiếp tin nhắn cho bạn bè
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-400 mr-2 font-mono">D.</span> Nhập thông tin để nhận quà
                </div>
              </div>
            </div>

            {/* 3 Trụ Cột Lối Chơi Hiện Đại */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <span className="text-2xl block">⚔️</span>
                <h4 className="font-bold text-white text-xs sm:text-sm">Săn Quái Theo Lượt</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Trả lời đúng để tung kiếm chém quái; trả lời sai sẽ bị quái đánh trả. Đánh bại con này quái khác xuất hiện liên hoàn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <span className="text-2xl block">🏪</span>
                <h4 className="font-bold text-white text-xs sm:text-sm">Thợ Rèn &amp; Tiệm Đồ</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tích lũy xu để trang bị Kiếm, Mũ, Giáp, Khiên (giảm đến 60% sát thương) và mua bình máu cấp cứu khi hết sinh lực.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <span className="text-2xl block">🏆</span>
                <h4 className="font-bold text-white text-xs sm:text-sm">Đấu Trường Lớp &amp; Bãi Solo</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tự luyện 24/7 lấy ngẫu nhiên câu hỏi trường &amp; lớp, hoặc gia nhập hầm ngục tranh tài bảng xếp hạng trực tiếp cùng lớp học.
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
