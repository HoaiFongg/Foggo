"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Tiêu đề câu hỏi Google Material 3 (Bo góc lớn 24px, nền sáng, bóng nhẹ) */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#4285F4]/30 inline-block">
          Điền từ vào chỗ trống
        </span>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans px-2">
          {content?.prompt || "Điền từ thích hợp vào các vị trí trống:"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
          {selectedOptId
            ? "Đã chọn từ khóa! Hãy chạm vào ô trống cần điền ở trên."
            : "Chạm vào từ khóa bên dưới rồi chạm vào ô trống tương ứng."}
        </p>
      </div>

      {/* Vùng đoạn văn tương tác */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs leading-loose text-sm sm:text-base text-slate-800 dark:text-slate-100 max-h-[35vh] overflow-y-auto">
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
                className="inline-flex items-center gap-1.5 mx-1.5 px-3.5 py-1 rounded-full bg-[#E8F0FE] dark:bg-[#4285F4]/20 border-2 border-[#4285F4] text-[#1967D2] dark:text-[#8AB4F8] font-semibold text-sm shadow-xs hover:bg-[#FCE8E6] hover:border-[#EA4335] hover:text-[#C5221F] transition-all cursor-pointer group"
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
              className={`inline-flex items-center justify-center min-w-[90px] sm:min-w-[110px] h-9 mx-1.5 px-3 rounded-full border-2 border-dashed font-sans text-xs font-semibold transition-all cursor-pointer ${
                selectedOptId
                  ? "border-[#4285F4] bg-[#E8F0FE] text-[#1967D2] animate-pulse"
                  : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-500 hover:border-[#4285F4]"
              }`}
            >
              [ Ô {blankId} ]
            </button>
          );
        })}
      </div>

      {/* Ngân hàng từ khóa dạng Pill bo tròn */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
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
                className={`px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs ${
                  isSelected
                    ? "border-[#4285F4] bg-[#4285F4] text-white shadow-sm scale-105"
                    : isUsed
                    ? "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400 line-through opacity-50"
                    : "border-slate-200 dark:border-slate-700 bg-[#F8F9FA] dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#4285F4]/60 hover:bg-[#E8F0FE]/40"
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
