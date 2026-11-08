"use client";

import { Plus, Trash2, Link2, Sparkles } from "lucide-react";
import type { EditorProps } from "../types";
import type { DragMatchContent, DragMatchAnswerKey } from "./schema";

export function DragMatchEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<DragMatchContent, DragMatchAnswerKey>) {
  const pairs = content?.pairs || [];

  function handlePromptChange(val: string) {
    onChange({ ...content, prompt: val }, answerKey);
  }

  function handleImageUrlChange(val: string) {
    onChange({ ...content, image_url: val || undefined }, answerKey);
  }

  function handleAddPair() {
    if (pairs.length >= 8) return;
    const newId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nextPairs = [
      ...pairs,
      { id: newId, left: `Khái niệm ${pairs.length + 1}`, right: `Ý nghĩa ${pairs.length + 1}` },
    ];
    const nextMatches = {
      ...(answerKey?.matches || {}),
      [newId]: newId,
    };
    onChange({ ...content, pairs: nextPairs }, { matches: nextMatches });
  }

  function handleRemovePair(id: string) {
    if (pairs.length <= 2) return;
    const nextPairs = pairs.filter((p) => p.id !== id);
    const nextMatches = { ...(answerKey?.matches || {}) };
    delete nextMatches[id];
    onChange({ ...content, pairs: nextPairs }, { matches: nextMatches });
  }

  function handleUpdatePair(id: string, side: "left" | "right", val: string) {
    const nextPairs = pairs.map((p) =>
      p.id === id ? { ...p, [side]: val } : p
    );
    onChange({ ...content, pairs: nextPairs }, answerKey);
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề câu hỏi */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Nội dung câu hỏi / Yêu cầu ghép cặp
        </label>
        <textarea
          rows={3}
          value={content?.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Ví dụ: Ghép mỗi nguyên tố hóa học với ký hiệu tương ứng..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
        />
      </div>

      {/* Ảnh đính kèm */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Link ảnh minh họa (Không bắt buộc)
        </label>
        <input
          type="url"
          value={content?.image_url || ""}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://example.com/illustration.png"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-sm"
        />
      </div>

      {/* Danh sách các cặp ghép */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
              Các cặp cần ghép ({pairs.length}/8)
            </label>
            <p className="text-[11px] text-slate-500">
              Nhập vế trái và vế phải tương ứng. Hệ thống sẽ xáo trộn ngẫu nhiên cột phải khi học sinh chơi.
            </p>
          </div>
          {pairs.length < 8 && (
            <button
              type="button"
              onClick={handleAddPair}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm cặp
            </button>
          )}
        </div>

        <div className="space-y-3">
          {pairs.map((p, idx) => (
            <div
              key={p.id}
              className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold shrink-0">
                  Vế A:
                </span>
              </div>

              {/* Vế trái */}
              <input
                type="text"
                value={p.left}
                onChange={(e) => handleUpdatePair(p.id, "left", e.target.value)}
                placeholder="Nội dung vế trái (Ví dụ: Oxi)"
                className="w-full sm:flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
              />

              <div className="text-slate-600 hidden sm:block">
                <Link2 className="w-4 h-4" />
              </div>

              {/* Vế phải */}
              <div className="flex items-center gap-2 w-full sm:flex-1">
                <span className="text-xs text-emerald-400 font-mono font-bold shrink-0 sm:hidden">
                  Vế B:
                </span>
                <input
                  type="text"
                  value={p.right}
                  onChange={(e) => handleUpdatePair(p.id, "right", e.target.value)}
                  placeholder="Nội dung vế phải tương ứng (Ví dụ: O)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Nút xóa */}
              {pairs.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemovePair(p.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 self-end sm:self-center"
                  title="Xóa cặp này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

