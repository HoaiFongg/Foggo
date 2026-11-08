"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Trophy,
  Save,
  Eye,
  Edit,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Flame,
  HelpCircle,
} from "lucide-react";
import { QUESTION_TYPES, getQuestionType, getAllQuestionTypes } from "@/question-types/registry";
import { saveQuestionsBatch } from "@/app/dashboard/sets/actions";
import type { QuestionType } from "@/types/database";

interface QuestionItem {
  id: string;
  position: number;
  type: QuestionType;
  content: any;
  answer_key: any;
  time_limit_sec: number;
  points: number;
  explanation?: string;
}

interface QuestionSetEditorProps {
  setId: string;
  initialTitle: string;
  initialQuestions: QuestionItem[];
}

export function QuestionSetEditorClient({
  setId,
  initialTitle,
  initialQuestions,
}: QuestionSetEditorProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>(
    initialQuestions.length > 0
      ? initialQuestions
      : [
          {
            id: `q_${Date.now()}`,
            position: 0,
            type: "single_choice",
            content: getQuestionType("single_choice")!.defaultContent(),
            answer_key: getQuestionType("single_choice")!.defaultAnswerKey(),
            time_limit_sec: 20,
            points: 1000,
          },
        ]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [previewAnswer, setPreviewAnswer] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentQ = questions[activeIndex] || questions[0];
  const typeDef = getQuestionType(currentQ.type) || getQuestionType("single_choice")!;

  // Thêm câu hỏi mới
  function handleAddQuestion(type: QuestionType = "single_choice") {
    const def = getQuestionType(type) || getQuestionType("single_choice")!;
    const newQ: QuestionItem = {
      id: `q_${Date.now()}`,
      position: questions.length,
      type,
      content: def.defaultContent(),
      answer_key: def.defaultAnswerKey(),
      time_limit_sec: 20,
      points: 1000,
    };
    const nextList = [...questions, newQ];
    setQuestions(nextList);
    setActiveIndex(nextList.length - 1);
    setPreviewAnswer(null);
  }

  // Xóa câu hỏi
  function handleDeleteQuestion(idx: number) {
    if (questions.length <= 1) return;
    const nextList = questions.filter((_, i) => i !== idx);
    setQuestions(nextList);
    if (activeIndex >= nextList.length) {
      setActiveIndex(nextList.length - 1);
    }
    setPreviewAnswer(null);
  }

  // Đổi thứ tự câu hỏi (lên / xuống)
  function handleMoveQuestion(idx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const nextList = [...questions];
    const temp = nextList[idx];
    nextList[idx] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    setQuestions(nextList);
    setActiveIndex(targetIdx);
  }

  // Đổi dạng câu hỏi cho câu hiện tại
  function handleChangeType(newType: QuestionType) {
    const def = getQuestionType(newType);
    if (!def) return;
    const updated = {
      ...currentQ,
      type: newType,
      content: def.defaultContent(),
      answer_key: def.defaultAnswerKey(),
    };
    updateCurrentQuestion(updated);
    setPreviewAnswer(null);
  }

  function updateCurrentQuestion(updated: QuestionItem) {
    const nextList = [...questions];
    nextList[activeIndex] = updated;
    setQuestions(nextList);
  }

  // Lưu toàn bộ câu hỏi lên database
  async function handleSave() {
    setSaving(true);
    setSavedSuccess(false);
    const res = await saveQuestionsBatch(setId, questions);
    setSaving(false);
    if (res?.success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  }

  const EditorComponent = typeDef.Editor;
  const PlayerComponent = typeDef.Player;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/sets"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white max-w-xs sm:max-w-md truncate">
              {initialTitle}
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Tổng số: {questions.length} câu hỏi
            </p>
          </div>
        </div>

        {/* Chuyển đổi Soạn thảo / Xem trước & Nút Lưu */}
        <div className="flex items-center gap-3">
          {/* Switch Soạn thảo / Xem trước */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                !isPreview
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Soạn thảo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPreview(true);
                setPreviewAnswer(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isPreview
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem trước</span>
            </button>
          </div>

          {/* Nút Lưu */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 ${
              savedSuccess
                ? "bg-emerald-500 text-slate-950"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20"
            }`}
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã lưu!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? "Đang lưu..." : "Lưu thay đổi"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Danh sách các câu hỏi */}
        <aside className="w-64 sm:w-72 border-r border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Các câu hỏi
              </span>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                {activeIndex + 1}/{questions.length}
              </span>
            </div>

            {questions.map((q, idx) => {
              const isActive = idx === activeIndex;
              const def = getQuestionType(q.type);
              const snippet = q.content?.prompt || "Câu hỏi chưa có tiêu đề";

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setPreviewAnswer(null);
                  }}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all group relative ${
                    isActive
                      ? "bg-amber-500/10 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-amber-400">
                      Câu {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {q.time_limit_sec}s · {q.points}đ
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-snug">
                    {snippet}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                      {def?.name || q.type}
                    </span>

                    {/* Điều khiển vị trí & xóa */}
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveQuestion(idx, "up");
                          }}
                          className="p-1 hover:text-amber-400"
                          title="Lên trên"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                      )}
                      {idx < questions.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveQuestion(idx, "down");
                          }}
                          className="p-1 hover:text-amber-400"
                          title="Xuống dưới"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      )}
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(idx);
                          }}
                          className="p-1 hover:text-rose-400"
                          title="Xóa câu này"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Menu thêm câu hỏi */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-1">
              + Thêm dạng câu hỏi:
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {getAllQuestionTypes().map((def) => (
                <button
                  key={def.type}
                  type="button"
                  onClick={() => handleAddQuestion(def.type)}
                  className="w-full py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 text-xs font-medium flex items-center justify-between gap-1.5 transition-colors cursor-pointer text-left"
                >
                  <span className="truncate">{def.name}</span>
                  {def.isPlus && (
                    <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0">
                      PLUS
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Editor / Preview Body */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          {isPreview ? (
            /* Chế độ Xem trước: Render Player Component y hệt người chơi */
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>CHẾ ĐỘ XEM TRƯỚC (GIAO DIỆN HỌC SINH)</span>
                </span>
              </div>

              <PlayerComponent
                content={currentQ.content}
                value={previewAnswer}
                onChange={(val) => setPreviewAnswer(val)}
              />

              {previewAnswer !== null && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono text-xs">
                  <span>Bạn đã chọn: </span>
                  <span className="font-bold text-amber-400">
                    {String(previewAnswer)}
                  </span>
                  <span className="mx-2">·</span>
                  <span>Điểm dự kiến: </span>
                  <span className="font-bold text-emerald-400">
                    {typeDef.grade(previewAnswer, currentQ.answer_key) === 1.0
                      ? "100% (ĐÚNG)"
                      : "0% (SAI)"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Chế độ Soạn thảo */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Thanh cấu hình tham số: Loại câu hỏi, Thời gian, Điểm số */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                {/* Loại câu hỏi */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                    Dạng câu hỏi
                  </label>
                  <select
                    value={currentQ.type}
                    onChange={(e) => handleChangeType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-amber-300 focus:outline-none focus:border-amber-500"
                  >
                    {getAllQuestionTypes().map((def) => (
                      <option key={def.type} value={def.type}>
                        {def.name} {def.isPlus ? "(Gói Plus)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Thời gian làm bài */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Thời gian (giây)</span>
                  </label>
                  <select
                    value={currentQ.time_limit_sec}
                    onChange={(e) =>
                      updateCurrentQuestion({
                        ...currentQ,
                        time_limit_sec: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>5 giây (Phản xạ chớp nhoáng)</option>
                    <option value={10}>10 giây</option>
                    <option value={20}>20 giây (Mặc định)</option>
                    <option value={30}>30 giây</option>
                    <option value={45}>45 giây</option>
                    <option value={60}>60 giây (Tính toán dài)</option>
                  </select>
                </div>

                {/* Điểm số */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>Điểm số</span>
                  </label>
                  <select
                    value={currentQ.points}
                    onChange={(e) =>
                      updateCurrentQuestion({
                        ...currentQ,
                        points: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value={500}>500 điểm (Câu dễ)</option>
                    <option value={1000}>1,000 điểm (Tiêu chuẩn)</option>
                    <option value={1500}>1,500 điểm (Câu khó)</option>
                    <option value={2000}>2,000 điểm (Đặc biệt / Trùm)</option>
                  </select>
                </div>
              </div>

              {/* Component Editor tương ứng của dạng câu hỏi */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                <EditorComponent
                  content={currentQ.content}
                  answerKey={currentQ.answer_key}
                  onChange={(nextContent, nextKey) =>
                    updateCurrentQuestion({
                      ...currentQ,
                      content: nextContent,
                      answer_key: nextKey,
                    })
                  }
                />

                {/* Giải thích đáp án (tùy chọn) */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Lời giải thích chi tiết (Hiện sau khi người chơi trả lời)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={currentQ.explanation || ""}
                    onChange={(e) =>
                      updateCurrentQuestion({
                        ...currentQ,
                        explanation: e.target.value,
                      })
                    }
                    placeholder="Giải thích vì sao đáp án này đúng để giúp học sinh hiểu bài sâu hơn..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
