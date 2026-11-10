"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Heart, Flame } from "lucide-react";

interface CuteSlimeLoadingProps {
  title?: string;
  subtitle?: string;
  variant?: "fullscreen" | "card" | "compact";
}

const CUTE_MESSAGES = [
  "Bé Slime đang khởi động nhún nhảy nè... ✨",
  "Đang thắp sáng đèn lồng và xua bớt sương mù... 🔥",
  "Đom Đóm đang bay đến soi đường cho bạn... 🪲",
  "Đang chuẩn bị câu đố siêu thú vị luôn á... 🎒",
  "Chờ một xíu xiu thôi nhen, sắp xong rồi! (´｡• ᵕ •｡`)",
];

// Thứ tự sprite tạo hoạt họa nhún nhảy tự nhiên
const SLIME_FRAMES = [
  "/sprites/slime_idle_1_clean.png",
  "/sprites/slime_prep_clean.png",
  "/sprites/slime_jump_clean.png",
  "/sprites/slime_land_clean.png",
  "/sprites/slime_idle_2_clean.png",
];

export function CuteSlimeLoading({
  title,
  subtitle,
  variant = "fullscreen",
}: CuteSlimeLoadingProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Đổi frame sprite mỗi 250ms
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SLIME_FRAMES.length);
    }, 250);
    return () => clearInterval(timer);
  }, []);

  // Xoay vòng câu nói dễ thương mỗi 2.8s
  useEffect(() => {
    if (title) return; // Nếu có title cố định thì không xoay
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % CUTE_MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [title]);

  const activeMessage = title || CUTE_MESSAGES[messageIndex];
  const activeSprite = SLIME_FRAMES[frameIndex];

  // 1. Dạng Compact (Dùng cho nút bấm, thanh trạng thái nhỏ)
  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-300 font-mono text-xs shadow-lg backdrop-blur-md">
        <div className="relative w-5 h-5 shrink-0 pixelated animate-bounce">
          <Image
            src="/sprites/slime_idle_1_clean.png"
            alt="Slime"
            width={20}
            height={20}
            className="pixelated object-contain"
            unoptimized
          />
        </div>
        <span className="font-semibold tracking-wide">
          {title || "Đang tải xíu nhen..."}
        </span>
      </div>
    );
  }

  // 2. Dạng Card hoặc Fullscreen
  return (
    <div
      className={
        variant === "fullscreen"
          ? "fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-slate-100 select-none px-4"
          : "relative w-full py-12 flex flex-col items-center justify-center text-slate-100 select-none px-4"
      }
    >
      {/* Tia laser chạy trên đỉnh (chỉ ở fullscreen) */}
      {variant === "fullscreen" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden z-50">
          <div className="h-full w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-loading-bar" />
        </div>
      )}

      {/* Quầng sáng sương mù huyền ảo đằng sau */}
      <div className="absolute w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Đom đóm lơ lửng xung quanh */}
      <div className="absolute -top-10 left-1/4 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-firefly-drift" />
      <div
        className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#10b981] animate-firefly-drift"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d] animate-firefly-drift"
        style={{ animationDelay: "2.1s" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Bóng thoại dễ thương phía trên Slime */}
        <div className="relative mb-4 animate-cute-float">
          <div className="relative bg-slate-900/90 border-2 border-emerald-500/40 px-4 py-2 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.2)] text-emerald-300 font-mono text-xs sm:text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-spin" />
            <span className="transition-all duration-300">{activeMessage}</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 fill-rose-400 animate-pulse" />
          </div>
          {/* Mũi nhọn bóng thoại */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r-2 border-b-2 border-emerald-500/40 rotate-45" />
        </div>

        {/* Khu vực Bé Slime nhún nhảy */}
        <div className="relative w-28 h-28 flex flex-col items-center justify-end pb-3">
          {/* Bé Slime với chuyển động bouncy squish */}
          <div className="relative z-10 w-20 h-20 pixelated animate-slime-bounce cursor-pointer hover:scale-110 transition-transform">
            <Image
              src={activeSprite}
              alt="Bé Slime Foggo"
              width={80}
              height={80}
              className="pixelated object-contain drop-shadow-[0_8px_16px_rgba(16,185,129,0.4)]"
              unoptimized
              priority
            />
          </div>

          {/* Bóng đổ dưới chân Slime co giãn theo nhịp nhảy */}
          <div className="w-14 h-3 rounded-full bg-slate-950/80 border border-slate-900/60 blur-[1px] animate-slime-shadow" />
        </div>

        {/* Tên thương hiệu Foggo Retro */}
        <div className="mt-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-mono text-sm tracking-widest text-slate-400 uppercase font-bold">
            FOG<span className="text-amber-400">GO</span> · ADVENTURE
          </span>
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>

        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Thanh Pixel Progress Bar siêu đẹp */}
        <div className="mt-4 flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl shadow-inner">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isLit = idx <= (frameIndex % 6);
            return (
              <div
                key={idx}
                className={`w-4 h-2 rounded-[3px] transition-all duration-200 ${
                  isLit
                    ? "bg-gradient-to-t from-emerald-500 to-amber-300 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                    : "bg-slate-800"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
