"use client";

import { useState, useMemo } from "react";
import { Link2, Unlink, Check, GripVertical, ArrowLeftRight } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DragMatchContent, DragMatchUserAnswer } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

const COLORS = [
  "border-amber-400 bg-amber-500/10 text-amber-300",
  "border-emerald-400 bg-emerald-500/10 text-emerald-300",
  "border-sky-400 bg-sky-500/10 text-sky-300",
  "border-purple-400 bg-purple-500/10 text-purple-300",
  "border-rose-400 bg-rose-500/10 text-rose-300",
  "border-teal-400 bg-teal-500/10 text-teal-300",
  "border-indigo-400 bg-indigo-500/10 text-indigo-300",
  "border-orange-400 bg-orange-500/10 text-orange-300",
];

export function DragMatchPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<DragMatchContent, DragMatchUserAnswer>) {
  const { t, isEn } = useLanguage();
  const pairs = content?.pairs || [];

  // State cho click-to-match và drag-to-match
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [draggedRightId, setDraggedRightId] = useState<string | null>(null);
  const [hoveredLeftId, setHoveredLeftId] = useState<string | null>(null);

  // Xáo trộn cột phải cố định dựa trên ID
  const rightOptions = useMemo(() => {
    const list = pairs.map((p) => ({ id: p.id, right: p.right }));
    return [...list].sort((a, b) => b.id.localeCompare(a.id));
  }, [pairs]);

  const currentMatches: Record<string, string> = value || {};

  // Ghép cặp giữa vế trái (LeftId) và vế phải (RightId)
  function linkMatch(leftId: string, rightId: string) {
    if (disabled) return;
    const next = { ...currentMatches };
    // Nếu vế phải này đã gắn với vế trái khác, gỡ ra
    for (const lId of Object.keys(next)) {
      if (next[lId] === rightId) {
        delete next[lId];
      }
    }
    next[leftId] = rightId;
    onChange(next);
    setSelectedLeft(null);
    setSelectedRight(null);
    setDraggedRightId(null);
    setHoveredLeftId(null);
  }

  function handleRemoveLink(leftId: string) {
    if (disabled) return;
    const next = { ...currentMatches };
    delete next[leftId];
    onChange(next);
  }

  // Click handler
  function handleSelectLeft(leftId: string) {
    if (disabled) return;
    if (selectedRight) {
      linkMatch(leftId, selectedRight);
      return;
    }
    setSelectedLeft(selectedLeft === leftId ? null : leftId);
  }

  function handleSelectRight(rightId: string) {
    if (disabled) return;
    if (selectedLeft) {
      linkMatch(selectedLeft, rightId);
      return;
    }

    // Nếu vế phải này đã được ghép, bấm vào để gỡ
    const existingLeft = Object.keys(currentMatches).find(
      (lId) => currentMatches[lId] === rightId
    );
    if (existingLeft) {
      handleRemoveLink(existingLeft);
      return;
    }

    setSelectedRight(selectedRight === rightId ? null : rightId);
  }

  // Drag & drop handlers
  function handleDragStart(rightId: string, e: React.DragEvent) {
    if (disabled) return;
    setDraggedRightId(rightId);
    e.dataTransfer.setData("text/plain", rightId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(leftId: string, e: React.DragEvent) {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (hoveredLeftId !== leftId) {
      setHoveredLeftId(leftId);
    }
  }

  function handleDrop(leftId: string, e: React.DragEvent) {
    if (disabled) return;
    e.preventDefault();
    const rightId = e.dataTransfer.getData("text/plain") || draggedRightId;
    if (rightId) {
      linkMatch(leftId, rightId);
    }
  }

  // Gán màu cho mỗi vế trái đã ghép
  const matchColorMap = useMemo(() => {
    const map = new Map<string, string>();
    pairs.forEach((p, idx) => {
      map.set(p.id, COLORS[idx % COLORS.length]);
    });
    return map;
  }, [pairs]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Tiêu đề câu hỏi */}
      <div className="py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block mb-1">
          {t.questionTypes.drag_match}
        </span>
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug font-sans">
          {content?.prompt || "Ghép các vế tương ứng giữa hai cột:"}
        </h2>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-300/90 mt-1.5 font-mono font-medium">
          <GripVertical className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>
            {isEn
              ? "Drag cards from Column B (Right) and drop them onto Column A (Left) to match!"
              : "Kéo các thẻ từ Cột B (Bên phải) thả trực tiếp qua Cột A (Bên trái) để ghép nối!"}
          </span>
        </div>

        {content?.image_url && (
          <div className="mt-2 max-w-xs mx-auto rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Minh họa"
              className="w-full h-auto max-h-36 object-contain mx-auto"
            />
          </div>
        )}
      </div>

      {/* Lưới 2 cột ghép cặp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CỘT A (TRÁI) - VÙNG NHẬN THẺ KÉO ĐẾN (DROP TARGET) */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between px-2">
            <span>Cột A (Đích đến)</span>
            <span className="bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {Object.keys(currentMatches).length}/{pairs.length} đã nối
            </span>
          </div>

          {pairs.map((p, idx) => {
            const isSelected = selectedLeft === p.id;
            const isHovered = hoveredLeftId === p.id;
            const matchedRightId = currentMatches[p.id];
            const matchedPair = pairs.find((item) => item.id === matchedRightId);
            const colorClass = matchColorMap.get(p.id) || COLORS[0];

            return (
              <div
                key={p.id}
                onClick={() => handleSelectLeft(p.id)}
                onDragOver={(e) => handleDragOver(p.id, e)}
                onDragLeave={() => setHoveredLeftId(null)}
                onDrop={(e) => handleDrop(p.id, e)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative select-none ${
                  isHovered
                    ? "border-emerald-400 bg-emerald-500/20 ring-4 ring-emerald-400/40 scale-[1.02] shadow-xl"
                    : isSelected
                    ? "border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50"
                    : matchedRightId
                    ? `${colorClass} shadow-md`
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-amber-400 flex items-center justify-center shrink-0">
                      A{idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {p.left}
                    </span>
                  </div>

                  {matchedRightId ? (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveLink(p.id);
                      }}
                      className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                      title="Gỡ nối"
                    >
                      <Unlink className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800/80">
                      Thả vế B vào đây
                    </span>
                  )}
                </div>

                {/* Hiển thị thẻ B đã được kéo ghép vào */}
                {matchedPair && (
                  <div className="mt-1 p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-emerald-300 font-semibold truncate">
                        {matchedPair.right}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0">
                      Đã ghép ✓
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CỘT B (PHẢI) - THẺ KÉO ĐƯỢC (DRAGGABLE SOURCE) */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between px-2">
            <span>Cột B (Kéo thẻ này)</span>
            <span className="bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Giữ & Kéo sang A
            </span>
          </div>

          {rightOptions.map((item, idx) => {
            const connectedLeftId = Object.keys(currentMatches).find(
              (lId) => currentMatches[lId] === item.id
            );
            const isDragging = draggedRightId === item.id;
            const isSelected = selectedRight === item.id;
            const colorClass = connectedLeftId
              ? matchColorMap.get(connectedLeftId) || COLORS[0]
              : "";

            return (
              <div
                key={item.id}
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(item.id, e)}
                onDragEnd={() => setDraggedRightId(null)}
                onClick={() => handleSelectRight(item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing flex items-center justify-between gap-3 select-none ${
                  isDragging
                    ? "opacity-50 scale-95 border-emerald-400 bg-emerald-500/20"
                    : connectedLeftId
                    ? `${colorClass} shadow-md`
                    : isSelected
                    ? "border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-400/50 shadow-lg"
                    : "bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 text-slate-200"
                } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <GripVertical className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                  <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-emerald-400 flex items-center justify-center shrink-0">
                    B{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {item.right}
                  </span>
                </div>

                {connectedLeftId ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800 shrink-0">
                    Kéo sang ➔
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
