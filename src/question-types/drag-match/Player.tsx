"use client";

import { useState, useMemo, useRef } from "react";
import { X, Check, GripVertical, ArrowRight } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DragMatchContent, DragMatchUserAnswer } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

const GOOGLE_COLOR_THEMES = [
  {
    border: "border-[#4285F4]",
    bg: "bg-[#E8F0FE] dark:bg-[#4285F4]/15",
    text: "text-[#1967D2] dark:text-[#8AB4F8]",
    badge: "bg-[#E8F0FE] text-[#1967D2] border-[#D2E3FC] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] dark:border-[#4285F4]/40",
  },
  {
    border: "border-[#EA4335]",
    bg: "bg-[#FCE8E6] dark:bg-[#EA4335]/15",
    text: "text-[#C5221F] dark:text-[#F28B82]",
    badge: "bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF] dark:bg-[#EA4335]/20 dark:text-[#F28B82] dark:border-[#EA4335]/40",
  },
  {
    border: "border-[#FBBC05]",
    bg: "bg-[#FEF7E0] dark:bg-[#FBBC05]/15",
    text: "text-[#B06000] dark:text-[#FDD663]",
    badge: "bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3] dark:bg-[#FBBC05]/20 dark:text-[#FDD663] dark:border-[#FBBC05]/40",
  },
  {
    border: "border-[#34A853]",
    bg: "bg-[#E6F4EA] dark:bg-[#34A853]/15",
    text: "text-[#137333] dark:text-[#81C995]",
    badge: "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6] dark:bg-[#34A853]/20 dark:text-[#81C995] dark:border-[#34A853]/40",
  },
];

export function DragMatchPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<DragMatchContent, DragMatchUserAnswer>) {
  const { t, isEn } = useLanguage();
  const pairs = content?.pairs || [];

  // State tương tác: kéo hoặc chạm từ Cột Trái sang Cột Phải
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [draggedLeftId, setDraggedLeftId] = useState<string | null>(null);
  const [hoveredRightId, setHoveredRightId] = useState<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);

  // Xáo trộn cố định cột phải dựa trên ID
  const rightOptions = useMemo(() => {
    const list = pairs.map((p) => ({ id: p.id, right: p.right }));
    return [...list].sort((a, b) => b.id.localeCompare(a.id));
  }, [pairs]);

  const currentMatches: Record<string, string> = value || {};

  // Gắn vế trái (LeftId) sang vế phải (RightId)
  function linkMatch(leftId: string, rightId: string) {
    if (disabled) return;
    const next = { ...currentMatches };
    // Nếu thẻ B này đã có thẻ A khác gắn vào, gỡ thẻ cũ
    for (const lId of Object.keys(next)) {
      if (next[lId] === rightId) {
        delete next[lId];
      }
    }
    // Gắn thẻ A vào thẻ B
    next[leftId] = rightId;
    onChange(next);
    setSelectedLeftId(null);
    setDraggedLeftId(null);
    setHoveredRightId(null);
    draggedIdRef.current = null;
  }

  // Gỡ thẻ A ra khỏi thẻ B
  function handleRemoveLink(leftId: string) {
    if (disabled) return;
    const next = { ...currentMatches };
    delete next[leftId];
    onChange(next);
    if (selectedLeftId === leftId) setSelectedLeftId(null);
  }

  // Chạm/Click vào thẻ ở Cột Trái (A)
  function handleSelectLeft(leftId: string) {
    if (disabled) return;
    setSelectedLeftId(selectedLeftId === leftId ? null : leftId);
  }

  // Chạm/Click vào thẻ ở Cột Phải (B)
  function handleSelectRightCard(rightId: string) {
    if (disabled) return;
    if (selectedLeftId) {
      linkMatch(selectedLeftId, rightId);
      return;
    }

    // Nếu thẻ B này đã có thẻ A gắn vào, click để gỡ
    const existingLeftId = Object.keys(currentMatches).find(
      (lId) => currentMatches[lId] === rightId
    );
    if (existingLeftId) {
      handleRemoveLink(existingLeftId);
    }
  }

  // --- HTML5 DRAG & DROP HANDLERS ---
  function handleDragStart(leftId: string, e: React.DragEvent) {
    if (disabled) return;
    draggedIdRef.current = leftId;
    setDraggedLeftId(leftId);
    e.dataTransfer.setData("text/plain", leftId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(rightId: string, e: React.DragEvent) {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (hoveredRightId !== rightId) {
      setHoveredRightId(rightId);
    }
  }

  function handleDragEnter(rightId: string, e: React.DragEvent) {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (hoveredRightId !== rightId) {
      setHoveredRightId(rightId);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    if (disabled) return;
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setHoveredRightId(null);
    }
  }

  function handleDrop(rightId: string, e: React.DragEvent) {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const leftId = e.dataTransfer.getData("text/plain") || draggedIdRef.current || draggedLeftId;
    if (leftId) {
      linkMatch(leftId, rightId);
    }
    setHoveredRightId(null);
    setDraggedLeftId(null);
    draggedIdRef.current = null;
  }

  const matchedCount = Object.keys(currentMatches).length;

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto space-y-4">
      {/* 1. Tiêu đề câu hỏi Google Material 3 (Bo góc 24px, nền sáng, bóng nhẹ) */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#4285F4]/30 inline-block">
          {t.questionTypes.drag_match}
        </span>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans break-words whitespace-normal px-2">
          {content?.prompt ||
            (isEn
              ? "Match each item from the left column with its corresponding item on the right:"
              : "Ghép từng vế từ cột bên trái với vế tương ứng ở cột bên phải:")}
        </h2>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF7E0] dark:bg-[#FBBC05]/15 border border-[#FEEFC3] dark:border-[#FBBC05]/30 text-xs font-medium text-[#B06000] dark:text-[#FDD663]">
          <GripVertical className="w-4 h-4 shrink-0 text-[#FBBC05]" />
          <span>
            {isEn
              ? "Drag cards from Left Column and drop into Right Column to align in a straight row!"
              : "Kéo thẻ từ Cột Trái thả trực tiếp sang Cột Phải để gắn thẳng hàng!"}
          </span>
          <span className="font-bold ml-1">
            ({matchedCount}/{pairs.length})
          </span>
        </div>

        {content?.image_url && (
          <div className="mt-3 max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-950 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Minh họa"
              className="w-full h-auto max-h-48 object-contain mx-auto rounded-xl"
            />
          </div>
        )}
      </div>

      {/* 2. Không gian 2 cột trực quan: CỘT BÊN TRÁI ➔ CỘT BÊN PHẢI (Google Material 3 Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ============================================================== */}
        {/* CỘT PHÍA BÊN TRÁI (CỘT A)                                      */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 space-y-3">
          <div className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center border border-slate-200 dark:border-slate-700">
            {isEn ? "Left Column (A)" : "Cột Bên Trái (A)"}
          </div>

          {pairs.map((p, idx) => {
            const isSelected = selectedLeftId === p.id;
            const isDragging = draggedLeftId === p.id;
            const targetRightId = currentMatches[p.id];
            const isPlaced = Boolean(targetRightId);
            const targetRightIndex = rightOptions.findIndex((r) => r.id === targetRightId);
            const color = GOOGLE_COLOR_THEMES[idx % GOOGLE_COLOR_THEMES.length];

            return (
              <div
                key={p.id}
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(p.id, e)}
                onDragEnd={() => {
                  setDraggedLeftId(null);
                  draggedIdRef.current = null;
                }}
                onClick={() => handleSelectLeft(p.id)}
                tabIndex={0}
                className={`p-4 rounded-2xl border-2 transition-all duration-200 select-none cursor-grab active:cursor-grabbing relative focus-visible:ring-2 focus-visible:ring-[#4285F4] focus-visible:outline-none shadow-xs ${
                  isDragging
                    ? "opacity-50 ring-2 ring-[#4285F4] border-[#4285F4] bg-[#E8F0FE]"
                    : isSelected
                    ? "border-[#4285F4] bg-[#E8F0FE] dark:bg-[#4285F4]/20 ring-2 ring-[#4285F4]/50 shadow-sm"
                    : isPlaced
                    ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 opacity-80 hover:opacity-100"
                    : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-[#4285F4]/60 hover:shadow-sm"
                } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${color.badge} shrink-0`}>
                      A{idx + 1}
                    </span>
                  </div>

                  {isPlaced ? (
                    <span className="text-xs font-semibold text-[#137333] bg-[#E6F4EA] dark:bg-[#34A853]/20 px-2.5 py-0.5 rounded-full border border-[#CEEAD6] dark:border-[#34A853]/40 shrink-0">
                      Gắn B{targetRightIndex + 1} ✓
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#1967D2] dark:text-[#8AB4F8] shrink-0 flex items-center gap-1">
                      <span>{isEn ? "Drag ➔" : "Kéo sang ➔"}</span>
                    </span>
                  )}
                </div>

                {/* Nội dung vế trái: Hiển thị đầy đủ 100%, không cắt bớt */}
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 break-words whitespace-normal leading-relaxed">
                  {p.left}
                </p>
              </div>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* CỘT PHÍA BÊN PHẢI (CỘT B) - GẮN THẺ THẲNG 1 HÀNG                */}
        {/* ============================================================== */}
        <div className="lg:col-span-8 space-y-3">
          <div className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs text-center border border-slate-200 dark:border-slate-700">
            {isEn ? "Right Column (B - Connect in a straight row)" : "Cột Bên Phải (B - Gắn thẻ nối thẳng hàng)"}
          </div>

          {rightOptions.map((item, idx) => {
            const connectedLeftId = Object.keys(currentMatches).find(
              (lId) => currentMatches[lId] === item.id
            );
            const connectedPair = connectedLeftId
              ? pairs.find((p) => p.id === connectedLeftId)
              : null;
            const connectedPairIndex = connectedPair
              ? pairs.findIndex((p) => p.id === connectedPair.id)
              : -1;
            const isHovered = hoveredRightId === item.id;
            const isConnected = Boolean(connectedPair);
            const color =
              connectedPairIndex >= 0
                ? GOOGLE_COLOR_THEMES[connectedPairIndex % GOOGLE_COLOR_THEMES.length]
                : GOOGLE_COLOR_THEMES[idx % GOOGLE_COLOR_THEMES.length];

            return (
              <div
                key={item.id}
                onDragOver={(e) => handleDragOver(item.id, e)}
                onDragEnter={(e) => handleDragEnter(item.id, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(item.id, e)}
                onClick={() => handleSelectRightCard(item.id)}
                tabIndex={0}
                className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 bg-white dark:bg-slate-900/90 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-3 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#34A853] focus-visible:outline-none shadow-xs hover:shadow-sm ${
                  isHovered
                    ? "border-[#34A853] bg-[#E6F4EA] ring-4 ring-[#34A853]/25 shadow-md"
                    : isConnected
                    ? `${color.border} ${color.bg}`
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* --- PHẦN GẮN THẺ TRÁI (NẰM TRÊN CÙNG HÀNG NGANG) --- */}
                <div className="w-full md:w-1/2 flex items-center min-h-[52px]">
                  {connectedPair ? (
                    <div className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5 shadow-xs">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${color.badge} shrink-0`}>
                          A{connectedPairIndex + 1}
                        </span>
                        {/* Chữ hiển thị đầy đủ, không bao giờ bị cắt thành dấu ... */}
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-words whitespace-normal leading-relaxed">
                          {connectedPair.left}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLink(connectedPair.id);
                        }}
                        className="p-1 rounded-full hover:bg-rose-100 dark:hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#EA4335] focus-visible:outline-none"
                        title="Gỡ thẻ này ra"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`w-full p-3 rounded-xl border-2 border-dashed transition-all duration-150 flex items-center justify-center gap-2 text-center min-h-[52px] ${
                        isHovered
                          ? "border-[#34A853] bg-[#E6F4EA] text-[#137333] font-bold"
                          : selectedLeftId
                          ? "border-[#4285F4] bg-[#E8F0FE] text-[#1967D2] font-semibold animate-pulse"
                          : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 text-slate-500 hover:border-[#4285F4]/60 hover:text-slate-700"
                      }`}
                    >
                      <ArrowRight className="w-4 h-4 text-[#4285F4] shrink-0" />
                      <span className="text-xs font-semibold">
                        {isHovered
                          ? isEn
                            ? "Drop Card A here!"
                            : "Thả thẻ A vào đây ngay!"
                          : selectedLeftId
                          ? isEn
                            ? "Tap to attach selected Card A"
                            : "Chạm để gắn thẻ A đang chọn"
                          : isEn
                          ? "Drag Card A here to attach"
                          : "Kéo thẻ A từ Cột Trái thả vào đây"}
                      </span>
                    </div>
                  )}
                </div>

                {/* --- MŨI TÊN LIÊN KẾT GIỮA HAI VẾ (NẰM THẲNG 1 HÀNG) --- */}
                <div className="hidden md:flex items-center justify-center shrink-0">
                  {isConnected ? (
                    <div className="w-7 h-7 rounded-full bg-[#E6F4EA] border border-[#CEEAD6] text-[#34A853] flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* --- NỘI DUNG VẾ PHẢI B (NẰM CÙNG TRÊN HÀNG NGANG) --- */}
                <div className="w-full md:w-1/2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5 min-h-[52px]">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded-full font-bold text-xs bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] shrink-0">
                      B{idx + 1}
                    </span>
                    {/* Nội dung vế phải: KHÔNG CÓ TRUNCATE, hiển thị đầy đủ 100% */}
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 break-words whitespace-normal leading-relaxed">
                      {item.right}
                    </p>
                  </div>

                  {isConnected && (
                    <span className="text-[11px] font-semibold text-[#137333] bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#CEEAD6] shrink-0 hidden sm:inline">
                      Khớp ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
