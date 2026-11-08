"use client";

import { Check, X } from "lucide-react";
import type { PlayerProps } from "../types";
import type { TrueFalseContent, TrueFalseUserAnswer } from "./schema";

export function TrueFalsePlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<TrueFalseContent, TrueFalseUserAnswer>) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Mệnh đề câu hỏi */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-2 block">
          Đúng hay Sai?
        </span>
        <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed">
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

      {/* 2 nút ĐÚNG / SAI lớn */}
      <div className="grid grid-cols-2 gap-4">
        {/* Nút ĐÚNG */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(true)}
          className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
            value === true
              ? "bg-emerald-500/30 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.35)] scale-[1.02]"
              : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/10"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              value === true
                ? "bg-emerald-500 text-slate-950 shadow-md scale-110"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-wider font-mono">
            ĐÚNG
          </span>
        </button>

        {/* Nút SAI */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(false)}
          className={`p-6 sm:p-8 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
            value === false
              ? "bg-rose-500/30 border-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.35)] scale-[1.02]"
              : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-rose-500/50 hover:bg-rose-500/10"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              value === false
                ? "bg-rose-500 text-slate-950 shadow-md scale-110"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}
          >
            <X className="w-8 h-8 stroke-[3]" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-wider font-mono">
            SAI
          </span>
        </button>
      </div>
    </div>
  );
}

