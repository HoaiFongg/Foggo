"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

interface CreatureState {
  id: string;
  type: "baby_wolf" | "slime" | "hero" | "goblin";
  startX: number; // percentage (0-100)
  startY: number; // px from bottom
  direction: "left" | "right";
  phase: "roaming" | "peeking" | "clicked" | "leaving";
  speech?: string;
}

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  dx: number;
  dy: number;
}

const RPG_CREATURE_QUOTES = [
  "Gâu gâu! Chúc dũng sĩ vượt ải học tập đại thành công! 🐾✨",
  "Pẹp pẹp! Tớ là Slime tri thức, tặng bạn +100 May Mắn! 💧🍀",
  "Hiệp sĩ Foggo: Kiếm sắc không bằng trí tuệ sáng ngời! ⚔️🌟",
  "Hehe! Bạn phát hiện ra tớ rồi, thưởng 10 Điểm Nhanh Trí! 👺💎",
  "Nghỉ ngơi mắt một xíu, uống nước rồi tiếp tục thám hiểm nào! 🍎💖",
  "Một câu hỏi đúng hôm nay là một bước tiến gần danh hiệu Dũng Sĩ! 🏆📜",
  "Vũ khí mạnh nhất trong hầm ngục Foggo chính là Kiến Thức! 🛡️⚡",
];

const CLICK_SYMBOLS = ["✦", "✧", "★", "♦", "●", "◆"];
const CLICK_COLORS = ["#fbbf24", "#38bdf8", "#34d399", "#f43f5e", "#a855f7"];

export function PixelAnimatedBackground() {
  const [creature, setCreature] = useState<CreatureState | null>(null);
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);
  const [slimeFrame, setSlimeFrame] = useState<"jump" | "land" | "idle">("idle");
  const [wolfFrame, setWolfFrame] = useState<"run" | "jump">("run");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Quản lý sinh vật xuất hiện định kỳ (18s - 32s)
  const spawnCreature = useCallback(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || document.hidden || creature) return;

    const types: Array<"baby_wolf" | "slime" | "hero" | "goblin"> = [
      "baby_wolf",
      "slime",
      "hero",
      "goblin",
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const isPeeking = Math.random() < 0.3; // 30% lấp ló từ cạnh dưới
    const direction: "left" | "right" = Math.random() > 0.5 ? "left" : "right";

    if (isPeeking) {
      setCreature({
        id: Math.random().toString(),
        type,
        startX: Math.floor(Math.random() * 65) + 15,
        startY: 12,
        direction,
        phase: "peeking",
      });
    } else {
      setCreature({
        id: Math.random().toString(),
        type,
        startX: direction === "left" ? -5 : 105,
        startY: Math.floor(Math.random() * 20) + 12,
        direction,
        phase: "roaming",
      });
    }
  }, [creature]);

  useEffect(() => {
    function scheduleNext() {
      const delay = Math.random() * 14000 + 18000; // 18s - 32s
      timerRef.current = setTimeout(() => {
        spawnCreature();
        scheduleNext();
      }, delay);
    }

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [spawnCreature]);

  // Hoạt ảnh đổi frame cho Slime và Sói con khi đang chạy
  useEffect(() => {
    if (!creature || creature.phase === "clicked") return;

    if (creature.type === "slime") {
      let step = 0;
      animIntervalRef.current = setInterval(() => {
        step = (step + 1) % 3;
        setSlimeFrame(step === 0 ? "jump" : step === 1 ? "land" : "idle");
      }, 320);
    } else if (creature.type === "baby_wolf") {
      let step = 0;
      animIntervalRef.current = setInterval(() => {
        step = (step + 1) % 4;
        setWolfFrame(step === 2 ? "jump" : "run");
      }, 260);
    }

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [creature?.type, creature?.phase]);

  // Tự động rút lui sau 8 giây nếu không được click
  useEffect(() => {
    if (creature && creature.phase !== "clicked" && creature.phase !== "leaving") {
      const dismissTimer = setTimeout(() => {
        setCreature((prev) => (prev ? { ...prev, phase: "leaving" } : null));
        setTimeout(() => setCreature(null), 1000);
      }, 7500);

      return () => clearTimeout(dismissTimer);
    }
  }, [creature]);

  // 2. Tương tác Click trên toàn màn hình (Tạo hiệu ứng Pixel Sparkles)
  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      // Bắn 4-5 hạt pixel lấp lánh tại tọa độ con trỏ chuột
      const newParticles: ClickParticle[] = Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * (Math.PI * 2)) / 5 + (Math.random() * 0.4 - 0.2);
        const speed = Math.random() * 28 + 16;
        return {
          id: Date.now() + i + Math.random(),
          x: e.clientX,
          y: e.clientY,
          symbol: CLICK_SYMBOLS[Math.floor(Math.random() * CLICK_SYMBOLS.length)],
          color: CLICK_COLORS[Math.floor(Math.random() * CLICK_COLORS.length)],
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed - 12,
        };
      });

      setClickParticles((prev) => [...prev.slice(-15), ...newParticles]);

      // Tự dọn dẹp particles sau 750ms
      setTimeout(() => {
        setClickParticles((prev) =>
          prev.filter((p) => !newParticles.some((np) => np.id === p.id))
        );
      }, 750);
    }

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // Xử lý khi người chơi bấm trực tiếp vào sinh vật
  function handleCreatureClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!creature || creature.phase === "clicked") return;

    const randomQuote =
      RPG_CREATURE_QUOTES[Math.floor(Math.random() * RPG_CREATURE_QUOTES.length)];

    setCreature((prev) =>
      prev
        ? {
            ...prev,
            phase: "clicked",
            speech: randomQuote,
          }
        : null
    );

    // Sau 2.2 giây sinh vật vui mừng chạy đi
    setTimeout(() => {
      setCreature((prev) => (prev ? { ...prev, phase: "leaving" } : null));
      setTimeout(() => setCreature(null), 800);
    }, 2400);
  }

  return (
    <>
      {/* =================================================================== */}
      {/* 1. LỚP BẦU TRỜI & MÂY PIXEL TRÔI ĐỘNG (PIXEL CLOUD PARALLAX DRIFT)    */}
      {/* =================================================================== */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* =================================================================== */}
        {/* MÂY XANH PIXEL TRÔI ĐỘNG (VIBRANT SKY-BLUE RETRO PIXEL CLOUDS)       */}
        {/* =================================================================== */}
        {/* Mây Pixel 1: Tầng cao, trôi chậm êm dịu */}
        <div
          className="absolute top-[4%] -left-[200px] w-72 h-18 opacity-85 dark:opacity-60 animate-[pixelCloudDriftSlow_80s_linear_infinite]"
          style={{ willChange: "transform" }}
        >
          <svg viewBox="0 0 128 32" className="w-full h-full drop-shadow-[0_4px_8px_rgba(2,132,199,0.25)]" shapeRendering="crispEdges">
            {/* Đổ bóng đáy mây xanh đậm */}
            <rect x="0" y="20" width="128" height="6" fill="#0284c7" />
            <rect x="12" y="16" width="104" height="6" fill="#0284c7" />
            {/* Thân mây xanh da trời chính */}
            <rect x="0" y="16" width="128" height="4" fill="#38bdf8" />
            <rect x="12" y="10" width="104" height="6" fill="#38bdf8" />
            <rect x="24" y="6" width="80" height="6" fill="#38bdf8" />
            {/* Viền sáng đỉnh mây xanh ngọc lấp lánh */}
            <rect x="36" y="2" width="56" height="4" fill="#bae6fd" />
            <rect x="44" y="0" width="40" height="2" fill="#e0f2fe" />
          </svg>
        </div>

        {/* Mây Pixel 2: Tầng giữa */}
        <div
          className="absolute top-[13%] -left-[280px] w-96 h-24 opacity-90 dark:opacity-65 animate-[pixelCloudDriftMed_60s_linear_infinite]"
          style={{ animationDelay: "-25s", willChange: "transform" }}
        >
          <svg viewBox="0 0 160 40" className="w-full h-full drop-shadow-[0_4px_10px_rgba(14,165,233,0.3)]" shapeRendering="crispEdges">
            {/* Đáy mây xanh sẫm */}
            <rect x="0" y="26" width="160" height="8" fill="#0369a1" />
            <rect x="16" y="22" width="128" height="6" fill="#0284c7" />
            {/* Thân mây xanh cyan */}
            <rect x="0" y="20" width="160" height="6" fill="#0ea5e9" />
            <rect x="16" y="12" width="128" height="10" fill="#38bdf8" />
            <rect x="28" y="8" width="104" height="6" fill="#38bdf8" />
            {/* Đỉnh mây phát sáng xanh ngọc */}
            <rect x="40" y="4" width="76" height="4" fill="#7dd3fc" />
            <rect x="52" y="0" width="52" height="4" fill="#bae6fd" />
          </svg>
        </div>

        {/* Mây Pixel 3: Tầng thấp hơn */}
        <div
          className="absolute top-[22%] -left-[220px] w-64 h-16 opacity-75 dark:opacity-50 animate-[pixelCloudDriftFast_95s_linear_infinite]"
          style={{ animationDelay: "-50s", willChange: "transform" }}
        >
          <svg viewBox="0 0 112 28" className="w-full h-full drop-shadow-[0_3px_6px_rgba(2,132,199,0.2)]" shapeRendering="crispEdges">
            <rect x="0" y="18" width="112" height="6" fill="#0284c7" />
            <rect x="8" y="12" width="96" height="8" fill="#38bdf8" />
            <rect x="20" y="6" width="72" height="8" fill="#38bdf8" />
            <rect x="32" y="2" width="48" height="4" fill="#bae6fd" />
          </svg>
        </div>

        {/* =================================================================== */}
        {/* 2. CÁC HẠT ĐỐM SÁNG / BÀO TỬ PIXEL BAY LƠ LỬNG (PIXEL SPORES)        */}
        {/* =================================================================== */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Hạt 1 */}
          <div
            className="absolute left-[15%] w-2 h-2 rounded-none bg-amber-400/50 dark:bg-amber-300/60 animate-[pixelSporeFloat_18s_linear_infinite] shadow-[0_0_6px_#fbbf24]"
            style={{ animationDelay: "0s" }}
          />
          {/* Hạt 2 */}
          <div
            className="absolute left-[35%] w-1.5 h-1.5 rounded-none bg-emerald-400/50 dark:bg-emerald-300/60 animate-[pixelSporeFloat_22s_linear_infinite] shadow-[0_0_5px_#34d399]"
            style={{ animationDelay: "-6s" }}
          />
          {/* Hạt 3 */}
          <div
            className="absolute left-[58%] w-2 h-2 rounded-none bg-sky-400/50 dark:bg-sky-300/60 animate-[pixelSporeFloat_19s_linear_infinite] shadow-[0_0_6px_#38bdf8]"
            style={{ animationDelay: "-12s" }}
          />
          {/* Hạt 4 */}
          <div
            className="absolute left-[78%] w-1.5 h-1.5 rounded-none bg-amber-400/60 dark:bg-amber-300/70 animate-[pixelSporeFloat_24s_linear_infinite] shadow-[0_0_5px_#fbbf24]"
            style={{ animationDelay: "-4s" }}
          />
          {/* Hạt 5 */}
          <div
            className="absolute left-[92%] w-2 h-2 rounded-none bg-rose-400/50 dark:bg-rose-300/60 animate-[pixelSporeFloat_20s_linear_infinite] shadow-[0_0_6px_#f43f5e]"
            style={{ animationDelay: "-9s" }}
          />
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. HIỆU ỨNG PIXEL TƯƠNG TÁC KHI CLICK CHUỘT (CLICK SPARKLES)         */}
      {/* =================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
        {clickParticles.map((pt) => (
          <span
            key={pt.id}
            className="fixed text-xs font-mono font-black select-none pointer-events-none transition-transform duration-700 ease-out animate-[pixelClickSparkle_0.75s_ease-out_forwards]"
            style={{
              left: `${pt.x + pt.dx}px`,
              top: `${pt.y + pt.dy}px`,
              color: pt.color,
              textShadow: `0 0 8px ${pt.color}`,
            }}
          >
            {pt.symbol}
          </span>
        ))}
      </div>

      {/* =================================================================== */}
      {/* 4. SINH VẬT PIXEL ART XUẤT HIỆN VÀ TƯƠNG TÁC (AMBIENT CREATURES)    */}
      {/* =================================================================== */}
      {creature && (
        <div
          onClick={handleCreatureClick}
          className={`fixed pointer-events-auto cursor-pointer transition-transform duration-300 group z-30 ${
            creature.phase === "clicked"
              ? "animate-bounce scale-110"
              : creature.phase === "peeking"
              ? "animate-pulse"
              : ""
          }`}
          style={{
            bottom: `${creature.startY}px`,
            left:
              creature.phase === "peeking"
                ? `${creature.startX}%`
                : creature.direction === "left"
                ? "auto"
                : undefined,
            right:
              creature.phase === "peeking"
                ? undefined
                : creature.direction === "left"
                ? undefined
                : "auto",
            animation:
              creature.phase === "roaming"
                ? creature.direction === "left"
                  ? "foggo-walk-ltr 8.5s cubic-bezier(0.25, 1, 0.5, 1) forwards"
                  : "foggo-walk-rtl 8.5s cubic-bezier(0.25, 1, 0.5, 1) forwards"
                : creature.phase === "peeking"
                ? "foggo-peek 4.5s ease-in-out forwards"
                : creature.phase === "leaving"
                ? "foggo-dash-away 0.7s ease-in forwards"
                : undefined,
            transform:
              creature.direction === "left" ? "scaleX(1)" : "scaleX(-1)",
          }}
          title="Bấm vào tớ xem có quà gì nào!"
        >
          {/* Bong bóng thoại Pixel khi người chơi click vào */}
          {creature.speech && (
            <div
              className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border-2 border-amber-500 text-xs font-mono font-bold text-slate-900 dark:text-amber-300 shadow-[0_4px_12px_rgba(0,0,0,0.2)] backdrop-blur-md animate-in fade-in zoom-in-75 duration-200 z-40"
              style={{
                transform:
                  creature.direction === "right" ? "scaleX(-1)" : "scaleX(1)",
              }}
            >
              <span>{creature.speech}</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-amber-500" />
            </div>
          )}

          {/* Sinh vật 1: Bé Sói Con Rừng Sương (`baby_wolf`) */}
          {creature.type === "baby_wolf" && (
            <div className="relative w-14 h-14 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:scale-125 transition-transform">
              <Image
                src={
                  wolfFrame === "jump"
                    ? "/sprites/baby_wolf_jump.png"
                    : "/sprites/baby_wolf_run.png"
                }
                alt="Baby Wolf"
                width={56}
                height={56}
                className="pixelated select-none pointer-events-none"
                priority
              />
              <div className="absolute -bottom-1 left-2 right-2 h-1.5 bg-black/25 dark:bg-black/50 rounded-full blur-[1px]" />
            </div>
          )}

          {/* Sinh vật 2: Bé Slime Rừng Xanh (`slime`) */}
          {creature.type === "slime" && (
            <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(16,185,129,0.35)] hover:scale-125 transition-transform">
              <Image
                src={
                  slimeFrame === "jump"
                    ? "/sprites/slime_jump_clean.png"
                    : slimeFrame === "land"
                    ? "/sprites/slime_land_clean.png"
                    : "/sprites/slime_idle_1_clean.png"
                }
                alt="Slime"
                width={48}
                height={48}
                className="pixelated select-none pointer-events-none"
                priority
              />
              <div className="absolute -bottom-1 left-2 right-2 h-1.5 bg-black/25 dark:bg-black/50 rounded-full blur-[1px]" />
            </div>
          )}

          {/* Sinh vật 3: Hiệp Sĩ Tí Hon Tuần Tra (`hero`) */}
          {creature.type === "hero" && (
            <div className="relative w-14 h-14 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(245,158,11,0.4)] hover:scale-125 transition-transform">
              <Image
                src={
                  creature.phase === "clicked"
                    ? "/sprites/hero/victory.png"
                    : "/sprites/hero/walk.png"
                }
                alt="Chibi Knight Patrol"
                width={56}
                height={56}
                className="pixelated select-none pointer-events-none"
                priority
              />
              <div className="absolute -bottom-1 left-2 right-2 h-1.5 bg-black/25 dark:bg-black/50 rounded-full blur-[1px]" />
            </div>
          )}

          {/* Sinh vật 4: Yêu Tinh Rừng Lém Lỉnh (`goblin`) */}
          {creature.type === "goblin" && (
            <div className="relative w-14 h-14 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(220,38,38,0.35)] hover:scale-125 transition-transform">
              <Image
                src={
                  creature.phase === "clicked"
                    ? "/sprites/goblin/happy.png"
                    : "/sprites/goblin/jump.png"
                }
                alt="Forest Goblin"
                width={56}
                height={56}
                className="pixelated select-none pointer-events-none"
                priority
              />
              <div className="absolute -bottom-1 left-2 right-2 h-1.5 bg-black/25 dark:bg-black/50 rounded-full blur-[1px]" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
