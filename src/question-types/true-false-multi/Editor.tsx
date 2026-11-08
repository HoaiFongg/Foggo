"use client";

import { Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import type { EditorProps } from "../types";
import type { TrueFalseMultiContent, TrueFalseMultiAnswerKey } from "./schema";

export function TrueFalseMultiEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<TrueFalseMultiContent, TrueFalseMultiAnswerKey>) {
  const statements = content?.statements || [];
  const answers = answerKey?.answers || {};

  function handlePromptChange(val: string) {
    onChange({ ...content, prompt: val }, answerKey);
  }

  function handleImageUrlChange(val: string) {
    onChange({ ...content, image_url: val || undefined }, answerKey);
  }

  function handleAddStatement() {
    if (statements.length >= 8) return;
    const newId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nextStatements = [
      ...statements,
      { id: newId, text: `Mệnh đề ${statements.length + 1}` },
    ];
    const nextAnswers = {
      ...answers,
      [newId]: true,
    };
    onChange({ ...content, statements: nextStatements }, { answers: nextAnswers });
  }

  function handleRemoveStatement(id: string) {
    if (statements.length <= 2) return;
    const nextStatements = statements.filter((s) => s.id !== id);
    const nextAnswers = { ...answers };
    delete nextAnswers[id];
    onChange({ ...content, statements: nextStatements }, { answers: nextAnswers });
  }

  function handleTextChange(id: string, text: string) {
    const nextStatements = statements.map((s) =>
      s.id === id ? { ...s, text } : s
    );
    onChange({ ...content, statements: nextStatements }, answerKey);
  }

  function handleToggleAnswer(id: string, val: boolean) {
    const nextAnswers = {
      ...answers,
      [id]: val,
    };
    onChange(content, { answers: nextAnswers });
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề câu hỏi */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Nội dung câu hỏi / Yêu cầu
        </label>
        <textarea
          rows={3}
          value={content?.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Ví dụ: Đọc các mệnh đề sau và xác định Đúng hay Sai..."
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
          placeholder="https://example.com/diagram.png"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-sm"
        />
      </div>

      {/* Danh sách mệnh đề */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Các mệnh đề khẳng định ({statements.length}/8)
          </label>
          {statements.length < 8 && (
            <button
              type="button"
              onClick={handleAddStatement}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 text-xs font-bold font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm mệnh đề
            </button>
          )}
        </div>

        <div className="space-y-3">
          {statements.map((s, idx) => {
            const isCorrect = answers[s.id] ?? true;

            return (
              <div
                key={s.id}
                className="p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                </div>

                <input
                  type="text"
                  value={s.text}
                  onChange={(e) => handleTextChange(s.id, e.target.value)}
                  placeholder="Nhập nội dung mệnh đề..."
                  className="flex-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400"
                />

                {/* Chọn Đúng / Sai */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleAnswer(s.id, true)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                      isCorrect
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đúng
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleAnswer(s.id, false)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                      !isCorrect
                        ? "bg-rose-500/20 border-rose-400 text-rose-300 shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Sai
                  </button>

                  {statements.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStatement(s.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

