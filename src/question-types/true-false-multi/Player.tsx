"use client";

import type { PlayerProps } from "../types";
import type { TrueFalseMultiContent, TrueFalseMultiUserAnswer } from "./schema";

export function TrueFalseMultiPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<TrueFalseMultiContent, TrueFalseMultiUserAnswer>) {
  const statements = content?.statements || [];
  const currentAnswers: Record<string, boolean> = value || {};

  function handleSelect(id: string, boolVal: boolean) {
    if (disabled) return;
    onChange({
      ...currentAnswers,
      [id]: boolVal,
    });
  }

  const answeredCount = Object.keys(currentAnswers).length;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Khối đề bài / Đề dẫn */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl space-y-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
          Bảng Nhận Định (Chuẩn IC3 GS6)
        </span>
        <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed font-sans">
          {content?.prompt || "Đọc các phát biểu sau đây và cho biết phát biểu nào Đúng (Yes), phát biểu nào Sai (No):"}
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Tiến độ: <span className="text-cyan-400 font-bold">{answeredCount}</span>/{statements.length} nhận định đã trả lời
        </p>

        {content?.image_url && (
          <div className="mt-3 max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Minh họa"
              className="w-full h-auto max-h-52 object-contain mx-auto"
            />
          </div>
        )}
      </div>

      {/* Bảng nhận định dạng bảng IC3 GS6 */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-bold text-white">
              <th className="py-3.5 px-4 bg-slate-900/90 text-slate-200">
                Câu phát biểu / Nhận định
              </th>
              <th className="py-3.5 px-3 sm:px-6 bg-[#0284c7] text-center w-28 sm:w-36 text-white font-bold tracking-wide">
                Đúng (Yes)
              </th>
              <th className="py-3.5 px-3 sm:px-6 bg-[#2563eb] text-center w-28 sm:w-36 text-white font-bold tracking-wide">
                Sai (No)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {statements.map((s, idx) => {
              const userVal = currentAnswers[s.id];
              const isSelectedTrue = userVal === true;
              const isSelectedFalse = userVal === false;

              return (
                <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Cột nhận định */}
                  <td className="p-4 align-middle bg-[#070c18]">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                        {s.text || <span className="text-slate-600 italic">(Nhận định chưa có nội dung)</span>}
                      </p>
                    </div>
                  </td>

                  {/* Cột chọn Đúng (Yes) */}
                  <td className="p-3 text-center align-middle bg-[#04172a]/30">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelect(s.id, true)}
                        className={`w-full max-w-[100px] min-h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                          isSelectedTrue
                            ? "border border-[#0284c7] bg-[#0c2c4d]/80 shadow-[0_0_12px_rgba(2,132,199,0.3)] ring-1 ring-cyan-400/60"
                            : "hover:bg-slate-800/40"
                        }`}
                        title="Chọn Đúng (Yes)"
                      >
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelectedTrue
                              ? "border-cyan-300 bg-[#0284c7] shadow-sm"
                              : "border-slate-600 bg-slate-800/90 hover:border-slate-500"
                          }`}
                        >
                          {isSelectedTrue ? (
                            <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                          ) : null}
                        </span>
                      </button>
                    </div>
                  </td>

                  {/* Cột chọn Sai (No) */}
                  <td className="p-3 text-center align-middle bg-[#091638]/30">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelect(s.id, false)}
                        className={`w-full max-w-[100px] min-h-[42px] rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                          isSelectedFalse
                            ? "border border-[#2563eb] bg-[#0c1f4a]/80 shadow-[0_0_12px_rgba(37,99,235,0.3)] ring-1 ring-blue-400/60"
                            : "hover:bg-slate-800/40"
                        }`}
                        title="Chọn Sai (No)"
                      >
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelectedFalse
                              ? "border-blue-300 bg-[#2563eb] shadow-sm"
                              : "border-slate-600 bg-slate-800/90 hover:border-slate-500"
                          }`}
                        >
                          {isSelectedFalse ? (
                            <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                          ) : null}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
