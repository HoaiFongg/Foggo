"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DragFillContent, DragFillUserAnswer } from "./schema";

export function DragFillPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<DragFillContent, DragFillUserAnswer>) {
  const template = content?.template || "";
  const options = content?.options || [];
  const currentAnswers: Record<string, string> = value || {};

  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);

  // Phân tích template thành các token chữ và token chỗ trống
  const segments = template.split(/(\{\{\d+\}\})/g);

  // Tập hợp các option đã được sử dụng
  const usedOptionIds = new Set(Object.values(currentAnswers));

  function handleSelectOption(optId: string) {
    if (disabled) return;
    if (selectedOptId === optId) {
      setSelectedOptId(null);
    } else {
      setSelectedOptId(optId);
    }
  }

  function handleSlotClick(blankId: string) {
    if (disabled) return;

    // Nếu ô này đã có từ, click vào để gỡ bỏ
    if (currentAnswers[blankId]) {
      const next = { ...currentAnswers };
      delete next[blankId];
      onChange(next);
      return;
    }

    // Nếu đang chọn một từ dưới ngân hàng, điền vào ô này
    if (selectedOptId) {
      // Gỡ từ này khỏi ô khác nếu đã dùng
      const next = { ...currentAnswers };
      for (const [bId, oId] of Object.entries(next)) {
        if (oId === selectedOptId) {
          delete next[bId];
        }
      }
      next[blankId] = selectedOptId;
      onChange(next);
      setSelectedOptId(null);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5 sm:space-y-3">
      {/* Tiêu đề câu hỏi */}
      <div className="py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block mb-1">
          Điền từ vào chỗ trống
        </span>
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug font-sans">
          {content?.prompt || "Điền từ thích hợp vào các vị trí trống:"}
        </h2>
        <p className="text-[11px] text-slate-400 mt-1 font-mono">
          {selectedOptId
            ? "Đã chọn từ khóa! Hãy chạm vào ô trống cần điền ở trên."
            : "Chạm vào từ khóa bên dưới rồi chạm vào ô trống tương ứng."}
        </p>
      </div>

      {/* Vùng đoạn văn tương tác */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg leading-relaxed text-xs sm:text-sm text-slate-200 max-h-[30vh] overflow-y-auto">
        {segments.map((segment, idx) => {
          const match = segment.match(/^\{\{(\d+)\}\}$/);
          if (!match) {
            return <span key={idx}>{segment}</span>;
          }

          const blankId = match[1];
          const filledOptId = currentAnswers[blankId];
          const filledOption = options.find((o) => o.id === filledOptId);

          if (filledOption) {
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleSlotClick(blankId)}
                className="inline-flex items-center gap-1.5 mx-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-bold text-sm sm:text-base shadow-sm hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-all cursor-pointer group"
                title="Chạm để gỡ từ này ra"
              >
                <span>{filledOption.text}</span>
                <X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </button>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => handleSlotClick(blankId)}
              className={`inline-flex items-center justify-center min-w-[80px] sm:min-w-[100px] h-9 mx-1.5 px-3 rounded-xl border-2 border-dashed font-mono text-xs font-bold transition-all cursor-pointer ${
                selectedOptId
                  ? "border-amber-400 bg-amber-500/10 text-amber-300 animate-pulse"
                  : "border-slate-700 bg-slate-950/60 text-slate-500 hover:border-slate-500"
              }`}
            >
              [ Ô {blankId} ]
            </button>
          );
        })}
      </div>

      {/* Ngân hàng từ khóa */}
      <div className="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
          Ngân hàng từ khóa (Chạm để chọn):
        </span>
        <div className="flex flex-wrap gap-2.5">
          {options.map((opt) => {
            const isUsed = usedOptionIds.has(opt.id);
            const isSelected = selectedOptId === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                disabled={disabled || isUsed}
                onClick={() => handleSelectOption(opt.id)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer disabled:cursor-not-allowed ${
                  isSelected
                    ? "border-amber-400 bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-105"
                    : isUsed
                    ? "border-slate-800 bg-slate-900/40 text-slate-600 line-through opacity-50"
                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-400/60 hover:text-white"
                }`}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

