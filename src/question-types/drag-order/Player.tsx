"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DragOrderContent, DragOrderUserAnswer } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

export function DragOrderPlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<DragOrderContent, DragOrderUserAnswer>) {
  const { t, isEn } = useLanguage();
  const originalItems = content?.items || [];

  // Khởi tạo danh sách bị xáo trộn nếu chưa có value
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    if (Array.isArray(value) && value.length === originalItems.length) {
      return value;
    }
    // Đảo ngược hoặc xáo trộn thứ tự ban đầu để học sinh xếp lại
    const ids = originalItems.map((it) => it.id);
    return [...ids].reverse();
  });

  useEffect(() => {
    if (!value || value.length === 0) {
      onChange(orderedIds);
    }
  }, [orderedIds, onChange, value]);

  function handleMove(idx: number, direction: "up" | "down") {
    if (disabled) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= orderedIds.length) return;

    const next = [...orderedIds];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;

    setOrderedIds(next);
    onChange(next);
  }

  const itemMap = new Map(originalItems.map((it) => [it.id, it]));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Tiêu đề câu hỏi Google Material 3 (Bo góc lớn 24px, nền sáng, bóng nhẹ) */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FEF7E0] text-[#B06000] dark:bg-[#FBBC05]/20 dark:text-[#FDD663] border border-[#FEEFC3] dark:border-[#FBBC05]/30 inline-block">
          {t.questionTypes.drag_order}
        </span>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans break-words whitespace-normal px-2">
          {content?.prompt ||
            (isEn
              ? "Arrange the following items in the correct order:"
              : "Sắp xếp các mục sau theo đúng thứ tự:")}
        </h2>
      </div>

      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
        {orderedIds.map((id, idx) => {
          const item = itemMap.get(id);
          if (!item) return null;

          return (
            <div
              key={id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3.5 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <span className="w-9 h-9 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] font-bold font-sans text-sm flex items-center justify-center shrink-0 border border-[#D2E3FC] dark:border-[#4285F4]/30">
                  {idx + 1}
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 break-words whitespace-normal flex-1">
                  {item.text}
                </span>
              </div>

              {!disabled && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#E8F0FE] dark:hover:bg-[#4285F4]/20 text-slate-700 dark:text-slate-300 hover:text-[#1967D2] dark:hover:text-[#8AB4F8] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs active:scale-95"
                    title="Lên trên"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === orderedIds.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#E8F0FE] dark:hover:bg-[#4285F4]/20 text-slate-700 dark:text-slate-300 hover:text-[#1967D2] dark:hover:text-[#8AB4F8] transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs active:scale-95"
                    title="Xuống dưới"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
