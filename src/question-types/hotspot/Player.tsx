"use client";

import { useRef } from "react";
import { Crosshair } from "lucide-react";
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
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Tiêu đề câu hỏi Google Material 3 (Bo góc lớn 24px, nền sáng, bóng nhẹ) */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#4285F4]/30 inline-block">
          Chạm vào điểm yếu (Hotspot)
        </span>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans px-2">
          {content?.prompt || "Chạm vào vị trí chính xác trên ảnh:"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
          {hasSelected
            ? "Đã đánh dấu tọa độ! Nhấn nộp câu trả lời để tấn công."
            : "Chạm hoặc click lên ảnh để chọn vị trí mục tiêu."}
        </p>
      </div>

      {/* Vùng ảnh tương tác */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col items-center max-h-[45vh] overflow-y-auto">
        {content?.image_url ? (
          <div
            ref={containerRef}
            onClick={handleImageClick}
            className={`relative max-w-full rounded-2xl overflow-hidden border-2 select-none touch-none ${
              disabled
                ? "cursor-not-allowed opacity-80 border-slate-200 dark:border-slate-800"
                : "cursor-crosshair border-slate-200 hover:border-[#4285F4] dark:border-slate-700"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Mục tiêu Hotspot"
              className="w-full h-auto max-h-[260px] object-contain pointer-events-none block"
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
                  <div className="absolute w-8 h-8 rounded-full bg-[#4285F4]/30 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-[#4285F4]/40 border-2 border-[#4285F4] flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <Crosshair className="absolute w-10 h-10 text-[#4285F4] pointer-events-none" />
                </div>
                <span className="mt-1 bg-white dark:bg-slate-900 text-[#1967D2] dark:text-[#8AB4F8] text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full border border-[#D2E3FC] dark:border-[#4285F4]/30 shadow-xs">
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
