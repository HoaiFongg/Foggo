"use client";

import { Check, X } from "lucide-react";
import type { PlayerProps } from "../types";
import type { TrueFalseContent, TrueFalseUserAnswer, StatementItem } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

export function TrueFalsePlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<TrueFalseContent, TrueFalseUserAnswer>) {
  const { t, isEn } = useLanguage();
  // Chuẩn hóa danh sách nhận định
  const rawStatements = content?.statements;
  const statements: StatementItem[] =
    rawStatements && rawStatements.length > 0
      ? rawStatements
      : [
          {
            id: "s1",
            text: content?.prompt || (isEn ? "Statement" : "Nhận định"),
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
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* 1. Phần đề bài / Câu dẫn Google Material 3 (Bo góc lớn 24px, nền sáng, bóng nhẹ) */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#4285F4]/30 inline-block">
          {t.questionTypes.true_false}
        </span>

        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans px-2">
          {content?.prompt ||
            (isEn
              ? "Evaluate the following statements as True or False:"
              : "Đọc các nhận định sau đây và chọn Đúng hoặc Sai:")}
        </h2>

        {!isSingle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            {isEn ? `Progress: ` : `Tiến độ: `}
            <span className="text-[#1967D2] dark:text-[#8AB4F8] font-bold">{answeredCount}</span>/{statements.length}{" "}
            {isEn ? "statements answered" : "nhận định đã trả lời"}
          </p>
        )}

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

      {/* 2. Danh sách nhận định và các nút chọn ĐÚNG / SAI chuẩn Google Material 3 */}
      {isSingle ? (
        /* Trường hợp 1 nhận định đơn lẻ: Hiển thị thẻ nhận định & 2 thẻ lớn ĐÚNG (Xanh lá) / SAI (Đỏ) */
        <div className="space-y-4">
          <div className="py-4 px-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs">
            <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
              {statements[0].text}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Thẻ ĐÚNG (Google Green #34A853 / Nền nhạt #E6F4EA) */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(statements[0].id, true)}
              className={`min-h-[76px] sm:min-h-[84px] p-5 rounded-2xl border-2 flex items-center justify-center gap-3.5 transition-all duration-200 active:scale-98 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 shadow-xs hover:shadow-sm ${
                currentAnswers[statements[0].id] === true
                  ? "bg-[#E6F4EA] border-[#34A853] text-[#137333] dark:bg-[#34A853]/20 dark:border-[#34A853] dark:text-white shadow-sm ring-2 ring-[#34A853]/30 scale-[1.01]"
                  : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#34A853]/60 hover:bg-[#E6F4EA]/30"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentAnswers[statements[0].id] === true
                    ? "bg-[#34A853] text-white shadow-xs scale-105"
                    : "bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] dark:bg-[#34A853]/20 dark:text-[#81C995]"
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="text-base sm:text-lg font-bold font-sans tracking-wide block">
                  {isEn ? "TRUE" : "ĐÚNG"}
                </span>
                <span className="text-[11px] font-medium opacity-80 block">
                  {isEn ? "Mark as correct" : "Nhận định chính xác"}
                </span>
              </div>
            </button>

            {/* Thẻ SAI (Google Red #EA4335 / Nền nhạt #FCE8E6) */}
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(statements[0].id, false)}
              className={`min-h-[76px] sm:min-h-[84px] p-5 rounded-2xl border-2 flex items-center justify-center gap-3.5 transition-all duration-200 active:scale-98 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 shadow-xs hover:shadow-sm ${
                currentAnswers[statements[0].id] === false
                  ? "bg-[#FCE8E6] border-[#EA4335] text-[#C5221F] dark:bg-[#EA4335]/20 dark:border-[#EA4335] dark:text-white shadow-sm ring-2 ring-[#EA4335]/30 scale-[1.01]"
                  : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#EA4335]/60 hover:bg-[#FCE8E6]/30"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentAnswers[statements[0].id] === false
                    ? "bg-[#EA4335] text-white shadow-xs scale-105"
                    : "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF] dark:bg-[#EA4335]/20 dark:text-[#F28B82]"
                }`}
              >
                <X className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="text-left">
                <span className="text-base sm:text-lg font-bold font-sans tracking-wide block">
                  {isEn ? "FALSE" : "SAI"}
                </span>
                <span className="text-[11px] font-medium opacity-80 block">
                  {isEn ? "Mark as incorrect" : "Nhận định sai"}
                </span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Trường hợp nhiều nhận định: Mỗi dòng là thẻ bo góc 16px kèm 2 nút Pill ĐÚNG / SAI */
        <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
          {statements.map((s, idx) => {
            const isTrue = currentAnswers[s.id] === true;
            const isFalse = currentAnswers[s.id] === false;

            return (
              <div
                key={s.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-xs hover:shadow-sm transition-all"
              >
                {/* Nội dung nhận định */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] font-bold font-sans text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#D2E3FC] dark:border-[#4285F4]/30">
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed break-words whitespace-normal flex-1">
                    {s.text || <span className="text-slate-400 italic">(Nhận định chưa có nội dung)</span>}
                  </p>
                </div>

                {/* 2 Nút Lựa Chọn Dạng Pill Bo Tròn (Google Green & Red) */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(s.id, true)}
                    className={`px-4 py-2 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed shadow-xs ${
                      isTrue
                        ? "bg-[#34A853] text-white shadow-sm ring-2 ring-[#34A853]/40"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#E6F4EA] hover:text-[#137333] hover:border-[#CEEAD6]"
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{isEn ? "TRUE" : "ĐÚNG"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelect(s.id, false)}
                    className={`px-4 py-2 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed shadow-xs ${
                      isFalse
                        ? "bg-[#EA4335] text-white shadow-sm ring-2 ring-[#EA4335]/40"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#FCE8E6] hover:text-[#C5221F] hover:border-[#FAD2CF]"
                    }`}
                  >
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>{isEn ? "FALSE" : "SAI"}</span>
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
