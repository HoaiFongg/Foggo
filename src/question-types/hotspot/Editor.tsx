"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Crosshair, Circle, Square } from "lucide-react";
import type { EditorProps } from "../types";
import type { HotspotContent, HotspotAnswerKey, HotspotRegion } from "./schema";

export function HotspotEditor({
  content,
  answerKey,
  onChange,
}: EditorProps<HotspotContent, HotspotAnswerKey>) {
  const regions = answerKey.regions || [];
  const imageRef = useRef<HTMLImageElement>(null);
  const [shapeMode, setShapeMode] = useState<"rect" | "circle">("rect");

  function handlePromptChange(prompt: string) {
    onChange({ ...content, prompt }, answerKey);
  }

  function handleImageUrlChange(image_url: string) {
    onChange({ ...content, image_url }, answerKey);
  }

  // Thêm vùng đáp án khi click vào ảnh
  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    let newRegion: HotspotRegion;

    if (shapeMode === "rect") {
      newRegion = {
        shape: "rect",
        x: Math.max(0, Math.min(0.9, x - 0.05)),
        y: Math.max(0, Math.min(0.9, y - 0.05)),
        w: 0.12,
        h: 0.12,
        label: `Vùng ${regions.length + 1}`,
      };
    } else {
      newRegion = {
        shape: "circle",
        cx: x,
        cy: y,
        r: 0.06,
        label: `Vùng ${regions.length + 1}`,
      };
    }

    const nextRegions = [...regions, newRegion];
    onChange(content, { ...answerKey, regions: nextRegions });
  }

  function handleRemoveRegion(idx: number) {
    const nextRegions = regions.filter((_, i) => i !== idx);
    onChange(content, { ...answerKey, regions: nextRegions });
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
          Yêu cầu câu hỏi Hotspot <span className="text-amber-400">*</span>
        </label>
        <textarea
          rows={2}
          value={content.prompt || ""}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="ví dụ: Nhấp vào vị trí của Trái Đất trong sơ đồ Hệ Mặt Trời..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>URL Ảnh minh họa <span className="text-amber-400">*</span></span>
        </label>
        <input
          type="url"
          required
          value={content.image_url || ""}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://images.unsplash.com/... hoặc ảnh lưu trữ"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
        />
      </div>

      {content.image_url && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Nhấp trực tiếp lên ảnh để đánh dấu VÙNG ĐÚNG
            </span>
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setShapeMode("rect")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  shapeMode === "rect" ? "bg-amber-500 text-slate-950" : "text-slate-400"
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Hình chữ nhật</span>
              </button>
              <button
                type="button"
                onClick={() => setShapeMode("circle")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  shapeMode === "circle" ? "bg-amber-500 text-slate-950" : "text-slate-400"
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>Hình tròn</span>
              </button>
            </div>
          </div>

          {/* Vùng hiển thị ảnh và các hotspot */}
          <div
            onClick={handleImageClick}
            className="relative max-w-xl mx-auto rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/40 bg-slate-950 cursor-crosshair select-none group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={content.image_url}
              alt="Hotspot canvas"
              className="w-full h-auto object-contain block pointer-events-none"
            />

            {/* Render các vùng hotspot đã đánh dấu */}
            {regions.map((reg, idx) => {
              if (reg.shape === "rect") {
                return (
                  <div
                    key={idx}
                    style={{
                      left: `${reg.x * 100}%`,
                      top: `${reg.y * 100}%`,
                      width: `${reg.w * 100}%`,
                      height: `${reg.h * 100}%`,
                    }}
                    className="absolute border-2 border-emerald-400 bg-emerald-500/30 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  >
                    <span>✓ #{idx + 1}</span>
                  </div>
                );
              }

              if (reg.shape === "circle") {
                return (
                  <div
                    key={idx}
                    style={{
                      left: `${(reg.cx - reg.r) * 100}%`,
                      top: `${(reg.cy - reg.r) * 100}%`,
                      width: `${reg.r * 2 * 100}%`,
                      height: `${reg.r * 2 * 100}%`,
                    }}
                    className="absolute border-2 border-emerald-400 bg-emerald-500/30 rounded-full flex items-center justify-center font-mono font-bold text-xs text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  >
                    <span>✓ #{idx + 1}</span>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Danh sách vùng đã chọn */}
          {regions.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {regions.map((r, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2 text-slate-300"
                >
                  <span className="font-mono text-emerald-400 font-bold">#{idx + 1}</span>
                  <span>{r.shape === "rect" ? "Chữ nhật" : "Tròn"}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveRegion(idx);
                    }}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
