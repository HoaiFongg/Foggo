"use client";

import { useRef, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, ChevronDown, Check, CornerDownLeft, HelpCircle } from "lucide-react";
import type { EditorProps } from "../types";
import type { DropdownListContent, DropdownListAnswerKey, DropdownSlot } from "./schema";

export function DropdownListEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<DropdownListContent, DropdownListAnswerKey>) {
  const passageRef = useRef<HTMLTextAreaElement>(null);

  const prompt = content?.prompt || "";
  // Xử lý dữ liệu tương thích: nếu chưa có passage nhưng prompt có {D}, dùng prompt làm passage
  const passage =
    content?.passage !== undefined
      ? content.passage
      : prompt.includes("{D}")
      ? prompt
      : "{D} Nhận định thứ nhất...<br>\n{D} Nhận định thứ hai...";

  const effectivePrompt =
    content?.passage !== undefined
      ? prompt
      : prompt.includes("{D}")
      ? "Đối với mỗi nhận định sau đây, hãy chọn câu trả lời thích hợp từ danh sách sổ xuống:"
      : prompt;

  const dropdowns = content?.dropdowns || [];
  const answers = answerKey?.answers || {};

  // Đếm số lượng {D} trong nội dung nhận định (passage)
  const matches = passage.match(/\{D\}/gi) || [];
  const requiredCount = matches.length;

  // Đồng bộ số lượng dropdowns cấu hình với số lượng {D} xuất hiện trong passage
  useEffect(() => {
    let nextDropdowns = [...dropdowns];
    let changed = false;

    // Nếu số lượng {D} nhiều hơn số dropdown hiện có -> bổ sung thêm
    if (requiredCount > nextDropdowns.length) {
      for (let i = nextDropdowns.length; i < requiredCount; i++) {
        const slotId = `d${i + 1}`;
        nextDropdowns.push({
          id: slotId,
          label: `Lựa chọn #${i + 1}`,
          options: ["Đúng", "Sai"], // Mặc định Đúng / Sai
        });
      }
      changed = true;
    } else if (requiredCount < nextDropdowns.length && requiredCount > 0) {
      // Cắt bớt các slot thừa
      nextDropdowns = nextDropdowns.slice(0, requiredCount);
      changed = true;
    }

    // Đảm bảo mỗi slot đều có đáp án đúng
    const nextAnswers = { ...answers };
    let answersChanged = false;

    nextDropdowns.forEach((slot) => {
      if (!nextAnswers[slot.id] && slot.options.length > 0) {
        nextAnswers[slot.id] = slot.options[0];
        answersChanged = true;
      }
    });

    if (changed || answersChanged || content?.passage === undefined) {
      onChange(
        {
          ...content,
          prompt: effectivePrompt,
          passage,
          dropdowns: nextDropdowns,
        },
        { ...answerKey, answers: nextAnswers }
      );
    }
  }, [passage]);

  function handlePromptChange(val: string) {
    onChange({ ...content, prompt: val, passage }, answerKey);
  }

  function handlePassageChange(val: string) {
    onChange({ ...content, prompt: effectivePrompt, passage: val }, answerKey);
  }

  function handleImageUrlChange(val: string) {
    onChange({ ...content, image_url: val || null }, answerKey);
  }

  // Chèn text tại vị trí con trỏ trong textarea passage
  function insertAtCursor(insertText: string) {
    const textarea = passageRef.current;
    if (!textarea) {
      handlePassageChange(passage + insertText);
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const newPassage = passage.substring(0, start) + insertText + passage.substring(end);
    handlePassageChange(newPassage);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
    }, 0);
  }

  // Phím tắt Ctrl + Enter để chèn nhanh {D}
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      insertAtCursor("{D} ");
    }
  }

  // Cập nhật phương án cho 1 slot
  function handleOptionChange(slotId: string, optIndex: number, newVal: string) {
    const slot = dropdowns.find((s) => s.id === slotId);
    if (!slot) return;

    const oldOpt = slot.options[optIndex];
    const nextOptions = [...slot.options];
    nextOptions[optIndex] = newVal;

    const nextDropdowns = dropdowns.map((s) =>
      s.id === slotId ? { ...s, options: nextOptions } : s
    );

    const nextAnswers = { ...answers };
    if (nextAnswers[slotId] === oldOpt) {
      nextAnswers[slotId] = newVal;
    }

    onChange({ ...content, prompt: effectivePrompt, passage, dropdowns: nextDropdowns }, { answers: nextAnswers });
  }

  // Thêm phương án cho 1 slot
  function handleAddOption(slotId: string) {
    const slot = dropdowns.find((s) => s.id === slotId);
    if (!slot || slot.options.length >= 8) return;

    const newOpt = `Lựa chọn ${slot.options.length + 1}`;
    const nextDropdowns = dropdowns.map((s) =>
      s.id === slotId ? { ...s, options: [...s.options, newOpt] } : s
    );

    onChange({ ...content, prompt: effectivePrompt, passage, dropdowns: nextDropdowns }, answerKey);
  }

  // Xóa phương án của 1 slot
  function handleRemoveOption(slotId: string, optIndex: number) {
    const slot = dropdowns.find((s) => s.id === slotId);
    if (!slot || slot.options.length <= 2) return;

    const removedOpt = slot.options[optIndex];
    const nextOptions = slot.options.filter((_, idx) => idx !== optIndex);

    const nextDropdowns = dropdowns.map((s) =>
      s.id === slotId ? { ...s, options: nextOptions } : s
    );

    const nextAnswers = { ...answers };
    if (nextAnswers[slotId] === removedOpt) {
      nextAnswers[slotId] = nextOptions[0] || "";
    }

    onChange({ ...content, prompt: effectivePrompt, passage, dropdowns: nextDropdowns }, { answers: nextAnswers });
  }

  // Chọn đáp án đúng cho slot
  function handleSetCorrectAnswer(slotId: string, correctVal: string) {
    const nextAnswers = {
      ...answers,
      [slotId]: correctVal,
    };
    onChange(content, { answers: nextAnswers });
  }

  // Áp dụng mẫu nhanh (Preset) cho một slot
  function applyPreset(slotId: string, presetOptions: string[]) {
    const nextDropdowns = dropdowns.map((s) =>
      s.id === slotId ? { ...s, options: [...presetOptions] } : s
    );
    const nextAnswers = {
      ...answers,
      [slotId]: presetOptions[0],
    };
    onChange({ ...content, prompt: effectivePrompt, passage, dropdowns: nextDropdowns }, { answers: nextAnswers });
  }

  // Áp dụng mẫu cho TẤT CẢ các slot
  function applyPresetToAll(presetOptions: string[]) {
    const nextDropdowns = dropdowns.map((s) => ({
      ...s,
      options: [...presetOptions],
    }));
    const nextAnswers = { ...answers };
    nextDropdowns.forEach((s) => {
      if (!presetOptions.includes(nextAnswers[s.id])) {
        nextAnswers[s.id] = presetOptions[0];
      }
    });
    onChange({ ...content, prompt: effectivePrompt, passage, dropdowns: nextDropdowns }, { answers: nextAnswers });
  }

  // Tách đoạn nhận định theo {D} và <br>
  const previewSegments = passage.split(/(\{D\}|<br\s*\/?>)/gi);

  return (
    <div className="space-y-6">
      {/* 1. CÂU HỎI / ĐỀ BÀI (Ở PHÍA TRÊN) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <span>Câu hỏi / Đề bài (Hiển thị ở phía trên)</span>
          <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={2}
          value={effectivePrompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Ví dụ: Đối với mỗi nhận định sau đây về an toàn thông tin, hãy chọn câu trả lời thích hợp:"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans text-xs sm:text-sm leading-relaxed"
        />
      </div>

      {/* 2. Ảnh minh họa (tùy chọn) */}
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
          className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-xs"
        />
      </div>

      {/* 3. NỘI DUNG CÁC NHẬN ĐỊNH CÓ CHÈN DANH SÁCH SỔ XUỐNG {D} (Ở PHÍA DƯỚI) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Nội dung nhận định (Chèn {`{D}`} tại vị trí danh sách sổ xuống) <span className="text-amber-400">*</span>
          </label>

          {/* Nút bấm chèn nhanh */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => insertAtCursor("{D} ")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Chèn danh sách {`{D}`}</span>
            </button>
            <button
              type="button"
              onClick={() => insertAtCursor("<br>\n")}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
              <span>Xuống dòng {`<br>`}</span>
            </button>
          </div>
        </div>

        <textarea
          ref={passageRef}
          rows={5}
          value={passage}
          onChange={(e) => handlePassageChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ví dụ:&#10;{D} Bạn nên tắt tính năng tự động chạy (Autorun)...&#10;<br>{D} Bạn nên lưu trữ các công việc cá nhân..."
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans text-xs sm:text-sm leading-relaxed"
        />

        {/* Chú thích hướng dẫn (theo đúng mẫu ảnh) */}
        <div className="space-y-1 text-xs text-slate-400 pt-1 font-mono">
          <p className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <span>*</span>
            <span>Thêm ký tự <strong>{`{D}`}</strong> để chèn danh sách lựa chọn</span>
          </p>
          <p className="flex items-center gap-1.5">
            <span>*</span>
            <span>Thêm ký tự <strong>{`<br>`}</strong> để xuống dòng</span>
          </p>
          <p className="flex items-center gap-1.5 text-amber-400">
            <span>*</span>
            <span>Phím tắt <strong>Ctrl + Enter</strong> để thêm lựa chọn</span>
          </p>
        </div>
      </div>

      {/* 4. KHUNG XEM TRƯỚC TRỰC QUAN (Hiển thị Câu hỏi trên + Các nhận định với nút sổ xuống dưới) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>Xem trước giao diện:</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-[11px]">
              {dropdowns.length} vị trí lựa chọn
            </span>
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800/90 space-y-3">
          {/* Phía trên: Câu hỏi */}
          <div className="pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block mb-1">
              Câu hỏi:
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {effectivePrompt || "(Chưa nhập câu hỏi)"}
            </h3>
          </div>

          {/* Phía dưới: Nhận định có các nút danh sách sổ xuống */}
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Các nhận định & Danh sách lựa chọn:
            </span>
            <div className="text-slate-200 text-xs sm:text-sm leading-loose">
              {passage ? (
                (() => {
                  let slotCounter = 0;
                  return previewSegments.map((seg, idx) => {
                    if (seg.toUpperCase() === "{D}") {
                      slotCounter++;
                      const currentSlot = dropdowns[slotCounter - 1];
                      const selectedVal = answers[currentSlot?.id] || currentSlot?.options[0] || "Chọn";

                      return (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 mx-1.5 my-1 rounded-lg bg-[#0066ff] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-900/30 align-middle transition-all border border-blue-400/50 cursor-pointer"
                          title={`Vị trí #${slotCounter}: Nhấn vào sẽ sổ xuống danh sách lựa chọn`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>{selectedVal}</span>
                        </span>
                      );
                    }

                    if (/^<br\s*\/?>$/i.test(seg)) {
                      return <br key={idx} />;
                    }

                    return <span key={idx}>{seg}</span>;
                  });
                })()
              ) : (
                <p className="text-slate-500 italic">Chưa có nội dung nhận định.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. CẤU HÌNH CÁC MỤC LỰA CHỌN & ĐÁP ÁN ĐÚNG CHO TỪNG {D} */}
      {dropdowns.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-sm font-bold text-white block">
                Cấu hình danh sách lựa chọn cho từng vị trí {`{D}`}:
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập các phương án xuất hiện trong menu thả xuống và tích chọn đáp án đúng.
              </p>
            </div>

            {/* Mẫu nhanh cho tất cả */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Áp dụng mẫu cho tất cả:</span>
              <button
                type="button"
                onClick={() => applyPresetToAll(["Đúng", "Sai"])}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                Đúng / Sai
              </button>
              <button
                type="button"
                onClick={() => applyPresetToAll(["Có", "Không"])}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                Có / Không
              </button>
              <button
                type="button"
                onClick={() => applyPresetToAll(["Nên", "Không nên"])}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 cursor-pointer"
              >
                Nên / Không nên
              </button>
            </div>
          </div>

          {/* Danh sách từng slot {D} */}
          <div className="space-y-4">
            {dropdowns.map((slot, sIdx) => {
              const currentCorrect = answers[slot.id];

              return (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-bold shadow-sm">
                        Vị trí #{sIdx + 1} ({`{D}`})
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        Đáp án đúng: <strong className="text-emerald-400">{currentCorrect || "(Chưa chọn)"}</strong>
                      </span>
                    </div>

                    {/* Mẫu nhanh cho riêng vị trí này */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">Mẫu:</span>
                      <button
                        type="button"
                        onClick={() => applyPreset(slot.id, ["Đúng", "Sai"])}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 cursor-pointer"
                      >
                        Đúng / Sai
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(slot.id, ["Có", "Không"])}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 cursor-pointer"
                      >
                        Có / Không
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPreset(slot.id, ["Nên", "Không nên"])}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800 cursor-pointer"
                      >
                        Nên / Không nên
                      </button>
                    </div>
                  </div>

                  {/* Danh sách phương án của slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {slot.options.map((opt, optIdx) => {
                      const isCorrect = currentCorrect === opt;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                            isCorrect
                              ? "bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50"
                              : "bg-slate-900/90 border-slate-800"
                          }`}
                        >
                          {/* Nút radio chọn đáp án đúng */}
                          <button
                            type="button"
                            onClick={() => handleSetCorrectAnswer(slot.id, opt)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              isCorrect
                                ? "border-emerald-400 bg-emerald-500 text-slate-950 font-bold"
                                : "border-slate-600 bg-slate-800 text-transparent hover:border-slate-500"
                            }`}
                            title="Tích để chọn làm đáp án đúng"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          {/* Ô sửa nội dung phương án */}
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(slot.id, optIdx, e.target.value)}
                            placeholder={`Phương án #${optIdx + 1}...`}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                          />

                          {/* Nút xóa phương án */}
                          {slot.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(slot.id, optIdx)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Xóa phương án này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Nút thêm phương án */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleAddOption(slot.id)}
                      disabled={slot.options.length >= 8}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm phương án vào danh sách</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
