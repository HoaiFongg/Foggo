"use client";

import { Check } from "lucide-react";
import type { PlayerProps } from "../types";
import type { SingleChoiceContent, SingleChoiceUserAnswer } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

const GOOGLE_OPTION_THEMES = [
  {
    badge: "bg-[#E8F0FE] text-[#1967D2] border-[#D2E3FC] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] dark:border-[#4285F4]/40",
    hover: "hover:border-[#4285F4]/60 hover:bg-[#E8F0FE]/40 dark:hover:bg-[#4285F4]/10",
    selected: "bg-[#E8F0FE] border-[#4285F4] text-[#1967D2] dark:bg-[#4285F4]/20 dark:border-[#4285F4] dark:text-white shadow-sm ring-2 ring-[#4285F4]/30",
    selectedBadge: "bg-[#4285F4] text-white border-[#4285F4]",
  },
  {
    badge: "bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF] dark:bg-[#EA4335]/20 dark:text-[#F28B82] dark:border-[#EA4335]/40",
    hover: "hover:border-[#EA4335]/60 hover:bg-[#FCE8E6]/40 dark:hover:bg-[#EA4335]/10",
    selected: "bg-[#FCE8E6] border-[#EA4335] text-[#C5221F] dark:bg-[#EA4335]/20 dark:border-[#EA4335] dark:text-white shadow-sm ring-2 ring-[#EA4335]/30",
    selectedBadge: "bg-[#EA4335] text-white border-[#EA4335]",
  },
  {
    badge: "bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3] dark:bg-[#FBBC05]/20 dark:text-[#FDD663] dark:border-[#FBBC05]/40",
    hover: "hover:border-[#FBBC05]/60 hover:bg-[#FEF7E0]/40 dark:hover:bg-[#FBBC05]/10",
    selected: "bg-[#FEF7E0] border-[#FBBC05] text-[#B06000] dark:bg-[#FBBC05]/20 dark:border-[#FBBC05] dark:text-white shadow-sm ring-2 ring-[#FBBC05]/30",
    selectedBadge: "bg-[#FBBC05] text-slate-900 border-[#FBBC05]",
  },
  {
    badge: "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6] dark:bg-[#34A853]/20 dark:text-[#81C995] dark:border-[#34A853]/40",
    hover: "hover:border-[#34A853]/60 hover:bg-[#E6F4EA]/40 dark:hover:bg-[#34A853]/10",
    selected: "bg-[#E6F4EA] border-[#34A853] text-[#137333] dark:bg-[#34A853]/20 dark:border-[#34A853] dark:text-white shadow-sm ring-2 ring-[#34A853]/30",
    selectedBadge: "bg-[#34A853] text-white border-[#34A853]",
  },
];

const LABELS = ["A", "B", "C", "D", "E", "F"];

export function SingleChoicePlayer({
  content,
  value,
  onChange,
  disabled = false,
}: PlayerProps<SingleChoiceContent, SingleChoiceUserAnswer>) {
  const { t, isEn } = useLanguage();
  const options = content?.options || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Tiêu đề câu hỏi Google Material 3 (Bo góc lớn 24px, nền sáng, bóng nhẹ) */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#4285F4]/30 inline-block">
          {t.questionTypes.single_choice}
        </span>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans break-words whitespace-normal px-2">
          {content?.prompt ||
            (isEn
              ? "Select the correct answer from the options below:"
              : "Lựa chọn đáp án chính xác nhất trong các phương án dưới đây:")}
        </h2>

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

      {/* Lưới các thẻ đáp án lớn chuẩn Google Material 3 (16px bo góc, min-h 64px, dễ bấm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {options.map((opt, idx) => {
          const isSelected = value === opt.id;
          const theme = GOOGLE_OPTION_THEMES[idx % GOOGLE_OPTION_THEMES.length];
          const label = LABELS[idx] || `${idx + 1}`;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={`min-h-[64px] sm:min-h-[72px] p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between gap-3.5 transition-all duration-200 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 shadow-xs hover:shadow-sm ${
                isSelected
                  ? theme.selected
                  : `bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 ${theme.hover}`
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Badge A, B, C, D 4 màu Google */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-bold font-sans text-sm shrink-0 transition-all ${
                    isSelected ? `${theme.selectedBadge} shadow-xs scale-105` : theme.badge
                  }`}
                >
                  {label}
                </div>

                <span className="text-sm sm:text-base font-medium leading-relaxed break-words whitespace-normal">
                  {opt.text}
                </span>
              </div>

              {/* Dấu tích khi được chọn */}
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-[#4285F4] text-white flex items-center justify-center shrink-0 shadow-xs animate-in zoom-in-75 duration-150">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
