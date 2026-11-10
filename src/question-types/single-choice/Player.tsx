"use client";

import type { PlayerProps } from "../types";
import type { SingleChoiceContent, SingleChoiceUserAnswer } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

const OPTION_THEMES = [
  {
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    hover: "hover:border-rose-500/50 hover:bg-rose-500/10",
    selected: "bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
  },
  {
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    hover: "hover:border-blue-500/50 hover:bg-blue-500/10",
    selected: "bg-blue-500/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
  },
  {
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    hover: "hover:border-amber-500/50 hover:bg-amber-500/10",
    selected: "bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
  },
  {
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    hover: "hover:border-emerald-500/50 hover:bg-emerald-500/10",
    selected: "bg-emerald-500/20 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
  },
];

const LABELS = ["A", "B", "C", "D", "E", "F"];

export function SingleChoicePlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<SingleChoiceContent, SingleChoiceUserAnswer>) {
  const { t } = useLanguage();
  const options = content?.options || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-2.5 sm:space-y-3">
      {/* Tiêu đề câu hỏi */}
      <div className="py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-lg">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 inline-block mb-1">
          {t.questionTypes.single_choice}
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

      {/* Lưới các đáp án để người chơi bấm chọn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {options.map((opt, idx) => {
          const isSelected = value === opt.id;
          const theme = OPTION_THEMES[idx % OPTION_THEMES.length];
          const label = LABELS[idx] || `${idx + 1}`;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={`p-2.5 sm:p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all duration-150 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
                isSelected
                  ? `${theme.selected} text-white`
                  : `bg-slate-900/80 border-slate-800 text-slate-200 ${theme.hover}`
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center font-black font-mono text-xs shrink-0 transition-all ${
                  isSelected
                    ? "bg-amber-400 text-slate-950 border-amber-300 scale-105"
                    : theme.badge
                }`}
              >
                {label}
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

