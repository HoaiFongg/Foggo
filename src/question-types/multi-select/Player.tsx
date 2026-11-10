"use client";

import { CheckSquare, Square } from "lucide-react";
import type { PlayerProps } from "../types";
import type { MultiSelectContent, MultiSelectUserAnswer } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

const LABELS = ["A", "B", "C", "D", "E", "F"];

export function MultiSelectPlayer({
  content,
  value = [],
  onChange,
  disabled = false,
}: PlayerProps<MultiSelectContent, MultiSelectUserAnswer>) {
  const { t, isEn } = useLanguage();
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
    <div className="w-full max-w-5xl mx-auto space-y-2.5 sm:space-y-3">
      {/* Tiêu đề câu hỏi */}
      <div className="py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 inline-block mb-1">
          {t.questionTypes.multi_select} {isEn ? "(Select all that apply)" : "(Có thể chọn nhiều mục)"}
        </span>
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug font-sans">
          {content?.prompt || "..."}
        </h2>

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

      {/* Lưới lựa chọn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {options.map((opt, idx) => {
          const isSelected = selectedList.includes(opt.id);
          const label = LABELS[idx] || `${idx + 1}`;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => handleToggle(opt.id)}
              className={`p-2.5 sm:p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all duration-150 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
                isSelected
                  ? "bg-amber-500/20 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center font-black font-mono text-xs shrink-0 transition-all ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-400"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                {isSelected ? <CheckSquare className="w-4 h-4" /> : label}
              </div>

              <span className="text-xs sm:text-sm font-semibold leading-snug">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

