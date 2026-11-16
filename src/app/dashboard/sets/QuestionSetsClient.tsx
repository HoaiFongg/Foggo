"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  BookOpen,
  Trash2,
  Edit3,
  Globe,
  Lock,
  EyeOff,
  Crown,
  FileSpreadsheet,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
  FileDown,
  Layers,
  RotateCcw,
  ArchiveRestore,
  Clock,
  Search,
} from "lucide-react";
import {
  deleteQuestionSet,
  softDeleteQuestionSet,
  restoreQuestionSet,
  permanentDeleteQuestionSet,
  emptyTrashQuestionSets,
  createQuestionSetFromExcel,
  getQuestionsForExport,
} from "./actions";
import {
  downloadSampleTemplateExcel,
  parseQuestionsFromExcel,
  exportQuestionSetToExcel,
  exportQuestionSetToJson,
  type ParsedExcelQuestion,
} from "@/lib/excel";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { localizeQuestionSet } from "@/lib/i18n/questions-translation";

interface QuestionSetItem {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  visibility: "public" | "unlisted" | "private";
  created_at: string;
  updated_at: string;
  questions?: Array<{ count: number }>;
  profiles?: { display_name: string | null };
}

interface QuestionSetsClientProps {
  mySets: QuestionSetItem[];
  systemSets: QuestionSetItem[];
  initialDeletedSets?: QuestionSetItem[];
  initialDeletedSystemSets?: QuestionSetItem[];
  isAdmin: boolean;
}

export function QuestionSetsClient({
  mySets,
  systemSets,
  initialDeletedSets = [],
  initialDeletedSystemSets = [],
  isAdmin,
}: QuestionSetsClientProps) {
  const { t, language, isEn } = useLanguage();
  const [showImportModal, setShowImportModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Danh sách đề thi cục bộ (đang hoạt động và đã xóa)
  const [localMySets, setLocalMySets] = useState<QuestionSetItem[]>(mySets);
  const [localSystemSets, setLocalSystemSets] = useState<QuestionSetItem[]>(systemSets);
  const [localDeletedSets, setLocalDeletedSets] = useState<QuestionSetItem[]>(initialDeletedSets);
  const [localDeletedSystemSets, setLocalDeletedSystemSets] = useState<QuestionSetItem[]>(initialDeletedSystemSets);

  // Quản lý Modal Thùng rác & Lịch sử xóa
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [trashTab, setTrashTab] = useState<"my" | "system">("my");
  const [trashSearchQuery, setTrashSearchQuery] = useState("");
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  // Undo Toast nhanh sau khi xóa
  const [undoToast, setUndoToast] = useState<{
    id: string;
    title: string;
    isSystem: boolean;
    timeoutId: any;
  } | null>(null);

  // Modal xác nhận xóa vĩnh viễn
  const [confirmPermanentModal, setConfirmPermanentModal] = useState<{
    id?: string;
    title?: string;
    isAll?: boolean;
  } | null>(null);

  // Helper giải mã tag [DELETED:date:vis]
  function parseDeletedMeta(description: string | null) {
    if (!description) return { dateStr: "", formattedDate: "Vừa xóa", cleanDesc: "" };
    const match = description.match(/^\[DELETED:([^:]+):([a-z]+)\]\s*([\s\S]*)$/);
    if (!match) {
      const fallbackMatch = description.match(/^\[DELETED:[^\]]+\]\s*([\s\S]*)$/);
      return { dateStr: "", formattedDate: "Vừa xóa", cleanDesc: fallbackMatch ? fallbackMatch[1]?.trim() : description };
    }
    const rawTime = match[1];
    const origVis = match[2] || "private";
    const cleanDesc = match[3]?.trim() || "";
    const numTime = Number(rawTime);
    const dateObj = !isNaN(numTime) ? new Date(numTime) : new Date(rawTime);
    const formattedDate = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Vừa xóa";
    return { dateStr: rawTime, origVis, cleanDesc, formattedDate };
  }

  // Chuyển đề vào thùng rác (Soft delete)
  async function handleSoftDelete(set: QuestionSetItem, isSystem = false) {
    const deletedTag = `[DELETED:${Date.now()}:${set.visibility}] ${set.description || ""}`;
    if (isSystem) {
      setLocalSystemSets((prev) => prev.filter((s) => s.id !== set.id));
      setLocalDeletedSystemSets((prev) => [{ ...set, description: deletedTag }, ...prev]);
    } else {
      setLocalMySets((prev) => prev.filter((s) => s.id !== set.id));
      setLocalDeletedSets((prev) => [{ ...set, description: deletedTag }, ...prev]);
    }

    if (undoToast?.timeoutId) clearTimeout(undoToast.timeoutId);
    const timeoutId = setTimeout(() => {
      setUndoToast(null);
    }, 10000);

    setUndoToast({
      id: set.id,
      title: set.title,
      isSystem,
      timeoutId,
    });

    const res = await softDeleteQuestionSet(set.id);
    if (res.error) {
      alert(`Không thể xóa bộ đề: ${res.error}`);
      // Revert lại nếu có lỗi
      if (isSystem) {
        setLocalSystemSets((prev) => [set, ...prev]);
        setLocalDeletedSystemSets((prev) => prev.filter((s) => s.id !== set.id));
      } else {
        setLocalMySets((prev) => [set, ...prev]);
        setLocalDeletedSets((prev) => prev.filter((s) => s.id !== set.id));
      }
    }
  }

  // Hoàn tác / Khôi phục đề từ thùng rác
  async function handleRestore(setId: string, isSystem = false) {
    setIsProcessingId(setId);
    const targetList = isSystem ? localDeletedSystemSets : localDeletedSets;
    const targetItem = targetList.find((s) => s.id === setId);

    if (!targetItem) {
      setIsProcessingId(null);
      return;
    }

    const { cleanDesc, origVis } = parseDeletedMeta(targetItem.description);
    const restoredItem: QuestionSetItem = {
      ...targetItem,
      description: cleanDesc || null,
      visibility: (origVis as any) || "private",
    };

    if (isSystem) {
      setLocalDeletedSystemSets((prev) => prev.filter((s) => s.id !== setId));
      setLocalSystemSets((prev) => [restoredItem, ...prev]);
    } else {
      setLocalDeletedSets((prev) => prev.filter((s) => s.id !== setId));
      setLocalMySets((prev) => [restoredItem, ...prev]);
    }

    if (undoToast?.id === setId) {
      if (undoToast.timeoutId) clearTimeout(undoToast.timeoutId);
      setUndoToast(null);
    }

    const res = await restoreQuestionSet(setId);
    setIsProcessingId(null);

    if (res.error) {
      alert(`Lỗi khi hoàn tác bộ đề: ${res.error}`);
    }
  }

  // Xóa vĩnh viễn (sau khi người dùng xác nhận)
  async function handleConfirmPermanentDelete() {
    if (!confirmPermanentModal) return;
    const { id, isAll } = confirmPermanentModal;
    setIsProcessingId("permanent-del");

    if (isAll) {
      const res = await emptyTrashQuestionSets();
      setIsProcessingId(null);
      setConfirmPermanentModal(null);
      if (res.error) {
        alert(`Lỗi khi dọn thùng rác: ${res.error}`);
      } else {
        setLocalDeletedSets([]);
        if (isAdmin) setLocalDeletedSystemSets([]);
      }
      return;
    }

    if (id) {
      const res = await permanentDeleteQuestionSet(id);
      setIsProcessingId(null);
      setConfirmPermanentModal(null);

      if (res.error) {
        alert(`Lỗi khi xóa vĩnh viễn: ${res.error}`);
      } else {
        setLocalDeletedSets((prev) => prev.filter((s) => s.id !== id));
        if (isAdmin) setLocalDeletedSystemSets((prev) => prev.filter((s) => s.id !== id));
      }
    }
  }

  // State cho Modal Import
  const [file, setFile] = useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedExcelQuestion[]>([]);
  const [parseWarnings, setParseWarnings] = useState<string[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [newSetSubject, setNewSetSubject] = useState("Tổng hợp");
  const [importing, setImporting] = useState(false);

  // Xử lý đọc file Excel
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setParseErrors([]);
    setParseWarnings([]);

    // Tự động gợi ý tên bộ đề theo tên file (bỏ đuôi .xlsx)
    const baseName = selected.name.replace(/\.[^/.]+$/, "");
    setNewSetTitle(baseName);

    try {
      const buffer = await selected.arrayBuffer();
      const res = parseQuestionsFromExcel(buffer);

      if (!res.success) {
        setParseErrors(res.errors);
        setParsedQuestions([]);
      } else {
        setParsedQuestions(res.questions);
        setParseWarnings(res.warnings);
      }
    } catch (err: any) {
      setParseErrors([`Lỗi khi đọc tệp: ${err?.message || "Định dạng không hợp lệ"}`]);
      setParsedQuestions([]);
    }
  }

  // Thực hiện lưu bộ đề từ file Excel
  async function handleConfirmImport() {
    if (parsedQuestions.length === 0) return;
    if (!newSetTitle.trim()) {
      alert("Vui lòng nhập tên cho bộ câu hỏi mới!");
      return;
    }

    setImporting(true);
    const res = await createQuestionSetFromExcel({
      title: newSetTitle.trim(),
      subject: newSetSubject,
      questions: parsedQuestions.map((q) => ({
        type: q.type,
        content: q.content,
        answer_key: q.answer_key,
        time_limit_sec: q.time_limit_sec,
        points: q.points,
        explanation: q.explanation,
      })),
    });

    setImporting(false);

    if (res.error) {
      alert(`Lỗi khi tạo bộ đề: ${res.error}`);
    } else {
      setShowImportModal(false);
      setFile(null);
      setParsedQuestions([]);
      window.location.reload();
    }
  }

  // Xuất file sao lưu (Excel hoặc JSON)
  async function handleBackup(setId: string, setTitle: string, type: "excel" | "json") {
    setIsExporting(setId);
    try {
      const res = await getQuestionsForExport(setId);
      if (res.error || !res.set || !res.questions) {
        alert(res.error || "Không thể tải dữ liệu câu hỏi để sao lưu");
        return;
      }

      if (type === "excel") {
        exportQuestionSetToExcel(setTitle, res.questions);
      } else {
        exportQuestionSetToJson(res.set, res.questions);
      }
    } catch (err: any) {
      alert(`Lỗi xuất file sao lưu: ${err?.message || "Không xác định"}`);
    } finally {
      setIsExporting(null);
    }
  }

  return (
    <div>
      {/* Tiêu đề & Các nút thao tác - Chuẩn Retro Pixel RPG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-black/[0.08] dark:border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-pixel tracking-tight">
              {t.sets.title}
            </h1>
            {isAdmin && (
              <span className="px-2 py-0.5 pixel-panel rounded-none border border-rose-500/50 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-pixel text-[9px] font-semibold">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.sets.subtitle}
          </p>
        </div>

        {/* Thanh công cụ: Tải file mẫu, Nhập Excel, Lịch sử xóa đề (Thùng rác), Tạo mới */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút 1: Tải file mẫu Excel */}
          <button
            type="button"
            onClick={() => downloadSampleTemplateExcel()}
            className="px-3 py-1.5 rounded-xl pixel-btn-neutral text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download Excel Template"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.sets.downloadTemplate}</span>
          </button>

          {/* Nút 2: Nhập đề từ Excel */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 rounded-xl pixel-btn-amber text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer uppercase"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.sets.importExcel}</span>
          </button>

          {/* Nút 3: Lịch sử xóa đề / Thùng rác & Hoàn tác */}
          <button
            type="button"
            onClick={() => setShowTrashModal(true)}
            className="px-3 py-1.5 rounded-xl pixel-btn-neutral text-rose-600 dark:text-rose-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Xem danh sách bộ đề đã xóa và hoàn tác lại"
          >
            <ArchiveRestore className="w-3.5 h-3.5 text-rose-500" />
            <span>{isEn ? "Trash Bin" : "Lịch sử xóa đề"}</span>
            {localDeletedSets.length + (isAdmin ? localDeletedSystemSets.length : 0) > 0 && (
              <span className="px-1.5 py-0.2 pixel-panel rounded-none bg-rose-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300 font-pixel text-[9px] font-bold">
                {localDeletedSets.length + (isAdmin ? localDeletedSystemSets.length : 0)}
              </span>
            )}
          </button>

          {/* Nút 4: Tạo bộ đề mới thủ công */}
          <Link
            href="/dashboard/sets/new"
            className="px-3.5 py-1.5 rounded-xl pixel-btn-amber text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 uppercase transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.sets.createBtn}</span>
          </Link>
        </div>
      </div>

      {/* Section 1: Bộ câu hỏi của bạn */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-amber-500 dark:text-amber-400 font-pixel uppercase tracking-wider">
            [ {isEn ? `YOUR QUESTION SETS (${localMySets.length})` : `BỘ CÂU HỎI CỦA BẠN (${localMySets.length})`} ]
          </h2>
        </div>

        {localMySets.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center max-w-md mx-auto my-8 space-y-4 shadow-xs">
            <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{t.sets.empty}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isEn ? "Create a set manually or upload an Excel file to generate quiz items automatically." : "Bạn có thể tạo bộ đề thủ công hoặc tải file Excel có sẵn lên để hệ thống tự động nhận diện và tạo đề trong 3 giây."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => downloadSampleTemplateExcel()}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {t.sets.downloadTemplate}
              </button>
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                {t.sets.importExcel}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localMySets.map((set) => {
              const localized = localizeQuestionSet(set, language);
              const questionCount = set.questions?.[0]?.count ?? 0;
              const isWorking = isExporting === set.id;

              return (
                <div
                  key={set.id}
                  className="p-5 rounded-2xl pixel-panel bg-white/95 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all duration-150 flex flex-col justify-between group shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        {set.subject ? (isEn && set.subject === "Tổng hợp" ? "General" : set.subject) : (isEn ? "General" : "Tổng hợp")}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {set.visibility === "public" ? (
                          <span title={t.sets.visibilityPublic}><Globe className="w-3.5 h-3.5 text-emerald-500" /></span>
                        ) : set.visibility === "unlisted" ? (
                          <span title="Link"><EyeOff className="w-3.5 h-3.5 text-blue-500" /></span>
                        ) : (
                          <span title={t.sets.visibilityPrivate}><Lock className="w-3.5 h-3.5 text-slate-400" /></span>
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {localized.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {localized.description || (isEn ? "No description provided." : "Không có mô tả.")}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span>{questionCount} {t.sets.questionsCount}</span>

                    <div className="flex items-center gap-1">
                      {/* Nút Sao lưu Excel */}
                      <button
                        type="button"
                        onClick={() => handleBackup(set.id, set.title, "excel")}
                        disabled={isWorking}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/15 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                        title="Export Excel"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>

                      {/* Nút Sao lưu JSON */}
                      <button
                        type="button"
                        onClick={() => handleBackup(set.id, set.title, "json")}
                        disabled={isWorking}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/15 hover:text-blue-700 dark:hover:text-blue-300 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                        title="Sao lưu ra file JSON (.json)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Nút Sửa */}
                      <Link
                        href={`/dashboard/sets/${set.id}/edit`}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                        title="Chỉnh sửa câu hỏi"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Nút Xóa mềm (vào thùng rác & có thể hoàn tác) */}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn chuyển bộ đề "${set.title}" vào thùng rác? Bạn có thể khôi phục lại bất kỳ lúc nào.`)) {
                            handleSoftDelete(set, false);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-500/15 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Chuyển vào thùng rác (Có thể hoàn tác)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Quản trị các bộ đề khác (Chỉ Admin) */}
      {isAdmin && localSystemSets.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80">
          <h2 className="text-xs font-bold text-rose-600 dark:text-rose-300 mb-4 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            <span>Bộ câu hỏi khác trong hệ thống ({localSystemSets.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localSystemSets.map((set) => {
              const questionCount = set.questions?.[0]?.count ?? 0;
              const author = set.profiles?.display_name || "Giáo viên";

              return (
                <div
                  key={set.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 hover:border-rose-300 dark:hover:border-rose-500/30 transition-colors flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {set.subject || "Tổng hợp"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono truncate max-w-[120px]">
                        {author}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                      {set.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mb-4">
                      {set.description || "Không có mô tả."}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{questionCount} câu hỏi</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleBackup(set.id, set.title, "excel")}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-400 transition-colors cursor-pointer"
                        title="Sao lưu Excel"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/dashboard/sets/${set.id}/edit`}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                        title="Chỉnh sửa (Admin)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn chuyển bộ đề "${set.title}" vào thùng rác? (Quyền Admin)`)) {
                            handleSoftDelete(set, true);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Xóa vào thùng rác (Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: NHẬP ĐỀ TỪ FILE EXCEL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Nhập Bộ Câu Hỏi Từ File Excel</h3>
                  <p className="text-[11px] text-slate-400">Hỗ trợ định dạng tệp .xlsx và .csv</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Box tải file mẫu nếu chưa có */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="text-slate-300 text-xs">
                  Chưa có định dạng mẫu chuẩn? Tải file mẫu có sẵn câu hỏi và hướng dẫn:
                </div>
                <button
                  type="button"
                  onClick={() => downloadSampleTemplateExcel()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tải file mẫu .xlsx</span>
                </button>
              </div>

              {/* Vùng kéo thả / chọn file */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Chọn tệp Excel (.xlsx) từ máy tính của bạn:
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer p-2 rounded-xl bg-slate-950 border border-slate-800"
                />
              </div>

              {/* Lỗi phân tích nếu có */}
              {parseErrors.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Lỗi khi đọc file:</span>
                  </div>
                  {parseErrors.map((err, idx) => (
                    <p key={idx} className="text-[11px] pl-5">{err}</p>
                  ))}
                </div>
              )}

              {/* Cảnh báo nếu có */}
              {parseWarnings.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1 max-h-32 overflow-y-auto">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Ghi chú từ hệ thống ({parseWarnings.length}):</span>
                  </div>
                  {parseWarnings.map((w, idx) => (
                    <p key={idx} className="text-[11px] pl-5 text-slate-400">{w}</p>
                  ))}
                </div>
              )}

              {/* Khi file được phân tích thành công */}
              {parsedQuestions.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold">Đã nhận diện thành công {parsedQuestions.length} câu hỏi!</span>
                    </div>
                  </div>

                  {/* Thông tin bộ đề mới */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tên bộ câu hỏi <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={newSetTitle}
                        onChange={(e) => setNewSetTitle(e.target.value)}
                        placeholder="Ví dụ: Ôn tập Sinh học kỳ 1"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Môn học
                      </label>
                      <input
                        type="text"
                        value={newSetSubject}
                        onChange={(e) => setNewSetSubject(e.target.value)}
                        placeholder="Ví dụ: Toán, Khoa học, Tiếng Anh..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Bảng xem trước 5 câu hỏi đầu */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-2">Xem trước các câu hỏi:</p>
                    <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-800 rounded-xl p-2 bg-slate-950">
                      {parsedQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold text-amber-400">
                                #{idx + 1}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {q.previewType}
                              </span>
                            </div>
                            <p className="text-xs text-slate-200 line-clamp-1">{q.previewPrompt}</p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400 shrink-0">
                            {q.time_limit_sec}s
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2 bg-slate-950/50">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={parsedQuestions.length === 0 || importing}
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {importing ? (
                  <span>Đang khởi tạo...</span>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Lưu và tạo bộ đề ({parsedQuestions.length} câu)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* FLOATING UNDO TOAST (HOÀN TÁC TỨC THÌ)                          */}
      {/* ============================================================== */}
      {undoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl apple-glass shadow-2xl border border-black/[0.08] dark:border-white/[0.12] animate-in fade-in slide-in-from-bottom-4 duration-200 text-xs text-slate-800 dark:text-slate-100 backdrop-blur-xl">
          <div className="w-6 h-6 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-500 shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </div>
          <span>
            Đã chuyển <strong className="font-semibold text-slate-950 dark:text-white">"{undoToast.title}"</strong> vào thùng rác.
          </span>
          <button
            type="button"
            onClick={() => handleRestore(undoToast.id, undoToast.isSystem)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hoàn tác</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (undoToast.timeoutId) clearTimeout(undoToast.timeoutId);
              setUndoToast(null);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ml-1"
            title="Đóng"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: LỊCH SỬ XÓA ĐỀ & THÙNG RÁC (TRASH BIN & UNDO)           */}
      {/* ============================================================== */}
      {showTrashModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="apple-glass bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <ArchiveRestore className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Lịch Sử Xóa Đề & Thùng Rác</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono text-[11px] font-semibold">
                      {trashTab === "my" ? localDeletedSets.length : localDeletedSystemSets.length} bộ đề
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bạn có thể khôi phục (hoàn tác) lại bất kỳ lúc nào hoặc dọn sạch vĩnh viễn.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTrashModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Tabs Bar */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              {isAdmin ? (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setTrashTab("my")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      trashTab === "my"
                        ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Đề của tôi ({localDeletedSets.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrashTab("system")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      trashTab === "system"
                        ? "bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Đề hệ thống ({localDeletedSystemSets.length})
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-mono">
                  Danh sách lưu trữ an toàn trong vòng 30 ngày
                </span>
              )}

              {/* Tìm kiếm & Nút Dọn sạch */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={trashSearchQuery}
                    onChange={(e) => setTrashSearchQuery(e.target.value)}
                    placeholder="Tìm tên đề đã xóa..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                  />
                </div>

                {(trashTab === "my" ? localDeletedSets.length : localDeletedSystemSets.length) > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmPermanentModal({
                        isAll: true,
                        title: "toàn bộ các đề trong thùng rác",
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/25 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    title="Xóa triệt để tất cả đề trong thùng rác"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Dọn sạch</span>
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body: Danh sách các đề đã xóa */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {(() => {
                const currentList = trashTab === "my" ? localDeletedSets : localDeletedSystemSets;
                const filtered = currentList.filter(
                  (s) =>
                    s.title.toLowerCase().includes(trashSearchQuery.toLowerCase()) ||
                    (s.subject && s.subject.toLowerCase().includes(trashSearchQuery.toLowerCase()))
                );

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                        <ArchiveRestore className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {trashSearchQuery ? "Không tìm thấy đề thi phù hợp" : "Thùng rác trống"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                        {trashSearchQuery
                          ? "Hãy thử tìm với từ khóa hoặc tên môn học khác."
                          : "Chưa có bộ đề nào bị xóa. Khi bạn xóa đề, đề sẽ nằm ở đây và có thể hoàn tác lại bất kỳ lúc nào!"}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2.5">
                    {filtered.map((set) => {
                      const { formattedDate, cleanDesc } = parseDeletedMeta(set.description);
                      const questionCount = set.questions?.[0]?.count ?? 0;
                      const isProcessing = isProcessingId === set.id;

                      return (
                        <div
                          key={set.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {set.subject || "Tổng hợp"}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>Đã xóa: {formattedDate}</span>
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {set.title}
                            </h4>
                            {cleanDesc && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {cleanDesc}
                              </p>
                            )}
                            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                              {questionCount} câu hỏi được bảo lưu nguyên vẹn
                            </div>
                          </div>

                          {/* 2 Nút Hành Động: Hoàn Tác & Xóa Vĩnh Viễn */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {/* Nút Hoàn tác */}
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleRestore(set.id, trashTab === "system")}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                              title="Khôi phục bộ đề về danh sách hoạt động"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{isProcessing ? "Đang phục hồi..." : "Hoàn tác"}</span>
                            </button>

                            {/* Nút Xóa vĩnh viễn */}
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                setConfirmPermanentModal({
                                  id: set.id,
                                  title: set.title,
                                })
                              }
                              className="p-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-rose-500/15 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                              title="Xóa triệt để vĩnh viễn"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 dark:bg-slate-950/40">
              <span>Đề khôi phục sẽ xuất hiện ngay lập tức tại danh sách bộ câu hỏi.</span>
              <button
                type="button"
                onClick={() => setShowTrashModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL XÁC NHẬN: XÓA VĨNH VIỄN KHÔNG THỂ KHÔI PHỤC              */}
      {/* ============================================================== */}
      {confirmPermanentModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Xác Nhận Xóa Vĩnh Viễn?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Bạn có chắc chắn muốn xóa vĩnh viễn{" "}
              <strong className="text-rose-600 dark:text-rose-400 font-semibold">
                "{confirmPermanentModal.title}"
              </strong>
              ? Dữ liệu câu hỏi sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu và{" "}
              <strong>KHÔNG THỂ HOÀN TÁC</strong> sau bước này.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isProcessingId === "permanent-del"}
                onClick={() => setConfirmPermanentModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={isProcessingId === "permanent-del"}
                onClick={handleConfirmPermanentDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                {isProcessingId === "permanent-del" ? (
                  <span>Đang dọn dẹp...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Vĩnh Viễn</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
