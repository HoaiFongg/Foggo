"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DragOrderContent, DragOrderUserAnswer } from "./schema";

export function DragOrderPlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<DragOrderContent, DragOrderUserAnswer>) {
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
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
          Sắp xếp theo thứ tự đúng
        </span>
        <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed">
          {content?.prompt || "..."}
        </h2>
      </div>

      <div className="space-y-2.5">
        {orderedIds.map((id, idx) => {
          const item = itemMap.get(id);
          if (!item) return null;

          return (
            <div
              key={id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-black text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-bold text-white">{item.text}</span>
              </div>

              {!disabled && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Lên trên"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    disabled={idx === orderedIds.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
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
