"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DropdownListContent, DropdownListUserAnswer } from "./schema";
import { useLanguage } from "@/lib/i18n/useLanguage";

export function DropdownListPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<DropdownListContent, DropdownListUserAnswer>) {
  const { t, isEn } = useLanguage();
  const prompt = content?.prompt || "";
  // Xử lý dữ liệu tương thích nếu câu hỏi cũ chỉ lưu {D} trong prompt
  const passage =
    content?.passage !== undefined
      ? content.passage
      : prompt.includes("{D}")
      ? prompt
      : "";

  const effectivePrompt =
    content?.passage !== undefined
      ? prompt
      : prompt.includes("{D}")
      ? "Đối với mỗi nhận định sau đây, hãy lựa chọn câu trả lời thích hợp từ danh sách sổ xuống:"
      : prompt;

  const dropdowns = content?.dropdowns || [];
  const currentAnswers: Record<string, string> = value || {};

  // Trạng thái mở menu cho slot nào
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  function handleSelectOption(slotId: string, optVal: string) {
    if (disabled) return;
    onChange({
      ...currentAnswers,
      [slotId]: optVal,
    });
    setActiveSlotId(null);
  }

  // Tách đoạn văn bản nhận định theo {D} và <br>
  const segments = (passage || prompt).split(/(\{D\}|<br\s*\/?>)/gi);

  // Đếm tiến độ
  const answeredCount = Object.keys(currentAnswers).filter(
    (k) => currentAnswers[k] && currentAnswers[k].trim() !== ""
  ).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* 1. KHỐI CÂU HỎI / ĐỀ BÀI (Ở PHÍA TRÊN) - GOOGLE MATERIAL 3 */}
      <div className="py-4 px-5 sm:py-5 sm:px-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center shadow-xs space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1967D2] dark:bg-[#4285F4]/20 dark:text-[#8AB4F8] border border-[#D2E3FC] dark:border-[#4285F4]/30 inline-block">
          {t.questionTypes.dropdown_list}
        </span>

        <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-relaxed font-sans px-2">
          {effectivePrompt || "Đọc các nhận định dưới đây và chọn đáp án thích hợp từ danh sách sổ xuống:"}
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
          Tiến độ: <span className="text-[#1967D2] dark:text-[#8AB4F8] font-bold">{answeredCount}</span>/{dropdowns.length} vị trí đã chọn
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

      {/* 2. KHỐI NHẬN ĐỊNH BÊN DƯỚI (CÓ DANH SÁCH SỔ XUỐNG DẠNG PILL) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-loose shadow-xs relative">
        {(() => {
          let slotCounter = 0;

          return segments.map((seg, idx) => {
            if (seg.toUpperCase() === "{D}") {
              slotCounter++;
              const currentSlot = dropdowns[slotCounter - 1];
              const slotId = currentSlot?.id || `d${slotCounter}`;
              const selectedVal = currentAnswers[slotId];
              const isOpen = activeSlotId === slotId;
              const hasAnswered = Boolean(selectedVal);

              return (
                <span key={idx} className="relative inline-block mx-1.5 my-1 align-middle">
                  {/* Nút danh sách sổ xuống dạng Pill Google Material 3 */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveSlotId(isOpen ? null : slotId)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                      hasAnswered
                        ? "bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-sm ring-2 ring-[#4285F4]/30"
                        : "bg-[#F8F9FA] dark:bg-slate-800 hover:bg-[#E8F0FE] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
                    }`}
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span className="break-words whitespace-normal">{selectedVal || (isEn ? "Select..." : "Chọn...")}</span>
                  </button>

                  {/* Popup Menu sổ xuống khi nhấn vào */}
                  {isOpen && currentSlot && (
                    <>
                      {/* Lớp nền đóng khi click ra ngoài */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setActiveSlotId(null)}
                      />

                      {/* Dropdown Menu sổ xuống */}
                      <div className="absolute left-0 mt-2 z-50 min-w-[180px] max-w-[360px] sm:max-w-md py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {isEn ? `Position #${slotCounter}` : `Vị trí #${slotCounter}`}
                        </div>
                        <div className="max-h-52 overflow-y-auto py-1">
                          {currentSlot.options.map((opt, oIdx) => {
                            const isSelected = selectedVal === opt;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSelectOption(slotId, opt)}
                                className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-[#E8F0FE] text-[#1967D2] font-semibold dark:bg-[#4285F4]/20 dark:text-white"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                              >
                                <span className="break-words whitespace-normal leading-relaxed">{opt}</span>
                                {isSelected && <Check className="w-4 h-4 stroke-[3] text-[#4285F4] shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </span>
              );
            }

            if (/^<br\s*\/?>$/i.test(seg)) {
              return <br key={idx} />;
            }

            return <span key={idx}>{seg}</span>;
          });
        })()}
      </div>
    </div>
  );
}
