"use client";

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import type { EditorProps } from "../types";
import type { DragOrderContent, DragOrderAnswerKey } from "./schema";

export function DragOrderEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<DragOrderContent, DragOrderAnswerKey>) {
  const items = content.items || [];

  function handlePromptChange(prompt: string) {
    onChange({ ...content, prompt }, answerKey);
  }

  function handleItemTextChange(id: string, text: string) {
    const nextItems = items.map((it) => (it.id === id ? { ...it, text } : it));
    onChange({ ...content, items: nextItems }, answerKey);
  }

  function handleMove(idx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const nextItems = [...items];
    const temp = nextItems[idx];
    nextItems[idx] = nextItems[targetIdx];
    nextItems[targetIdx] = temp;

    const nextOrder = nextItems.map((it) => it.id);
    onChange({ ...content, items: nextItems }, { ...answerKey, correct_order: nextOrder });
  }

  function handleAddItem() {
    if (items.length >= 8) return;
    const newId = `item_${Date.now()}`;
    const nextItems = [...items, { id: newId, text: "" }];
    const nextOrder = nextItems.map((it) => it.id);
    onChange({ ...content, items: nextItems }, { ...answerKey, correct_order: nextOrder });
  }

  function handleRemoveItem(id: string) {
    if (items.length <= 2) return;
    const nextItems = items.filter((it) => it.id !== id);
    const nextOrder = nextItems.map((it) => it.id);
    onChange({ ...content, items: nextItems }, { ...answerKey, correct_order: nextOrder });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
          Yêu cầu sắp xếp thứ tự <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={2}
          value={content.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="ví dụ: Sắp xếp các thời kỳ lịch sử theo trình tự thời gian (sớm → muộn)..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono block">
            Thứ tự ĐÚNG (Từ trên xuống dưới)
          </label>
          <span className="text-[11px] text-slate-400">
            Học sinh khi chơi sẽ nhận danh sách bị xáo trộn và cần kéo thả để xếp lại đúng như thứ tự dưới đây.
          </span>
        </div>

        {items.length < 8 && (
          <button
            type="button"
            onClick={handleAddItem}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm mục</span>
          </button>
        )}
      </div>

      {/* Danh sách các mục */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              {idx + 1}
            </div>

            <input
              type="text"
              value={item.text}
              onChange={(e) => handleItemTextChange(item.id, e.target.value)}
              placeholder={`Nội dung mục thứ ${idx + 1}...`}
              className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-slate-600"
            />

            <div className="flex items-center gap-1">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => handleMove(idx, "up")}
                  className="p-1 text-slate-400 hover:text-amber-400"
                  title="Di chuyển lên"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              {idx < items.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleMove(idx, "down")}
                  className="p-1 text-slate-400 hover:text-amber-400"
                  title="Di chuyển xuống"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
              {items.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                  title="Xóa mục này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

