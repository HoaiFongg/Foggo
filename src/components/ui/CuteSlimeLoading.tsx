"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/useLanguage";

interface CuteSlimeLoadingProps {
  title?: string;
  subtitle?: string;
  variant?: "fullscreen" | "card" | "compact";
}

// Thứ tự sprite tạo hoạt họa nảy tự nhiên
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
  const { isEn } = useLanguage();
  const [frameIndex, setFrameIndex] = useState(0);

  // Đổi frame sprite mỗi 250ms
  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SLIME_FRAMES.length);
    }, 250);
    return () => clearInterval(timer);
  }, []);

  const activeSprite = SLIME_FRAMES[frameIndex];

  // 1. Dạng Compact
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
          {title || (isEn ? "Loading..." : "Đang tải...")}
        </span>
      </div>
    );
  }

  // 2. Dạng Card hoặc Fullscreen (Chỉ hiển thị Slime nảy sạch sẽ, chuyên nghiệp)
  return (
    <div
      className={
        variant === "fullscreen"
          ? "fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-slate-100 select-none px-4"
          : "relative w-full py-10 flex flex-col items-center justify-center text-slate-100 select-none px-4"
      }
    >
      {/* Tia laser trên đỉnh khi fullscreen */}
      {variant === "fullscreen" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900 overflow-hidden z-50">
          <div className="h-full w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-loading-bar" />
        </div>
      )}

      {/* Ánh sáng nền dịu nhẹ */}
      <div className="absolute w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Hình bé Slime nảy sạch sẽ, không có bong bóng chữ rườm rà */}
        <div className="relative w-28 h-28 flex flex-col items-center justify-end pb-2">
          <div className="relative z-10 w-20 h-20 pixelated animate-slime-bounce">
            <Image
              src={activeSprite}
              alt="Slime"
              width={80}
              height={80}
              className="pixelated object-contain drop-shadow-[0_8px_16px_rgba(16,185,129,0.35)]"
              unoptimized
              priority
            />
          </div>
          <div className="w-14 h-3 rounded-full bg-slate-950/80 border border-slate-900/60 blur-[1px] animate-slime-shadow" />
        </div>

        {/* Tiêu đề ngắn gọn chuyên nghiệp */}
        <p className="mt-3 font-mono text-xs font-bold text-slate-400 tracking-wider uppercase">
          {title || (isEn ? "Loading..." : "Đang tải dữ liệu...")}
        </p>

        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed font-sans">
            {subtitle}
          </p>
        )}

        {/* Thanh Pixel Progress Bar thanh lịch */}
        <div className="mt-3.5 flex items-center gap-1.5 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl shadow-inner">
          {[0, 1, 2, 3, 4, 5].map((idx) => {
            const isLit = idx <= (frameIndex % 6);
            return (
              <div
                key={idx}
                className={`w-3.5 h-1.5 rounded-[2px] transition-all duration-200 ${
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
