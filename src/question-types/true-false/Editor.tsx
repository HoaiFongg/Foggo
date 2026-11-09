"use client";

import { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Check, X } from "lucide-react";
import type { EditorProps } from "../types";
import type { TrueFalseContent, TrueFalseAnswerKey, StatementItem } from "./schema";

export function TrueFalseEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<TrueFalseContent, TrueFalseAnswerKey>) {
  // Chuẩn hóa dữ liệu: nếu câu hỏi cũ chỉ có 1 prompt đơn lẻ, tự động chuyển thành 1 nhận định
  const rawStatements = content?.statements;
  const initialStatements: StatementItem[] =
    rawStatements && rawStatements.length > 0
      ? rawStatements
      : [
          {
            id: "s1",
            text: content?.prompt || "Trái Đất quay quanh Mặt Trời theo quỹ đạo hình elip.",
          },
        ];

  // Chuẩn hóa đáp án: lấy từ answerKey.answers hoặc từ answerKey.correct cũ
  const rawAnswers = answerKey?.answers;
  const initialAnswers: Record<string, boolean> =
    rawAnswers && Object.keys(rawAnswers).length > 0
      ? rawAnswers
      : {
          [initialStatements[0].id]:
            typeof answerKey?.correct === "boolean" ? answerKey.correct : true,
        };

  function handlePromptChange(prompt: string) {
    onChange({ ...content, prompt }, answerKey);
  }

  function handleImageUrlChange(image_url: string) {
    onChange({ ...content, image_url: image_url || null }, answerKey);
  }

  function handleAddStatement() {
    if (initialStatements.length >= 10) return;
    const newId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nextStatements: StatementItem[] = [
      ...initialStatements,
      { id: newId, text: "" },
    ];
    const nextAnswers: Record<string, boolean> = {
      ...initialAnswers,
      [newId]: false, // Mặc định là Sai, giáo viên có thể tích đổi thành Đúng
    };
    onChange(
      { ...content, statements: nextStatements },
      { ...answerKey, answers: nextAnswers }
    );
  }

  function handleRemoveStatement(id: string) {
    if (initialStatements.length <= 1) return;
    const nextStatements = initialStatements.filter((s) => s.id !== id);
    const nextAnswers = { ...initialAnswers };
    delete nextAnswers[id];
    onChange(
      { ...content, statements: nextStatements },
      { ...answerKey, answers: nextAnswers }
    );
  }

  function handleStatementTextChange(id: string, text: string) {
    const nextStatements = initialStatements.map((s) =>
      s.id === id ? { ...s, text } : s
    );
    onChange(
      { ...content, statements: nextStatements },
      { ...answerKey, answers: initialAnswers }
    );
  }

  function handleToggleAnswer(id: string, boolVal: boolean) {
    const nextAnswers: Record<string, boolean> = {
      ...initialAnswers,
      [id]: boolVal,
    };
    onChange(
      { ...content, statements: initialStatements },
      { ...answerKey, answers: nextAnswers }
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Câu dẫn / Đề bài chung */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Nội dung câu hỏi / Đề dẫn <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={2}
          value={content?.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Ví dụ: Đọc các nhận định sau đây và cho biết nhận định nào Đúng, nhận định nào Sai:"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm leading-relaxed"
        />
      </div>

      {/* 2. Ảnh đính kèm (tùy chọn) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Ảnh minh họa đính kèm (không bắt buộc)</span>
        </label>
        <input
          type="url"
          value={content?.image_url || ""}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://... (dán link ảnh nếu có)"
          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
        />
      </div>

      {/* 3. Khối danh sách các nhận định bên trong câu hỏi */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                Các nhận định bên trong câu hỏi:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs font-semibold">
                {initialStatements.length} nhận định
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              💡 Mỗi nhận định chỉ chọn <strong>Đúng</strong> hoặc <strong>Sai</strong>. Bạn có thể thêm nhiều nhận định trong một câu hoặc xóa bớt để còn 1 nhận định.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddStatement}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-900/30 active:scale-95 transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm nhận định</span>
          </button>
        </div>

        {/* Danh sách từng dòng nhận định */}
        <div className="space-y-3">
          {initialStatements.map((s, idx) => {
            const isTrue = initialAnswers[s.id] === true;
            const isFalse = initialAnswers[s.id] === false;

            return (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col md:flex-row md:items-center gap-3 hover:border-slate-700 transition-all"
              >
                {/* Số thứ tự nhận định */}
                <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-cyan-400 flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>

                {/* Ô nhập nội dung nhận định */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={s.text}
                    onChange={(e) => handleStatementTextChange(s.id, e.target.value)}
                    placeholder={`Nhập nội dung nhận định #${idx + 1}...`}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* 2 Lựa chọn duy nhất: ĐÚNG hoặc SAI */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono mr-1 hidden sm:inline">
                    Đáp án:
                  </span>

                  {/* Nút ĐÚNG */}
                  <button
                    type="button"
                    onClick={() => handleToggleAnswer(s.id, true)}
                    className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isTrue
                        ? "bg-cyan-600 text-white ring-2 ring-cyan-400 shadow-md shadow-cyan-600/30"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ĐÚNG</span>
                  </button>

                  {/* Nút SAI */}
                  <button
                    type="button"
                    onClick={() => handleToggleAnswer(s.id, false)}
                    className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isFalse
                        ? "bg-blue-600 text-white ring-2 ring-blue-400 shadow-md shadow-blue-600/30"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <X className="w-3.5 h-3.5 stroke-[3]" />
                    <span>SAI</span>
                  </button>

                  {/* Nút xóa nhận định */}
                  <button
                    type="button"
                    onClick={() => handleRemoveStatement(s.id)}
                    disabled={initialStatements.length <= 1}
                    className="p-1.5 ml-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                    title="Xóa nhận định này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
