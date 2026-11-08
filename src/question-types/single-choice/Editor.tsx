"use client";

import { Plus, Trash2, CheckCircle2, Image as ImageIcon } from "lucide-react";
import type { EditorProps } from "../types";
import type { SingleChoiceContent, SingleChoiceAnswerKey } from "./schema";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];
const OPTION_COLORS = [
  "border-rose-500/40 text-rose-400 bg-rose-500/10",
  "border-blue-500/40 text-blue-400 bg-blue-500/10",
  "border-amber-500/40 text-amber-400 bg-amber-500/10",
  "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
  "border-purple-500/40 text-purple-400 bg-purple-500/10",
  "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
];

export function SingleChoiceEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<SingleChoiceContent, SingleChoiceAnswerKey>) {
  const options = content.options || [];

  function handlePromptChange(prompt: string) {
    onChange({ ...content, prompt }, answerKey);
  }

  function handleImageUrlChange(image_url: string) {
    onChange({ ...content, image_url: image_url || null }, answerKey);
  }

  function handleOptionTextChange(id: string, text: string) {
    const nextOptions = options.map((opt) =>
      opt.id === id ? { ...opt, text } : opt
    );
    onChange({ ...content, options: nextOptions }, answerKey);
  }

  function handleSelectCorrect(id: string) {
    onChange(content, { correct: id });
  }

  function handleAddOption() {
    if (options.length >= 6) return;
    const newId = `opt_${Date.now()}`;
    const nextOptions = [...options, { id: newId, text: "" }];
    onChange({ ...content, options: nextOptions }, answerKey);
  }

  function handleRemoveOption(id: string) {
    if (options.length <= 2) return;
    const nextOptions = options.filter((opt) => opt.id !== id);
    let nextCorrect = answerKey.correct;
    if (nextCorrect === id) {
      nextCorrect = nextOptions[0]?.id || "";
    }
    onChange({ ...content, options: nextOptions }, { correct: nextCorrect });
  }

  return (
    <div className="space-y-6">
      {/* Ô nhập câu hỏi */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
          Nội dung câu hỏi <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={3}
          value={content.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Nhập nội dung câu hỏi trắc nghiệm..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
        />
      </div>

      {/* URL ảnh đính kèm (tùy chọn) */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Ảnh đính kèm (URL công khai)</span>
        </label>
        <input
          type="url"
          value={content.image_url || ""}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://... (tùy chọn)"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-xs"
        />
        {content.image_url && (
          <div className="mt-3 relative w-48 h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Ảnh minh họa"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Danh sách lựa chọn đáp án */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Các lựa chọn (Tick tròn vào đáp án ĐÚNG)
          </label>
          {options.length < 6 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm lựa chọn</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            const isCorrect = answerKey.correct === opt.id;
            const colorClass = OPTION_COLORS[idx % OPTION_COLORS.length];
            const label = OPTION_LABELS[idx] || `${idx + 1}`;

            return (
              <div
                key={opt.id}
                className={`relative flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isCorrect
                    ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Nút tick chọn làm đáp án đúng */}
                <button
                  type="button"
                  onClick={() => handleSelectCorrect(opt.id)}
                  title="Chọn làm đáp án đúng"
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold font-mono text-xs shrink-0 transition-transform active:scale-95 cursor-pointer ${
                    isCorrect
                      ? "bg-amber-500 border-amber-400 text-slate-950 shadow-sm"
                      : `${colorClass} hover:scale-105`
                  }`}
                >
                  {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : label}
                </button>

                {/* Ô nhập nội dung lựa chọn */}
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                  placeholder={`Lựa chọn ${label}...`}
                  className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 focus:outline-none text-sm"
                />

                {/* Nút xóa lựa chọn */}
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(opt.id)}
                    title="Xóa lựa chọn này"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

