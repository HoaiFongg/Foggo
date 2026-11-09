"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { PlayerProps } from "../types";
import type { DropdownListContent, DropdownListUserAnswer } from "./schema";

export function DropdownListPlayer({
  content,
  value = {},
  onChange,
  disabled = false,
}: PlayerProps<DropdownListContent, DropdownListUserAnswer>) {
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
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* 1. KHỐI CÂU HỎI / ĐỀ BÀI (Ở PHÍA TRÊN) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 text-center shadow-xl space-y-2.5">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block">
          Câu hỏi lựa chọn theo danh sách
        </span>

        {/* Câu hỏi ở phía trên */}
        <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed font-sans px-2">
          {effectivePrompt || "Đọc các nhận định dưới đây và chọn đáp án thích hợp từ danh sách sổ xuống:"}
        </h2>

        <p className="text-xs text-slate-400 font-mono">
          Tiến độ: <span className="text-blue-400 font-bold">{answeredCount}</span>/{dropdowns.length} vị trí đã chọn
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

      {/* 2. KHỐI NHẬN ĐỊNH BÊN DƯỚI (CÓ DANH SÁCH SỔ XUỐNG KHI NHẤN VÀO) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 text-sm sm:text-base leading-loose shadow-2xl relative">
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
                  {/* Nút danh sách sổ xuống (theo đúng mẫu ảnh người dùng) */}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setActiveSlotId(isOpen ? null : slotId)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed ${
                      hasAnswered
                        ? "bg-[#0066ff] hover:bg-blue-600 text-white shadow-blue-900/40 ring-2 ring-blue-400/60"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 ring-1 ring-slate-600/50"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span>{selectedVal || "Chọn..."}</span>
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
                      <div className="absolute left-0 mt-1.5 z-50 min-w-[140px] max-w-[240px] py-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3 py-1 border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          Vị trí #{slotCounter}
                        </div>
                        <div className="max-h-48 overflow-y-auto py-1">
                          {currentSlot.options.map((opt, oIdx) => {
                            const isSelected = selectedVal === opt;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSelectOption(slotId, opt)}
                                className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-blue-600 text-white font-bold"
                                    : "text-slate-200 hover:bg-slate-800"
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
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
