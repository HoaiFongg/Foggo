"use client";

import { Check, X } from "lucide-react";
import type { PlayerProps } from "../types";
import type { TrueFalseContent, TrueFalseUserAnswer, StatementItem } from "./schema";

export function TrueFalsePlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<TrueFalseContent, TrueFalseUserAnswer>) {
  // Chuẩn hóa danh sách nhận định
  const rawStatements = content?.statements;
  const statements: StatementItem[] =
    rawStatements && rawStatements.length > 0
      ? rawStatements
      : [
          {
            id: "s1",
            text: content?.prompt || "...",
          },
        ];

  // Chuẩn hóa câu trả lời của học sinh: Record<statement_id, boolean>
  const currentAnswers: Record<string, boolean> =
    typeof value === "object" && value !== null
      ? (value as Record<string, boolean>)
      : typeof value === "boolean"
      ? { [statements[0].id]: value }
      : {};

  function handleSelect(id: string, boolVal: boolean) {
    if (disabled) return;
    const nextAnswers = {
      ...currentAnswers,
      [id]: boolVal,
    };
    onChange(nextAnswers);
  }

  const isSingle = statements.length === 1;
  const answeredCount = Object.keys(currentAnswers).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-2.5 sm:space-y-3">
      {/* 1. Phần đề bài / Câu dẫn */}
      <div className="py-2.5 px-4 sm:py-3 sm:px-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-lg space-y-1.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 inline-block">
          Câu hỏi Đúng / Sai
        </span>

        <h2 className="text-xs sm:text-sm md:text-base font-bold text-white leading-snug font-sans">
          {content?.prompt || "Đọc các nhận định sau đây và chọn Đúng hoặc Sai:"}
        </h2>

        {!isSingle && (
          <p className="text-[11px] text-slate-400 font-mono">
            Tiến độ: <span className="text-cyan-400 font-bold">{answeredCount}</span>/{statements.length} nhận định đã trả lời
          </p>
        )}

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

      {/* 2. Danh sách nhận định và các nút chọn ĐÚNG / SAI */}
      {isSingle ? (
        /* Trường hợp 1 nhận định đơn lẻ: Hiển thị 2 nút ĐÚNG / SAI to nổi bật */
        <div className="space-y-2.5">
          <div className="py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              {statements[0].text}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Nút ĐÚNG */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(statements[0].id, true)}
              className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
                currentAnswers[statements[0].id] === true
                  ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-[1.01]"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/10"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  currentAnswers[statements[0].id] === true
                    ? "bg-cyan-500 text-slate-950 shadow-md scale-105"
                    : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wider font-mono">
                ĐÚNG
              </span>
            </button>

            {/* Nút SAI */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(statements[0].id, false)}
              className={`p-3 sm:p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
                currentAnswers[statements[0].id] === false
                  ? "bg-blue-500/20 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)] scale-[1.01]"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/10"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  currentAnswers[statements[0].id] === false
                    ? "bg-blue-500 text-slate-950 shadow-md scale-105"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                <X className="w-5 h-5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wider font-mono">
                SAI
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Trường hợp nhiều nhận định: Hiển thị từng nhận định kèm nút Đúng / Sai tương ứng */
        <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1">
          {statements.map((s, idx) => {
            const isTrue = currentAnswers[s.id] === true;
            const isFalse = currentAnswers[s.id] === false;

            return (
              <div
                key={s.id}
                className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm hover:border-slate-700 transition-colors"
              >
                {/* Nội dung nhận định */}
                <div className="flex items-start gap-2.5 flex-1">
                  <span className="w-5 h-5 rounded-md bg-slate-950 border border-slate-800 font-mono text-[10px] font-bold text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
                    {s.text || <span className="text-slate-600 italic">(Nhận định chưa có nội dung)</span>}
                  </p>
                </div>

                {/* 2 Nút lựa chọn: ĐÚNG hoặc SAI */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(s.id, true)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                      isTrue
                        ? "bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>ĐÚNG</span>
                  </button>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(s.id, false)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                      isFalse
                        ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] ring-2 ring-blue-400"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                    <span>SAI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
