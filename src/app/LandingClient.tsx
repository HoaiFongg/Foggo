"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Sparkles,
  Swords,
  Shield,
  Heart,
  Coins,
  ArrowRight,
  SunMedium,
  BookOpen,
  CheckCircle2,
  Hammer,
  Trophy,
  Zap,
  Star,
  Building2,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PixelHero } from "@/components/PixelHero";
import { PixelItemIcon } from "@/components/PixelItemIcon";

export function LandingClient() {
  const { t, isVi } = useLanguage();

  // Interactive Live Battle Demo State
  const [demoSelected, setDemoSelected] = useState<string>("B");
  const [demoMonsterHp, setDemoMonsterHp] = useState<number>(0);
  const [demoHeroAnim, setDemoHeroAnim] = useState<"idle" | "sword_attack" | "hurt">("idle");
  const [demoStreak, setDemoStreak] = useState<number>(3);
  const [demoCoins, setDemoCoins] = useState<number>(30);
  const [demoFeedback, setDemoFeedback] = useState<{
    correct: boolean;
    text: string;
    dmg: number;
  }>({
    correct: true,
    text: isVi ? "TRẢ LỜI ĐÚNG · HIỆP SĨ XUẤT CHIÊU!" : "CORRECT · HERO STRIKE!",
    dmg: 25,
  });

  const handleSelectOption = (opt: string) => {
    setDemoSelected(opt);
    if (opt === "B") {
      setDemoHeroAnim("sword_attack");
      setDemoMonsterHp(0);
      setDemoStreak((s) => s + 1);
      setDemoCoins((c) => c + 15);
      setDemoFeedback({
        correct: true,
        text: isVi ? "CHÍNH XÁC! Hiệp sĩ tung kiếm chém hạ quái vật!" : "CORRECT! Hero delivered a finishing strike!",
        dmg: 25,
      });
      setTimeout(() => setDemoHeroAnim("idle"), 1200);
    } else {
      setDemoHeroAnim("hurt");
      setDemoStreak(0);
      setDemoFeedback({
        correct: false,
        text: isVi ? "CHƯA ĐÚNG! Bị quái vật phản đòn · Cần cảnh giác link lạ!" : "INCORRECT! Monster counter-attacked.",
        dmg: 0,
      });
      setTimeout(() => setDemoHeroAnim("idle"), 1000);
    }
  };

  const handleResetDemo = () => {
    setDemoSelected("");
    setDemoMonsterHp(25);
    setDemoHeroAnim("idle");
    setDemoStreak(1);
    setDemoFeedback({
      correct: true,
      text: isVi ? "CHỌN ĐÁP ÁN ĐỂ BẮT ĐẦU TẤN CÔNG!" : "PICK AN OPTION TO STRIKE!",
      dmg: 0,
    });
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-amber-500/20 overflow-x-hidden font-sans">
      {/* ── Atmospheric Background Layers ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(245,158,11,0.06)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(245,158,11,0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,rgba(16,185,129,0.04)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
      </div>
      {/* Firefly particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <span className="absolute top-[18%] left-[12%] w-1 h-1 rounded-full bg-amber-400/60 animate-pulse motion-reduce:animate-none" style={{ animationDelay: "0s", animationDuration: "2.4s" }} />
        <span className="absolute top-[35%] right-[18%] w-1.5 h-1.5 rounded-full bg-amber-300/40 animate-pulse motion-reduce:animate-none" style={{ animationDelay: "0.8s", animationDuration: "3.1s" }} />
        <span className="absolute top-[65%] left-[22%] w-1 h-1 rounded-full bg-amber-500/50 animate-pulse motion-reduce:animate-none" style={{ animationDelay: "1.5s", animationDuration: "2.7s" }} />
        <span className="absolute top-[55%] right-[8%] w-0.5 h-0.5 rounded-full bg-amber-400/70 animate-pulse motion-reduce:animate-none" style={{ animationDelay: "0.3s", animationDuration: "3.5s" }} />
        <span className="absolute top-[80%] left-[65%] w-1 h-1 rounded-full bg-amber-300/50 animate-pulse motion-reduce:animate-none" style={{ animationDelay: "2.1s", animationDuration: "2.9s" }} />
      </div>

      {/* ── NAV (Apple Floating Translucent Chrome) ── */}
      <header className="apple-glass-nav sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group apple-press-sm">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center group-hover:border-amber-400/60 group-hover:bg-amber-500/20 transition-all duration-150 shadow-xs">
              <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse motion-reduce:animate-none" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-mono apple-headline">
              FOG<span className="text-amber-500 dark:text-amber-400">GO</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1.5 text-sm font-medium">
            <Link
              href="/explore"
              className="hidden sm:inline px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/5 apple-press-sm"
            >
              {t.nav.explore}
            </Link>
            <Link
              href="/pricing"
              className="hidden sm:inline px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/5 apple-press-sm"
            >
              {t.nav.pricing}
            </Link>
            <LanguageSwitcher />
            <Link
              href="/login"
              className="hidden sm:inline px-3.5 py-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/5 apple-press-sm"
            >
              {t.common.login}
            </Link>
            <Link
              href="/register/student"
              className="ml-1 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/25 apple-press"
            >
              <span>{t.common.playNow}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ── one full screen, Apple fluid typography ── */}
      <section className="relative z-10 min-h-[calc(100vh-4rem)] flex flex-col justify-center pt-10 pb-16 px-6 max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div role="status" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none pixel-panel-amber bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{isVi ? "Foggo 2.0 · Đấu Trường Sinh Tồn Tri Thức Pixel Art" : "Foggo 2.0 · Pixel Art Survival Knowledge Arena"}</span>
          </div>
        </div>

        {/* H1 Optical Typography */}
        <h1 className="apple-display text-center text-5xl sm:text-6xl lg:text-7xl font-black max-w-4xl mx-auto text-slate-900 dark:text-white mb-6">
          {t.landing.heroTitle1}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 dark:from-amber-300 dark:via-amber-400 dark:to-amber-500">
            {t.landing.heroHighlight}
          </span>
        </h1>

        <p className="text-center text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          {t.landing.heroSubtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link
            href="/register/student"
            className="w-full sm:w-auto px-8 py-3.5 pixel-btn-amber text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-95 transition-transform"
          >
            <span>{isVi ? "Vào Chơi Miễn Phí" : "Play Now for Free"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 pixel-btn-neutral text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-sm active:scale-95 transition-transform"
          >
            <BookOpen className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span>{isVi ? "Dành Cho Giáo Viên & Lớp Học →" : "For Teachers & Classrooms →"}</span>
          </Link>
        </div>

        {/* App-frame: Pixel Battle Arena */}
        <div className="relative max-w-4xl mx-auto w-full">
          {/* Specular outer highlight */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-500/20 via-black/[0.03] dark:via-white/10 to-transparent pointer-events-none" />
          <div className="pixel-panel rounded-2xl overflow-hidden relative shadow-xl shadow-black/5 dark:shadow-2xl dark:shadow-black/80">
            {/* App chrome bar */}
            <div className="flex items-center justify-between gap-3 px-5 py-3 border-b-2 border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold apple-caption">
                <SunMedium className="w-4 h-4 text-amber-500" />
                <span>FOGGO · {t.landing.demoBadge}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-none border border-rose-500/30 flex items-center gap-1.5 shadow-[1.5px_1.5px_0_rgba(244,63,94,0.2)]">
                  <PixelItemIcon itemId="apple" size={14} /> HP 100/100
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-none border border-blue-500/30 flex items-center gap-1.5 shadow-[1.5px_1.5px_0_rgba(59,130,246,0.2)]">
                  <PixelItemIcon itemId="iron_shield" size={14} /> DEF -24%
                </span>
                <span className="text-amber-700 dark:text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-none border border-amber-500/30 flex items-center gap-1.5 shadow-[1.5px_1.5px_0_rgba(245,158,11,0.2)]">
                  <Coins className="w-3.5 h-3.5" /> {demoCoins} {t.common.coins}
                </span>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  title="Thử lại câu hỏi"
                  className="p-1 rounded-lg bg-black/[0.04] dark:bg-white/5 hover:bg-black/[0.08] dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Battle stage */}
            <div className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-b from-black/[0.01] to-black/[0.03] dark:from-slate-900/90 dark:via-slate-900/60 dark:to-[#020617] min-h-[190px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.06),transparent_70%)] pointer-events-none" />

              {/* Hero fighter */}
              <div className="flex flex-col items-center gap-2.5 z-10">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/15 via-amber-600/10 to-amber-500/5 dark:to-slate-900 border-2 border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/15 p-1 transition-transform ${demoHeroAnim === "sword_attack" ? "translate-x-3 scale-110" : demoHeroAnim === "hurt" ? "-translate-x-2 opacity-75" : ""}`}>
                    <PixelHero
                      weaponId="steel_sword"
                      armorId="knight_armor"
                      shieldId="iron_shield"
                      helmetId="iron_helmet"
                      size={86}
                      showShadow={false}
                    />
                  </div>
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-none bg-amber-500 text-slate-950 font-mono text-[9px] font-black border border-amber-600 shadow-sm">
                    Lv.5
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block mb-1 font-mono tracking-tight">{isVi ? "Hiệp Sĩ Hoàng Gia" : "Royal Knight"}</span>
                  <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-none border border-slate-400/40 dark:border-slate-700 overflow-hidden">
                    <div className="bg-rose-500 h-full w-full" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">100/100 HP</span>
                </div>
              </div>

              {/* Combat feedback */}
              <div className="flex flex-col items-center gap-2 z-10 text-center">
                <span className={`px-3 py-1 rounded-none border-2 font-mono text-xs font-bold flex items-center gap-1 shadow-sm transition-all ${demoFeedback.correct ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-400" : "bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-400"}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{demoFeedback.text}</span>
                </span>
                {demoFeedback.dmg > 0 ? (
                  <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-300 flex items-center justify-center gap-2 animate-bounce">
                    <PixelItemIcon itemId="steel_sword" size={24} />
                    <span>-{demoFeedback.dmg} DMG</span>
                  </span>
                ) : (
                  <span className="text-sm font-mono text-slate-500">
                    {isVi ? "Nhấp đáp án bên dưới để ra chiêu" : "Click an answer below to strike"}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{isVi ? `CHUỖI x${demoStreak}` : `COMBO x${demoStreak}`}</span>
                </span>
              </div>

              {/* Monster */}
              <div className="flex flex-col items-center gap-2.5 z-10">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-600/10 to-emerald-500/5 dark:to-slate-900 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/15 p-2 transition-all ${demoMonsterHp === 0 ? "opacity-30 grayscale rotate-12" : ""}`}>
                    <img
                      src="/sprites/baby_wolf/frame_1.png"
                      alt="Sói Con Rừng Sương"
                      className="w-18 h-18 object-contain pixelated -scale-x-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                    />
                  </div>
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-none bg-emerald-500 text-slate-950 font-mono text-[9px] font-black border border-emerald-600 shadow-sm">
                    {demoMonsterHp === 0 ? "Defeated" : "Monster"}
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300 block mb-1 font-mono tracking-tight">{isVi ? "Sói Con Rừng Sương" : "Mist Baby Wolf"}</span>
                  <div className="w-24 bg-slate-200 dark:bg-slate-800 h-2 rounded-none border border-slate-400/40 dark:border-slate-700 overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(demoMonsterHp / 40) * 100}%` }} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5 block">{demoMonsterHp}/40 HP</span>
                </div>
              </div>
            </div>

            {/* Question panel - Interactive Clickable Options */}
            <div className="p-5 border-t border-black/[0.04] dark:border-white/8 space-y-3 bg-black/[0.01] dark:bg-slate-950/60">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="text-amber-600 dark:text-amber-400 font-bold apple-caption flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isVi ? "Trải nghiệm trực tiếp · Click chọn đáp án để tấn công" : "Live Demo · Click option to test combat"}
                </span>
                <span>{isVi ? "Thời gian: 25s" : "Time: 25s"}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug apple-headline">
                {isVi
                  ? "Hành động nào sau đây là an toàn nhất khi nhận được tin nhắn kèm liên kết lạ từ người không quen?"
                  : "Which action is safest when receiving a message containing an unknown link from a stranger?"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {[
                  { key: "A", labelVi: "Bấm ngay vào liên kết để kiểm tra", labelEn: "Click the link immediately to verify" },
                  { key: "B", labelVi: "Không bấm và báo cáo tin nhắn rác", labelEn: "Do not click and report spam" },
                  { key: "C", labelVi: "Chuyển tiếp tin nhắn cho bạn bè", labelEn: "Forward the message to friends" },
                  { key: "D", labelVi: "Nhập thông tin để nhận quà", labelEn: "Submit credentials to claim rewards" },
                ].map((item) => {
                  const isSelected = demoSelected === item.key;
                  const isCorrect = item.key === "B";

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleSelectOption(item.key)}
                      className={`p-3.5 rounded-2xl border text-xs text-left flex items-center justify-between transition-all cursor-pointer apple-press-sm ${
                        isSelected && isCorrect
                          ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs"
                          : isSelected && !isCorrect
                          ? "bg-rose-500/10 border-rose-500/60 text-rose-800 dark:text-rose-300 font-bold shadow-xs"
                          : "bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.05] dark:border-white/8 text-slate-700 dark:text-slate-300 hover:border-amber-500/40"
                      }`}
                    >
                      <div>
                        <span className={`font-bold mr-2 font-mono ${isSelected && isCorrect ? "text-emerald-600" : isSelected && !isCorrect ? "text-rose-600" : "text-amber-500"}`}>
                          {item.key}.
                        </span>
                        {isVi ? item.labelVi : item.labelEn}
                      </div>
                      {isSelected && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── INSTITUTIONAL PROOF & METRICS (Commercial Grade) ── */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto w-full">
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono mb-1">4.5 Giờ</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Tiết kiệm mỗi tuần cho giáo viên soạn bài</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono mb-1">94%</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Học sinh hào hứng tham gia giờ ôn tập</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-blue-500 font-mono mb-1">100% RLS</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Bảo mật đáp án máy chủ chống gian lận F12</p>
          </div>
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/5 text-center">
            <div className="text-2xl sm:text-3xl font-black text-indigo-500 font-mono mb-1">COPPA</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Bảo vệ quyền riêng tư không cần email học sinh</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES: 3 Pillars with Pixel Bento ── */}
      <section className="relative z-10 py-20 px-6 max-w-6xl mx-auto border-t-2 border-black/[0.08] dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="pixel-panel rounded-2xl p-7 hover:-translate-y-1 transition-all duration-200 group shadow-md">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-4 group-hover:border-amber-500 transition-colors shadow-inner">
              <PixelItemIcon itemId="steel_sword" size={28} />
            </div>
            <h3 className="text-slate-900 dark:text-white font-mono font-bold text-base mb-2">{isVi ? "Săn Quái Theo Lượt" : "Turn-Based Combat"}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {isVi
                ? "Trả lời đúng để tung kiếm chém quái; sai sẽ bị phản đòn. Đánh bại quái để tiến sâu vào màn sương và mở khóa quái vật mới."
                : "Answer correctly to strike enemies; mistakes trigger counter-attacks. Defeat monsters to advance deeper through the fog."}
            </p>
          </div>

          {/* Card 2 */}
          <div className="pixel-panel rounded-2xl p-7 hover:-translate-y-1 transition-all duration-200 group shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-4 group-hover:border-blue-500 transition-colors shadow-inner">
              <PixelItemIcon itemId="iron_shield" size={28} />
            </div>
            <h3 className="text-slate-900 dark:text-white font-mono font-bold text-base mb-2">{t.battle.blacksmithTab}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {isVi
                ? "Tích lũy xu rèn Kiếm, Giáp, Khiên nâng chỉ số phòng thủ và mua bình máu cứu sinh tức thời khi cạn kiệt HP."
                : "Accumulate coins to forge weapons, armor, shields and stock up on emergency healing potions."}
            </p>
          </div>

          {/* Card 3 */}
          <div className="pixel-panel rounded-2xl p-7 hover:-translate-y-1 transition-all duration-200 group shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-4 group-hover:border-emerald-500 transition-colors shadow-inner">
              <PixelItemIcon itemId="gold_tusk" size={28} />
            </div>
            <h3 className="text-slate-900 dark:text-white font-mono font-bold text-base mb-2">{isVi ? "Đấu Trường Lớp & Solo" : "Classroom & Solo Grounds"}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              {isVi
                ? "Tự luyện 24/7 với ngân hàng câu hỏi đa dạng hoặc tham gia đấu trường hầm ngục tranh tài trực tiếp cùng cả lớp."
                : "Practice solo 24/7 with randomized question sets or join live classroom dungeon lobbies to compete on the leaderboard."}
            </p>
          </div>
        </div>
      </section>

      {/* ── TEACHER STEPS: Pixel Translucent Band ── */}
      <section className="relative z-10 py-20 px-6 border-y-2 border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
              {isVi ? "Khởi tạo thế giới lớp học" : "Ready for your classroom"}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-300">
                {isVi ? "trong 2 phút" : "in 2 minutes"}
              </span>
            </h2>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
              {isVi ? "3 bước đơn giản biến giờ ôn tập thành đấu trường sinh tồn kịch tính" : "3 simple steps to transform lessons into an epic survival arena"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="pixel-panel rounded-2xl p-7 text-left flex flex-col gap-4 hover:-translate-y-1 transition-all duration-200 group shadow-md">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-black flex items-center justify-center text-sm border-2 border-amber-500/40">
                  01
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-none bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 uppercase tracking-wider">
                  {isVi ? "8 dạng tương tác" : "8 Formats"}
                </span>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-mono font-bold text-base mb-2">{isVi ? "Tạo Đề Trong Nháy Mắt" : "Instant Quiz Creation"}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Tự soạn đề với Hotspot, Ghép cặp, Điền khuyết hoặc nhân bản ngay từ kho cộng đồng chỉ với 1 click."
                    : "Author quizzes with Hotspots, Matching, Fill-in-blanks or clone from community library in 1 click."}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="pixel-panel rounded-2xl p-7 text-left flex flex-col gap-4 hover:-translate-y-1 transition-all duration-200 group shadow-md">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-black flex items-center justify-center text-sm border-2 border-amber-500/40">
                  02
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-none bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 uppercase tracking-wider">
                  {isVi ? "Không cần PIN" : "No PIN"}
                </span>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-mono font-bold text-base mb-2">{isVi ? "Vào Chơi Tức Thì" : "Instant Join via QR"}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Chiếu mã QR lên máy chiếu hoặc gửi link. Học sinh nhập tên là tham gia ngay, không cần đăng ký tài khoản."
                    : "Project QR codes or send direct links. Students tap and enter their name to jump right in—no email needed."}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="pixel-panel rounded-2xl p-7 text-left flex flex-col gap-4 hover:-translate-y-1 transition-all duration-200 group shadow-md">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-mono font-black flex items-center justify-center text-sm border-2 border-amber-500/40">
                  03
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-none bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-white/10 uppercase tracking-wider">
                  {isVi ? "Thời gian thực" : "Real-Time"}
                </span>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-mono font-bold text-base mb-2">{isVi ? "Báo Cáo & Xếp Hạng" : "Live Leaderboard & Stats"}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isVi
                    ? "Theo dõi trực tiếp thứ hạng cả lớp, tự động phát hiện câu hỏi học sinh hay sai và xuất dữ liệu Excel dễ dàng."
                    : "Track live class standings, pinpoint common misconceptions, and export complete grade reports with ease."}
                </p>
              </div>
            </div>
          </div>

          {/* Close CTA */}
          <div className="mt-14 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 pixel-btn-amber text-base cursor-pointer shadow-lg active:scale-95 transition-transform"
            >
              <Star className="w-5 h-5" />
              <span>{isVi ? "Bắt Đầu Miễn Phí Cho Giáo Viên" : "Start Free for Teachers"}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── B2B SCHOOL & INSTITUTIONAL CALLOUT (Commercial Enterprise) ── */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> {isVi ? "Dành Cho Ban Giám Hiệu & Tổ Chuyên Môn" : "For School Principals & Dept Heads"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              {isVi ? "Triển Khai Foggo Bản Quyền Toàn Trường & Xuất Hóa Đơn VAT" : "Deploy Foggo District-Wide with Enterprise VAT Invoicing"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {isVi
                ? "Đồng bộ tài khoản toàn bộ giáo viên, quản lý ngân hàng câu hỏi nội bộ bảo mật, xuất điểm mẫu VNEDU / SMAS và hỗ trợ tập huấn chuyên môn trực tiếp."
                : "Synchronize faculty accounts, manage proprietary question banks, export school-grade SIS rosters, with on-site staff training."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center gap-2"
            >
              <span>{isVi ? "Xem Gói Trường Học B2B →" : "Explore School Tier →"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-black/[0.04] dark:border-white/8 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300">FOGGO · RPG Learning Web</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-150">
              {isVi ? "Điều khoản" : "Terms"}
            </Link>
            <Link href="/privacy" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-150">
              {isVi ? "Bảo mật" : "Privacy"}
            </Link>
            <Link href="/pricing" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-150">
              {t.nav.pricing}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
