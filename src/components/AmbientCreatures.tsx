"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface CreatureState {
  id: string;
  type: "slime" | "fox" | "wisp";
  startX: number; // percentage (0-100)
  startY: number; // px from bottom or top
  targetX: number;
  direction: "left" | "right";
  phase: "entering" | "roaming" | "peeking" | "clicked" | "leaving";
  frameIndex: number;
  speech?: string;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  icon: string;
  scale: number;
}

const CHEERFUL_QUOTES = [
  "Pẹp pẹp! Chúc bạn hôm nay học thật giỏi! 💧",
  "Óa! Bạn tinh mắt thật đấy, bắt được tớ rồi! ✨",
  "Gô Gô! Cùng nhau chinh phục hầm ngục nhé! 🦊🎒",
  "+100 May mắn cho lượt trả lời câu hỏi tiếp theo! 🌟",
  "Nghỉ ngơi mắt một xíu rồi tiếp tục thám hiểm nào! 🍀",
  "Kiến thức là sức mạnh tối thượng của dũng sĩ! ⚔️",
  "Pẹp! Foggo RPG luôn đồng hành cùng bạn! 💖",
];

export function AmbientCreatures() {
  const [creature, setCreature] = useState<CreatureState | null>(null);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [slimeFrame, setSlimeFrame] = useState<"jump" | "land" | "idle">("idle");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sinh các sinh vật ngẫu nhiên sau mỗi khoảng 20-35 giây
  useEffect(() => {
    // Tôn trọng cài đặt giảm chuyển động của người dùng
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;
    }

    function scheduleNextSpawn() {
      const delay = Math.random() * 15000 + 20000; // 20s đến 35s
      timerRef.current = setTimeout(() => {
        if (!document.hidden && !creature) {
          spawnRandomCreature();
        }
        scheduleNextSpawn();
      }, delay);
    }

    scheduleNextSpawn();

    // Lắng nghe tương tác nút chức năng để tạo hiệu ứng nhỏ
    function handleGlobalClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Nếu click vào nút có chức năng quan trọng (nhận quà, điểm danh, tạo đề, v.v.)
      const isImportantBtn = target.closest("button") || target.closest("a");
      if (isImportantBtn && Math.random() < 0.25 && !creature) {
        // 25% cơ hội xuất hiện sinh vật lấp ló chào mừng
        spawnPeekingCreature();
      }
    }

    window.addEventListener("click", handleGlobalClick);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [creature]);

  // Hoạt ảnh đổi khung hình cho bé Slime (nhảy -> tiếp đất -> đứng yên)
  useEffect(() => {
    if (creature?.type === "slime" && creature.phase !== "clicked") {
      let step = 0;
      frameIntervalRef.current = setInterval(() => {
        step = (step + 1) % 3;
        if (step === 0) setSlimeFrame("jump");
        else if (step === 1) setSlimeFrame("land");
        else setSlimeFrame("idle");
      }, 350);

      return () => {
        if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      };
    }
  }, [creature?.type, creature?.phase]);

  // Tự động kết thúc sau 7-9 giây nếu người chơi không bấm vào
  useEffect(() => {
    if (creature && creature.phase !== "clicked" && creature.phase !== "leaving") {
      const dismissTimer = setTimeout(() => {
        setCreature((prev) => (prev ? { ...prev, phase: "leaving" } : null));
        setTimeout(() => setCreature(null), 1200);
      }, 7500);

      return () => clearTimeout(dismissTimer);
    }
  }, [creature]);

  function spawnRandomCreature() {
    const types: Array<"slime" | "fox" | "wisp"> = ["slime", "fox", "wisp"];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const direction: "left" | "right" = Math.random() > 0.5 ? "left" : "right";

    const startX = direction === "left" ? -5 : 105;
    const targetX = direction === "left" ? 105 : -5;
    const startY = Math.floor(Math.random() * 25) + 15; // 15px - 40px từ đáy

    setCreature({
      id: Math.random().toString(),
      type: chosenType,
      startX,
      startY,
      targetX,
      direction,
      phase: "roaming",
      frameIndex: 0,
    });
  }

  function spawnPeekingCreature() {
    const types: Array<"slime" | "fox"> = ["slime", "fox"];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const startX = Math.floor(Math.random() * 70) + 15; // 15% - 85% chiều ngang màn hình

    setCreature({
      id: Math.random().toString(),
      type: chosenType,
      startX,
      startY: 0,
      targetX: startX,
      direction: Math.random() > 0.5 ? "left" : "right",
      phase: "peeking",
      frameIndex: 0,
    });
  }

  // Khi người chơi chạm/click vào sinh vật
  function handleCreatureClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!creature || creature.phase === "clicked") return;

    const randomQuote = CHEERFUL_QUOTES[Math.floor(Math.random() * CHEERFUL_QUOTES.length)];

    // Bắn hạt lấp lánh (sparkles) xung quanh
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newSparkles: SparkleParticle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2 + (Math.random() * 60 - 30),
      y: rect.top - 20 + (Math.random() * 40 - 20),
      icon: ["✨", "⭐", "💖", "🌟", "🐾"][Math.floor(Math.random() * 5)],
      scale: Math.random() * 0.5 + 0.8,
    }));

    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1400);

    setCreature((prev) =>
      prev
        ? {
            ...prev,
            phase: "clicked",
            speech: randomQuote,
          }
        : null
    );

    // Sau khi phản hồi, sinh vật vui mừng phóng đi
    setTimeout(() => {
      setCreature((prev) => (prev ? { ...prev, phase: "leaving" } : null));
      setTimeout(() => setCreature(null), 800);
    }, 2200);
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Các hạt sao lấp lánh khi tương tác */}
      {sparkles.map((sp) => (
        <span
          key={sp.id}
          className="fixed text-base animate-ping duration-700 pointer-events-none"
          style={{
            left: `${sp.x}px`,
            top: `${sp.y}px`,
            transform: `scale(${sp.scale})`,
          }}
        >
          {sp.icon}
        </span>
      ))}

      {/* Sinh vật xuất hiện và chạy qua nền */}
      {creature && (
        <div
          onClick={handleCreatureClick}
          className={`fixed pointer-events-auto cursor-pointer transition-transform duration-300 group ${
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
                  ? "foggo-walk-ltr 8s cubic-bezier(0.25, 1, 0.5, 1) forwards"
                  : "foggo-walk-rtl 8s cubic-bezier(0.25, 1, 0.5, 1) forwards"
                : creature.phase === "peeking"
                ? "foggo-peek 4.5s ease-in-out forwards"
                : creature.phase === "leaving"
                ? "foggo-dash-away 0.7s ease-in forwards"
                : undefined,
            transform:
              creature.direction === "left" ? "scaleX(1)" : "scaleX(-1)",
          }}
          title="Bấm vào tớ xem có gì nào!"
        >
          {/* Bong bóng lời thoại khi được người dùng bấm vào */}
          {creature.speech && (
            <div
              className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-amber-500/40 text-[11px] font-bold text-slate-900 dark:text-amber-300 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-75 duration-200 z-30"
              style={{
                transform:
                  creature.direction === "right" ? "scaleX(-1)" : "scaleX(1)",
              }}
            >
              <span>{creature.speech}</span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white/95 dark:border-t-slate-900/95" />
            </div>
          )}

          {/* Sinh vật 1: Bé Slime (Sprite động) */}
          {creature.type === "slime" && (
            <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow(0 4px 8px rgba(16, 185, 129, 0.35)) hover:scale-125 transition-transform">
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
              {/* Bóng đổ của Slime */}
              <div className="absolute -bottom-1 left-2 right-2 h-1.5 bg-black/20 dark:bg-black/40 rounded-full blur-[1px]" />
            </div>
          )}

          {/* Sinh vật 2: Bé Cáo Foggo (Explorer Fox SVG) */}
          {creature.type === "fox" && (
            <div className="relative w-14 h-14 flex items-center justify-center filter drop-shadow(0 4px 10px rgba(245, 158, 11, 0.4)) hover:scale-125 transition-transform">
              <svg
                viewBox="0 0 64 64"
                className="w-12 h-12 select-none pointer-events-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Đuôi cáo xù */}
                <path
                  d="M12 36C8 30 10 20 18 16C24 13 28 22 24 30C20 38 14 40 12 36Z"
                  fill="#EA580C"
                />
                <path
                  d="M16 17C14 19 12 24 14 27C15 25 17 22 20 20C18 18 17 17 16 17Z"
                  fill="#FFF7ED"
                />
                {/* Thân cáo */}
                <ellipse cx="32" cy="40" rx="14" ry="11" fill="#F97316" />
                {/* Ba lô dũng sĩ */}
                <rect x="23" y="32" width="7" height="9" rx="2" fill="#B45309" />
                <rect x="24" y="34" width="5" height="3" rx="1" fill="#FCD34D" />
                {/* Chân trước & sau */}
                <ellipse cx="24" cy="50" rx="3" ry="3.5" fill="#C2410C" />
                <ellipse cx="40" cy="50" rx="3" ry="3.5" fill="#C2410C" />
                {/* Đầu cáo */}
                <circle cx="44" cy="30" r="11" fill="#F97316" />
                {/* Tai cáo nhọn */}
                <polygon points="38,14 44,22 36,24" fill="#EA580C" />
                <polygon points="48,14 46,24 54,22" fill="#EA580C" />
                <polygon points="39,17 43,22 38,23" fill="#FFF7ED" />
                <polygon points="48,17 46,23 52,22" fill="#FFF7ED" />
                {/* Má trắng & Mõm */}
                <path
                  d="M40 33C40 33 44 38 52 35C52 35 48 30 44 28C41 30 40 33 40 33Z"
                  fill="#FFF7ED"
                />
                {/* Mắt tròn đen */}
                <circle cx="45" cy="28" r="1.8" fill="#0F172A" />
                <circle cx="44.5" cy="27.5" r="0.6" fill="#FFFFFF" />
                {/* Mũi đen nhỏ */}
                <circle cx="52" cy="34" r="1.3" fill="#0F172A" />
              </svg>
              {/* Vết chân ma thuật */}
              <div className="absolute -bottom-1 left-2 text-[9px] opacity-70 animate-ping">
                🐾
              </div>
            </div>
          )}

          {/* Sinh vật 3: Tinh Linh Sáng (Whimsical Star Wisp) */}
          {creature.type === "wisp" && (
            <div className="relative w-10 h-10 flex items-center justify-center filter drop-shadow(0 0 14px rgba(56, 189, 248, 0.7)) hover:scale-130 transition-transform">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-300 to-amber-200 animate-pulse flex items-center justify-center shadow-lg shadow-sky-400/50">
                <span className="text-xs">✨</span>
              </div>
              {/* Hào quang lượn lờ */}
              <div className="absolute inset-0 rounded-full border border-sky-400/40 animate-ping duration-1000" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
