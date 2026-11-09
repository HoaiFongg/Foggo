"use client";

import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
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
    if (statements.length >= 10) return;
    const newId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nextStatements = [
      ...statements,
      { id: newId, text: "" },
    ];
    const nextAnswers = {
      ...answers,
      [newId]: false, // Mặc định Sai (No) hoặc Đúng (Yes)
    };
    onChange({ ...content, statements: nextStatements }, { answers: nextAnswers });
  }

  function handleRemoveStatement(id: string) {
    if (statements.length <= 1) return;
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
      {/* Tiêu đề câu hỏi / Đề dẫn */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
          Nội dung câu hỏi / Đề bài <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={2}
          value={content?.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Ví dụ: Đọc các phát biểu sau đây và cho biết phát biểu nào Đúng, phát biểu nào Sai:"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans text-xs sm:text-sm leading-relaxed"
        />
      </div>

      {/* Ảnh đính kèm tùy chọn */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Ảnh minh họa đính kèm (không bắt buộc)</span>
        </label>
        <input
          type="url"
          value={content?.image_url || ""}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://... (dán link ảnh minh họa nếu có)"
          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
        />
      </div>

      {/* KHỐI BẢNG PHÁT BIỂU / NHẬN ĐỊNH (CHUẨN IC3 GS6) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090f1e] border border-slate-800 space-y-3">
        {/* Thanh công cụ tiêu đề bảng */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-[#38bdf8] tracking-tight">
              Bảng Phát Biểu / Nhận Định (Chuẩn IC3 GS6):
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-[#0c2340] border border-[#0284c7]/40 text-[#38bdf8] font-mono text-[11px] font-semibold">
              {statements.length} nhận định
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddStatement}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-md shadow-cyan-900/30 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm Nhận Định</span>
          </button>
        </div>

        {/* Hướng dẫn ngắn */}
        <p className="text-xs text-slate-400 flex items-center gap-1.5 leading-relaxed italic">
          <span className="not-italic">💡</span>
          <span>Nhập từng câu phát biểu và tích chọn đáp án Đúng (Yes) hoặc Sai (No) cho từng dòng.</span>
        </p>

        {/* Bảng nhận định Đúng / Sai */}
        <div className="rounded-xl border border-slate-800/90 overflow-hidden bg-[#070c18] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-white">
                <th className="py-3 px-4 bg-[#0a1224] text-slate-200">
                  Câu phát biểu / Nhận định
                </th>
                <th className="py-3 px-3 sm:px-6 bg-[#0284c7] text-center w-28 sm:w-36 text-white font-bold tracking-wide">
                  Đúng (Yes)
                </th>
                <th className="py-3 px-3 sm:px-6 bg-[#2563eb] text-center w-28 sm:w-36 text-white font-bold tracking-wide">
                  Sai (No)
                </th>
                <th className="py-3 px-3 bg-[#0a1224] text-center w-14 text-slate-300 font-medium">
                  Xóa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {statements.map((s, idx) => {
                const isTrue = answers[s.id] === true;
                const isFalse = answers[s.id] === false;

                return (
                  <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Cột 1: Nhập nội dung câu phát biểu */}
                    <td className="p-3 bg-[#070c18]">
                      <textarea
                        rows={2}
                        value={s.text}
                        onChange={(e) => handleTextChange(s.id, e.target.value)}
                        placeholder={`Nhập câu phát biểu #${idx + 1}...`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1527] border border-slate-800 text-white text-xs leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-y font-sans shadow-inner"
                      />
                    </td>

                    {/* Cột 2: Nút chọn Đúng (Yes) */}
                    <td className="p-3 text-center align-middle bg-[#04172a]/30">
                      <div className="flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAnswer(s.id, true)}
                          className={`w-full max-w-[110px] min-h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                            isTrue
                              ? "border border-[#0284c7] bg-[#0c2c4d]/80 shadow-[0_0_12px_rgba(2,132,199,0.3)]"
                              : "hover:bg-slate-800/40"
                          }`}
                          title="Chọn Đúng (Yes)"
                        >
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isTrue
                                ? "border-cyan-300 bg-[#0284c7] shadow-sm"
                                : "border-slate-600 bg-slate-800/90 hover:border-slate-500"
                            }`}
                          >
                            {isTrue ? (
                              <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                            ) : null}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Cột 3: Nút chọn Sai (No) */}
                    <td className="p-3 text-center align-middle bg-[#091638]/30">
                      <div className="flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAnswer(s.id, false)}
                          className={`w-full max-w-[110px] min-h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                            isFalse
                              ? "border border-[#2563eb] bg-[#0c1f4a]/80 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                              : "hover:bg-slate-800/40"
                          }`}
                          title="Chọn Sai (No)"
                        >
                          <span
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isFalse
                                ? "border-blue-300 bg-[#2563eb] shadow-sm"
                                : "border-slate-600 bg-slate-800/90 hover:border-slate-500"
                            }`}
                          >
                            {isFalse ? (
                              <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                            ) : null}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Cột 4: Nút Xóa */}
                    <td className="p-3 text-center align-middle bg-[#070c18]">
                      <button
                        type="button"
                        onClick={() => handleRemoveStatement(s.id)}
                        disabled={statements.length <= 1}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                        title="Xóa nhận định này"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
