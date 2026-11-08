"use client";

import { Check, X } from "lucide-react";
import type { PlayerProps } from "../types";
import type { TrueFalseMultiContent, TrueFalseMultiUserAnswer } from "./schema";

export function TrueFalseMultiPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<TrueFalseMultiContent, TrueFalseMultiUserAnswer>) {
  const statements = content?.statements || [];
  const currentAnswers: Record<string, boolean> = value || {};

  function handleSelect(id: string, boolVal: boolean) {
    if (disabled) return;
    onChange({
      ...currentAnswers,
      [id]: boolVal,
    });
  }

  const answeredCount = Object.keys(currentAnswers).length;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Tiêu đề câu hỏi */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
          Nhiều mệnh đề Đúng / Sai
        </span>
        <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed font-sans">
          {content?.prompt || "Xác định các mệnh đề sau là Đúng hay Sai:"}
        </h2>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Tiến độ: {answeredCount}/{statements.length} mệnh đề đã trả lời
        </p>

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

      {/* Danh sách mệnh đề */}
      <div className="space-y-3">
        {statements.map((s, idx) => {
          const userVal = currentAnswers[s.id];
          const isSelectedTrue = userVal === true;
          const isSelectedFalse = userVal === false;

          return (
            <div
              key={s.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-sm sm:text-base font-bold text-white leading-snug">
                  {s.text}
                </span>
              </div>

              {/* Cặp nút Đúng / Sai */}
              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(s.id, true)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border-2 font-black font-mono text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                    isSelectedTrue
                      ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-300"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  ĐÚNG
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(s.id, false)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border-2 font-black font-mono text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                    isSelectedFalse
                      ? "bg-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)]"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-rose-500/50 hover:text-rose-300"
                  }`}
                >
                  <X className="w-4 h-4" />
                  SAI
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
