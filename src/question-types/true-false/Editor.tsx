"use client";

import { Check, X, Image as ImageIcon } from "lucide-react";
import type { EditorProps } from "../types";
import type { TrueFalseContent, TrueFalseAnswerKey } from "./schema";

export function TrueFalseEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<TrueFalseContent, TrueFalseAnswerKey>) {
  function handlePromptChange(prompt: string) {
    onChange({ ...content, prompt }, answerKey);
  }

  function handleImageUrlChange(image_url: string) {
    onChange({ ...content, image_url: image_url || null }, answerKey);
  }

  function handleSetCorrect(correct: boolean) {
    onChange(content, { correct });
  }

  return (
    <div className="space-y-6">
      {/* Ô nhập mệnh đề */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
          Nội dung mệnh đề / phát biểu <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={3}
          value={content.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="ví dụ: Trái Đất quay quanh Mặt Trời."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
        />
      </div>

      {/* Ảnh minh họa */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Ảnh minh họa (tùy chọn)</span>
        </label>
        <input
          type="url"
          value={content.image_url || ""}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://... (tùy chọn)"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-xs"
        />
      </div>

      {/* Chọn ĐÚNG hay SAI */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-mono">
          Đáp án đúng của phát biểu này:
        </label>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSetCorrect(true)}
            className={`p-5 rounded-2xl border-2 flex items-center justify-center gap-3 font-black text-sm transition-all cursor-pointer ${
              answerKey.correct === true
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                answerKey.correct === true
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <span>ĐÚNG</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetCorrect(false)}
            className={`p-5 rounded-2xl border-2 flex items-center justify-center gap-3 font-black text-sm transition-all cursor-pointer ${
              answerKey.correct === false
                ? "bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                answerKey.correct === false
                  ? "bg-rose-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <X className="w-5 h-5 stroke-[3]" />
            </div>
            <span>SAI</span>
          </button>
        </div>
      </div>
    </div>
  );
}

