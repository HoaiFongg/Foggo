"use client";

import { CheckSquare, Square } from "lucide-react";
import type { PlayerProps } from "../types";
import type { MultiSelectContent, MultiSelectUserAnswer } from "./schema";

const LABELS = ["A", "B", "C", "D", "E", "F"];

export function MultiSelectPlayer({
  content,
  value = [],
  onChange,
  disabled = false,
}: PlayerProps<MultiSelectContent, MultiSelectUserAnswer>) {
  const options = content?.options || [];
  const selectedList = Array.isArray(value) ? value : [];

  function handleToggle(id: string) {
    if (disabled) return;
    const next = selectedList.includes(id)
      ? selectedList.filter((item) => item !== id)
      : [...selectedList, id];
    onChange(next);
  }

  return (
    <div className="w-full mx-auto space-y-5 sm:space-y-6">
      {/* Tiêu đề câu hỏi */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
          Chọn nhiều đáp án (Có thể chọn nhiều mục)
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-relaxed font-sans">
          {content?.prompt || "..."}
        </h2>

        {content?.image_url && (
          <div className="mt-4 max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Minh họa"
              className="w-full h-auto max-h-56 object-contain mx-auto"
            />
          </div>
        )}
      </div>

      {/* Lưới lựa chọn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {options.map((opt, idx) => {
          const isSelected = selectedList.includes(opt.id);
          const label = LABELS[idx] || `${idx + 1}`;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => handleToggle(opt.id)}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
                isSelected
                  ? "bg-amber-500/20 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black font-mono text-xs shrink-0 transition-all ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-400"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                {isSelected ? <CheckSquare className="w-5 h-5" /> : label}
              </div>

              <span className="text-sm sm:text-base font-bold leading-snug">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

