"use client";

import Link from "next/link";
import {
  Flame,
  Sparkles,
  Swords,
  Shield,
  Compass,
  ArrowRight,
  SunMedium,
  BookOpen,
  CheckCircle2,
  Crown,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function LandingClient() {
  const { t, isVi } = useLanguage();

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
                {t.landing.badge}
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
            <Link
              href="/explore"
              className="text-slate-300 hover:text-white px-2 py-1 transition-colors hidden sm:inline"
            >
              {t.nav.explore}
            </Link>
            <Link
              href="/pricing"
              className="text-slate-300 hover:text-white px-2 py-1 transition-colors hidden sm:inline"
            >
              {t.nav.pricing}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            <Link
              href="/login"
              className="text-slate-300 hover:text-white px-3 py-1.5 transition-colors hidden sm:inline"
            >
              {t.common.login}
            </Link>
            <Link
              href="/register/student"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono"
            >
              <span>{t.common.playNow}</span>
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
          <span>{isVi ? '"Tan sương, tiến lên!" · Trả lời đúng, tan sương mù.' : '"Dispel the fog, march ahead!" · Correct answer, clear path.'}</span>
        </div>

        {/* Headline chính */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto font-mono">
          {t.landing.heroTitle1}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
            {t.landing.heroHighlight}
          </span>
        </h1>

        <p className="mt-6 text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          {t.landing.heroSubtitle}
        </p>

        {/* Nút Call To Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link
            href="/register/student"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono"
          >
            <span>{isVi ? "Học sinh: Chơi không cần Email" : "Students: Play without Email"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-base flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer font-mono"
          >
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>{isVi ? "Giáo viên: Mở Thế Giới Lớp Học" : "Teachers: Host Class World"}</span>
          </Link>
        </div>

        {/* Mô phỏng gameplay RPG sinh tồn trực quan */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl p-1 bg-gradient-to-b from-amber-500/30 via-slate-800/40 to-slate-900/60 shadow-2xl">
          <div className="bg-slate-950/95 rounded-[22px] p-6 sm:p-8 border border-slate-800/80 backdrop-blur-xl space-y-6">
            {/* Header thanh trạng thái RPG */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                <SunMedium className="w-4 h-4 text-amber-400" />
                <span>FOGGO · {t.landing.demoBadge}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                  ❤️ HP 100/100
                </span>
                <span className="text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                  🛡️ DEF -24%
                </span>
                <span className="text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  🪙 30 {t.common.coins}
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
                  <span className="font-bold text-xs text-white block">{isVi ? "Nhà Thám Hiểm" : "Hero Explorer"}</span>
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-rose-500 h-full w-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Hiệu ứng Combat & Streak */}
              <div className="flex flex-col items-center justify-center gap-1.5 z-10 text-center">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isVi ? "TRẢ LỜI ĐÚNG · TẤN CÔNG!" : "CORRECT · HERO STRIKE!"}</span>
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                  ⚔️ -25 DMG
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {isVi ? "Chuỗi x3 (+24% sát thương thưởng)" : "Streak x3 (+24% combo damage)"}
                </span>
              </div>

              {/* Quái vật Slime */}
              <div className="flex flex-col items-center gap-2 z-10">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 border-2 border-emerald-500/40 flex items-center justify-center text-4xl shadow-lg shadow-emerald-500/15 animate-pulse">
                    🟢
                  </div>
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-mono text-[9px] font-black uppercase">
                    Monster
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-xs text-emerald-300 block">{t.battle.slimeMonster}</span>
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
                  {isVi ? "Câu hỏi 3/10 · Tin học & Kỹ năng số" : "Question 3/10 · Digital Safety & Ethics"}
                </span>
                <span>{isVi ? "Thời gian: 25s" : "Time: 25s"}</span>
              </div>
              <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                {isVi
                  ? "Hành động nào sau đây là an toàn nhất khi nhận được tin nhắn kèm liên kết lạ từ người không quen?"
                  : "Which action is safest when receiving a message containing an unknown link from a stranger?"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-400 mr-2 font-mono">A.</span>{" "}
                  {isVi ? "Bấm ngay vào liên kết để kiểm tra" : "Click the link immediately to verify"}
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/15 border-2 border-emerald-500 text-xs text-emerald-200 font-bold shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-400 mr-2 font-mono">B.</span>{" "}
                    {isVi ? "Không bấm và báo cáo tin nhắn rác" : "Do not click and report spam"}
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-400 mr-2 font-mono">C.</span>{" "}
                  {isVi ? "Chuyển tiếp tin nhắn cho bạn bè" : "Forward the message to friends"}
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-amber-400 mr-2 font-mono">D.</span>{" "}
                  {isVi ? "Nhập thông tin để nhận quà" : "Submit credentials to claim rewards"}
                </div>
              </div>
            </div>

            {/* 3 Trụ Cột Lối Chơi Hiện Đại */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <span className="text-2xl block">⚔️</span>
                <h4 className="font-bold text-white text-xs sm:text-sm">{isVi ? "Săn Quái Theo Lượt" : "Turn-Based Combat"}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isVi
                    ? "Trả lời đúng để tung kiếm chém quái; trả lời sai sẽ bị quái đánh trả. Đánh bại con này quái khác xuất hiện liên hoàn."
                    : "Answer correctly to strike with weapons; wrong answers trigger counter-attacks. Defeating monsters immediately spawns the next wave."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <span className="text-2xl block">🏪</span>
                <h4 className="font-bold text-white text-xs sm:text-sm">{t.battle.blacksmithTab}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isVi
                    ? "Tích lũy xu để trang bị Kiếm, Mũ, Giáp, Khiên (giảm đến 60% sát thương) và mua bình máu cấp cứu khi hết sinh lực."
                    : "Accumulate coins to forge Swords, Helmets, Armor, Shields (up to 60% DEF) and buy emergency healing potions."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                <span className="text-2xl block">🏆</span>
                <h4 className="font-bold text-white text-xs sm:text-sm">{isVi ? "Đấu Trường Lớp & Bãi Solo" : "Classroom & Solo Grounds"}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {isVi
                    ? "Tự luyện 24/7 lấy ngẫu nhiên câu hỏi trường & lớp, hoặc gia nhập hầm ngục tranh tài bảng xếp hạng trực tiếp cùng lớp học."
                    : "Practice 24/7 with randomized school questions, or join classroom dungeon lobbies to compete live on the leaderboard."}
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
            {isVi ? "HƯỚNG DẪN 3 BƯỚC" : "3 SIMPLE STEPS"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {isVi ? "DỄ DÀNG CHO GIÁO VIÊN TRONG 2 PHÚT" : "READY FOR TEACHERS IN 2 MINUTES"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
              1
            </span>
            <h3 className="font-bold text-white text-base">
              {isVi ? "Tạo hoặc Nhân Bản Bộ Câu Hỏi" : "Create or Duplicate Question Sets"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isVi
                ? "Tự soạn với 8 dạng câu hỏi tương tác (Hotspot, Ghép cặp, Điền khuyết...) hoặc chọn ngay từ thư viện cộng đồng chỉ với 1 click."
                : "Author quizzes across 8 interactive formats (Hotspot, Matching, Blanks...) or clone ready sets from community library with 1 click."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
              2
            </span>
            <h3 className="font-bold text-white text-base">
              {isVi ? "Mở Thế Giới Không Cần PIN" : "Host Worlds Without PIN"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isVi
                ? "Chiếu mã QR lên máy chiếu hoặc gửi link vào nhóm lớp. Học sinh chạm là vào ngay thế giới, tự động lưu nhân vật."
                : "Project QR codes or send direct join links to classroom groups. Students tap to join instantly with auto-saved progress."}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 text-left space-y-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center text-sm border border-amber-500/30">
              3
            </span>
            <h3 className="font-bold text-white text-base">
              {isVi ? "Theo Dõi & Xuất Báo Cáo" : "Monitor & Export Reports"}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isVi
                ? "Xem bảng xếp hạng trực tiếp, thống kê câu hỏi học sinh hay làm sai nhất và xuất dữ liệu điểm số ra file CSV / Excel."
                : "Inspect live leaderboard standings, identify commonly missed questions, and export grade books to CSV / Excel."}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-4 sm:px-6 relative z-10 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">FOGGO · RPG Learning Web</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              {isVi ? "Điều khoản" : "Terms"}
            </Link>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              {isVi ? "Bảo mật" : "Privacy"}
            </Link>
            <Link href="/pricing" className="hover:text-amber-400 transition-colors">
              {t.nav.pricing}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

