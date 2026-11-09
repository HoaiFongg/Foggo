"use client";

import { useRef } from "react";
import { Crosshair, MapPin } from "lucide-react";
import type { PlayerProps } from "../types";
import type { HotspotContent, HotspotUserAnswer } from "./schema";

export function HotspotPlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<HotspotContent, HotspotUserAnswer>) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normalizedX = Math.max(0, Math.min(1, clickX / rect.width));
    const normalizedY = Math.max(0, Math.min(1, clickY / rect.height));

    onChange({
      x: Number(normalizedX.toFixed(4)),
      y: Number(normalizedY.toFixed(4)),
    });
  }

  const hasSelected = value && typeof value.x === "number" && typeof value.y === "number";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
      {/* Tiêu đề câu hỏi */}
      <div className="py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block mb-1">
          Chạm vào điểm yếu (Hotspot)
        </span>
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug font-sans">
          {content?.prompt || "Chạm vào vị trí chính xác trên ảnh:"}
        </h2>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          {hasSelected
            ? "Đã đánh dấu tọa độ! Nhấn nộp câu trả lời để tấn công."
            : "Chạm hoặc click lên ảnh để chọn vị trí mục tiêu."}
        </p>
      </div>

      {/* Vùng ảnh tương tác */}
      <div className="p-2 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col items-center max-h-[36vh] overflow-y-auto">
        {content?.image_url ? (
          <div
            ref={containerRef}
            onClick={handleImageClick}
            className={`relative max-w-full rounded-xl overflow-hidden border-2 select-none touch-none ${
              disabled
                ? "cursor-not-allowed opacity-80 border-slate-800"
                : "cursor-crosshair border-amber-500/40 hover:border-amber-400"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Mục tiêu Hotspot"
              className="w-full h-auto max-h-[220px] object-contain pointer-events-none block"
            />

            {/* Điểm ngắm mục tiêu */}
            {hasSelected && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 z-20 flex flex-col items-center"
                style={{
                  left: `${value.x * 100}%`,
                  top: `${value.y * 100}%`,
                }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-amber-500/30 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-amber-500/40 border-2 border-amber-400 flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-200" />
                  </div>
                  <Crosshair className="absolute w-10 h-10 text-amber-400/80 pointer-events-none" />
                </div>
                <span className="mt-1 bg-slate-950/90 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/40 shadow">
                  Mục tiêu
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-sm">
            Chưa có ảnh minh họa cho câu hỏi này
          </div>
        )}
      </div>
    </div>
  );
}

