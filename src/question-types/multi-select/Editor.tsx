"use client";

import { Plus, Trash2, CheckSquare, Square, Image as ImageIcon } from "lucide-react";
import type { EditorProps } from "../types";
import type { MultiSelectContent, MultiSelectAnswerKey } from "./schema";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export function MultiSelectEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<MultiSelectContent, MultiSelectAnswerKey>) {
  const options = content.options || [];
  const correct = answerKey.correct || [];

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

  function handleToggleCorrect(id: string) {
    const nextCorrect = correct.includes(id)
      ? correct.filter((c) => c !== id)
      : [...correct, id];
    onChange(content, { ...answerKey, correct: nextCorrect });
  }

  function handleScoringChange(scoring: "all_or_nothing" | "partial" | "per_option") {
    onChange(content, { ...answerKey, scoring });
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
    const nextCorrect = correct.filter((c) => c !== id);
    onChange({ ...content, options: nextOptions }, { ...answerKey, correct: nextCorrect });
  }

  return (
    <div className="space-y-6">
      {/* Ô nhập câu hỏi */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
          Nội dung câu hỏi (Chọn nhiều đáp án) <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={3}
          value={content.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Nhập câu hỏi yêu cầu chọn nhiều đáp án đúng..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
        />
      </div>

      {/* Cách tính điểm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
            Chiến lược chấm điểm
          </label>
          <select
            value={answerKey.scoring || "partial"}
            onChange={(e) => handleScoringChange(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="partial">Chấm điểm một phần (Trừ điểm khi chọn sai)</option>
            <option value="all_or_nothing">Đúng toàn bộ mới được điểm (All-or-Nothing)</option>
            <option value="per_option">Tính theo từng lựa chọn độc lập</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Ảnh đính kèm (URL)</span>
          </label>
          <input
            type="url"
            value={content.image_url || ""}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Danh sách lựa chọn */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Các lựa chọn (Tick vuông vào TẤT CẢ các đáp án ĐÚNG)
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
            const isChecked = correct.includes(opt.id);
            const label = OPTION_LABELS[idx] || `${idx + 1}`;

            return (
              <div
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isChecked
                    ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleCorrect(opt.id)}
                  title="Tick chọn là đáp án đúng"
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold font-mono text-xs shrink-0 transition-transform active:scale-95 cursor-pointer ${
                    isChecked
                      ? "bg-amber-500 border-amber-400 text-slate-950"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {isChecked ? <CheckSquare className="w-4 h-4" /> : label}
                </button>

                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                  placeholder={`Lựa chọn ${label}...`}
                  className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 focus:outline-none text-sm"
                />

                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(opt.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
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

