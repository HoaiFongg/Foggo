"use client";

import { useMemo } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import type { EditorProps } from "../types";
import type { DragFillContent, DragFillAnswerKey } from "./schema";

export function DragFillEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<DragFillContent, DragFillAnswerKey>) {
  const options = content?.options || [];
  const template = content?.template || "";
  const blanks = answerKey?.blanks || {};

  // Trích xuất các vị trí {{1}}, {{2}} từ template
  const discoveredBlanks = useMemo(() => {
    const regex = /\{\{(\d+)\}\}/g;
    const matches = Array.from(template.matchAll(regex));
    const ids = Array.from(new Set(matches.map((m) => m[1])));
    return ids.sort((a, b) => Number(a) - Number(b));
  }, [template]);

  function handlePromptChange(val: string) {
    onChange({ ...content, prompt: val }, answerKey);
  }

  function handleTemplateChange(val: string) {
    onChange({ ...content, template: val }, answerKey);
  }

  function handleInsertBlank() {
    const nextNum = discoveredBlanks.length + 1;
    const nextTemplate = `${template} {{${nextNum}}}`;
    onChange({ ...content, template: nextTemplate }, answerKey);
  }

  function handleAddOption() {
    const newId = `opt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nextOptions = [...options, { id: newId, text: `Từ khóa ${options.length + 1}` }];
    onChange({ ...content, options: nextOptions }, answerKey);
  }

  function handleRemoveOption(id: string) {
    const nextOptions = options.filter((o) => o.id !== id);
    const nextBlanks = { ...blanks };
    for (const [bId, optId] of Object.entries(nextBlanks)) {
      if (optId === id) {
        delete nextBlanks[bId];
      }
    }
    onChange({ ...content, options: nextOptions }, { blanks: nextBlanks });
  }

  function handleUpdateOptionText(id: string, text: string) {
    const nextOptions = options.map((o) => (o.id === id ? { ...o, text } : o));
    onChange({ ...content, options: nextOptions }, answerKey);
  }

  function handleSelectCorrectOption(blankId: string, optId: string) {
    const nextBlanks = {
      ...blanks,
      [blankId]: optId,
    };
    onChange(content, { blanks: nextBlanks });
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề yêu cầu */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Nội dung yêu cầu
        </label>
        <input
          type="text"
          value={content?.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Ví dụ: Kéo các từ thích hợp vào chỗ trống trong đoạn văn sau:"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
        />
      </div>

      {/* Đoạn văn chứa chỗ trống */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Đoạn văn (Dùng &#123;&#123;1&#125;&#125;, &#123;&#123;2&#125;&#125; để đánh dấu chỗ trống)
          </label>
          <button
            type="button"
            onClick={handleInsertBlank}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold font-mono transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Chèn chỗ trống tiếp theo
          </button>
        </div>
        <textarea
          rows={4}
          value={template}
          onChange={(e) => handleTemplateChange(e.target.value)}
          placeholder="Ví dụ: Trong đêm tối, đảo Foggo bị bao phủ bởi {{1}}. Hãy thắp sáng ngọn {{2}} để xua đuổi quái vật."
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Ngân hàng từ khóa (Options) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Ngân hàng từ khóa ({options.length})
          </label>
          <button
            type="button"
            onClick={handleAddOption}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold font-mono transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm từ
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={opt.text}
                onChange={(e) => handleUpdateOptionText(opt.id, e.target.value)}
                placeholder="Nội dung từ..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />
              {options.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(opt.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thiết lập đáp án đúng cho từng ô trống */}
      {discoveredBlanks.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block">
            Thiết lập từ đúng cho từng chỗ trống:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discoveredBlanks.map((bId) => (
              <div
                key={bId}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
              >
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                  Chỗ trống &#123;&#123;{bId}&#125;&#125;
                </span>
                <select
                  value={blanks[bId] || ""}
                  onChange={(e) => handleSelectCorrectOption(bId, e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Chọn đáp án đúng --</option>
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.text}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
