"use client";

import { Check, X } from "lucide-react";
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
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Khối đề bài / Đề dẫn Google Material 3 (Bo góc 24px, nền sáng, bóng nhẹ) */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#4285F4]/30 inline-block">
          Bảng Nhận Định (Chuẩn IC3 GS6)
        </span>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans px-2">
          {content?.prompt || "Đọc các phát biểu sau đây và cho biết phát biểu nào Đúng (Yes), phát biểu nào Sai (No):"}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
          Tiến độ: <span className="text-[#1967D2] dark:text-[#8AB4F8] font-bold">{answeredCount}</span>/{statements.length} nhận định đã trả lời
        </p>

        {content?.image_url && (
          <div className="mt-3 max-w-sm mx-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#F8F9FA] dark:bg-slate-950 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.image_url}
              alt="Minh họa"
              className="w-full h-auto max-h-48 object-contain mx-auto rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Bảng nhận định dạng bảng Google Material 3 */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs max-h-[45vh] overflow-y-auto">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
              <th className="py-3 px-4 bg-slate-50 dark:bg-slate-800/60">
                Câu phát biểu / Nhận định
              </th>
              <th className="py-3 px-4 bg-[#E6F4EA] dark:bg-[#34A853]/20 text-[#137333] dark:text-[#81C995] text-center w-28 sm:w-36 font-bold">
                Đúng (Yes)
              </th>
              <th className="py-3 px-4 bg-[#FCE8E6] dark:bg-[#EA4335]/20 text-[#C5221F] dark:text-[#F28B82] text-center w-28 sm:w-36 font-bold">
                Sai (No)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {statements.map((s, idx) => {
              const userVal = currentAnswers[s.id];
              const isSelectedTrue = userVal === true;
              const isSelectedFalse = userVal === false;

              return (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  {/* Cột nhận định */}
                  <td className="p-4 align-middle">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#E8F0FE] text-[#1967D2] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#D2E3FC]">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                        {s.text || <span className="text-slate-400 italic">(Nhận định chưa có nội dung)</span>}
                      </p>
                    </div>
                  </td>

                  {/* Cột chọn Đúng (Yes) */}
                  <td className="p-3 text-center align-middle">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelect(s.id, true)}
                        className={`w-full max-w-[100px] py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed font-semibold text-xs shadow-xs ${
                          isSelectedTrue
                            ? "bg-[#34A853] text-white shadow-sm ring-2 ring-[#34A853]/40"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#E6F4EA] hover:text-[#137333]"
                        }`}
                        title="Chọn Đúng (Yes)"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Đúng</span>
                      </button>
                    </div>
                  </td>

                  {/* Cột chọn Sai (No) */}
                  <td className="p-3 text-center align-middle">
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelect(s.id, false)}
                        className={`w-full max-w-[100px] py-2 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed font-semibold text-xs shadow-xs ${
                          isSelectedFalse
                            ? "bg-[#EA4335] text-white shadow-sm ring-2 ring-[#EA4335]/40"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#FCE8E6] hover:text-[#C5221F]"
                        }`}
                        title="Chọn Sai (No)"
                      >
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Sai</span>
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
