"use client";

import { useState, useMemo } from "react";
import { Link2, Unlink, Check } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DragMatchContent, DragMatchUserAnswer } from "./schema";

const COLORS = [
  "border-amber-400 bg-amber-500/10 text-amber-300",
  "border-emerald-400 bg-emerald-500/10 text-emerald-300",
  "border-sky-400 bg-sky-500/10 text-sky-300",
  "border-purple-400 bg-purple-500/10 text-purple-300",
  "border-rose-400 bg-rose-500/10 text-rose-300",
  "border-teal-400 bg-teal-500/10 text-teal-300",
  "border-indigo-400 bg-indigo-500/10 text-indigo-300",
  "border-orange-400 bg-orange-500/10 text-orange-300",
];

export function DragMatchPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<DragMatchContent, DragMatchUserAnswer>) {
  const pairs = content?.pairs || [];
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Xáo trộn cố định cho cột phải dựa trên ID
  const rightOptions = useMemo(() => {
    const list = pairs.map((p) => ({ id: p.id, right: p.right }));
    // Simple deterministic shuffle so it doesn't align 1-to-1 horizontally
    return [...list].sort((a, b) => b.id.localeCompare(a.id));
  }, [pairs]);

  const currentMatches: Record<string, string> = value || {};

  function handleSelectLeft(leftId: string) {
    if (disabled) return;
    if (selectedLeft === leftId) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftId);
    }
  }

  function handleSelectRight(rightId: string) {
    if (disabled) return;

    if (!selectedLeft) {
      // Nếu chưa chọn vế trái mà đã có cặp ghép vế phải này, hủy ghép
      const existingLeft = Object.keys(currentMatches).find(
        (lId) => currentMatches[lId] === rightId
      );
      if (existingLeft) {
        const next = { ...currentMatches };
        delete next[existingLeft];
        onChange(next);
      }
      return;
    }

    // Ghép selectedLeft với rightId
    const next = { ...currentMatches };
    // Nếu vế phải này đã bị nối bởi một vế trái khác, gỡ vế đó ra
    for (const lId of Object.keys(next)) {
      if (next[lId] === rightId) {
        delete next[lId];
      }
    }

    next[selectedLeft] = rightId;
    onChange(next);
    setSelectedLeft(null);
  }

  function handleRemoveLink(leftId: string) {
    if (disabled) return;
    const next = { ...currentMatches };
    delete next[leftId];
    onChange(next);
  }

  // Gán màu cho mỗi vế trái đã ghép
  const matchColorMap = useMemo(() => {
    const map = new Map<string, string>();
    pairs.forEach((p, idx) => {
      map.set(p.id, COLORS[idx % COLORS.length]);
    });
    return map;
  }, [pairs]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Tiêu đề câu hỏi */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
          Ghép cặp tương ứng (Match Pairs)
        </span>
        <h2 className="text-lg sm:text-2xl font-black text-white leading-relaxed font-sans">
          {content?.prompt || "..."}
        </h2>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          {selectedLeft
            ? "Đã chọn vế A. Hãy chạm vào vế B tương ứng bên phải để nối!"
            : "Chạm vào một mục ở Cột A, sau đó chạm vào mục tương ứng ở Cột B."}
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

      {/* Lưới 2 cột ghép cặp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cột trái (Vế A) */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between px-2">
            <span>Cột A</span>
            <span>{Object.keys(currentMatches).length}/{pairs.length} đã nối</span>
          </div>
          {pairs.map((p, idx) => {
            const isSelected = selectedLeft === p.id;
            const matchedRightId = currentMatches[p.id];
            const colorClass = matchColorMap.get(p.id) || COLORS[0];

            return (
              <div
                key={p.id}
                onClick={() => handleSelectLeft(p.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-400/50"
                    : matchedRightId
                    ? `${colorClass} shadow-sm`
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-slate-400 flex items-center justify-center shrink-0">
                    A{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {p.left}
                  </span>
                </div>

                {matchedRightId ? (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveLink(p.id);
                    }}
                    className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                    title="Gỡ nối"
                  >
                    <Unlink className="w-4 h-4" />
                  </button>
                ) : (
                  <Link2 className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Cột phải (Vế B) */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between px-2">
            <span>Cột B</span>
            <span>Mục tiêu ghép</span>
          </div>
          {rightOptions.map((item, idx) => {
            // Tìm xem rightId này có đang được nối bởi vế trái nào không
            const connectedLeftId = Object.keys(currentMatches).find(
              (lId) => currentMatches[lId] === item.id
            );
            const colorClass = connectedLeftId
              ? matchColorMap.get(connectedLeftId) || COLORS[0]
              : "";

            return (
              <div
                key={item.id}
                onClick={() => handleSelectRight(item.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  connectedLeftId
                    ? `${colorClass} shadow-sm`
                    : selectedLeft
                    ? "bg-slate-900/90 border-dashed border-amber-500/50 hover:border-amber-400 hover:bg-amber-500/10 text-white"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300"
                } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-slate-400 flex items-center justify-center shrink-0">
                    B{idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {item.right}
                  </span>
                </div>

                {connectedLeftId && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
