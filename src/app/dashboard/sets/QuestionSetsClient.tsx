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
} from "lucide-react";
import { deleteQuestionSet, createQuestionSetFromExcel, getQuestionsForExport } from "./actions";
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
  isAdmin: boolean;
}

export function QuestionSetsClient({
  mySets,
  systemSets,
  isAdmin,
}: QuestionSetsClientProps) {
  const { t, language, isEn } = useLanguage();
  const [showImportModal, setShowImportModal] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

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
      {/* Tiêu đề & Các nút thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t.sets.title}
            </h1>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-semibold">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {t.sets.subtitle}
          </p>
        </div>

        {/* Thanh công cụ: Tải file mẫu, Nhập Excel, Tạo mới */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Nút 1: Tải file mẫu Excel */}
          <button
            type="button"
            onClick={() => downloadSampleTemplateExcel()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download Excel Template"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.sets.downloadTemplate}</span>
          </button>

          {/* Nút 2: Nhập đề từ Excel */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.sets.importExcel}</span>
          </button>

          {/* Nút 3: Tạo bộ đề mới thủ công */}
          <Link
            href="/dashboard/sets/new"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.sets.createBtn}</span>
          </Link>
        </div>
      </div>

      {/* Section 1: Bộ câu hỏi của bạn */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {isEn ? `Your Question Sets (${mySets.length})` : `Bộ câu hỏi của bạn (${mySets.length})`}
          </h2>
        </div>

        {mySets.length === 0 ? (
          <div className="p-10 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-md mx-auto my-8 space-y-4">
            <BookOpen className="w-8 h-8 text-slate-500 mx-auto" />
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">{t.sets.empty}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isEn ? "Create a set manually or upload an Excel file to generate quiz items automatically." : "Bạn có thể tạo bộ đề thủ công hoặc tải file Excel có sẵn lên để hệ thống tự động nhận diện và tạo đề trong 3 giây."}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => downloadSampleTemplateExcel()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 cursor-pointer"
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
            {mySets.map((set) => {
              const localized = localizeQuestionSet(set, language);
              const questionCount = set.questions?.[0]?.count ?? 0;
              const isWorking = isExporting === set.id;

              return (
                <div
                  key={set.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                        {set.subject ? (isEn && set.subject === "Tổng hợp" ? "General" : set.subject) : (isEn ? "General" : "Tổng hợp")}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {set.visibility === "public" ? (
                          <span title={t.sets.visibilityPublic}><Globe className="w-3.5 h-3.5 text-emerald-400" /></span>
                        ) : set.visibility === "unlisted" ? (
                          <span title="Link"><EyeOff className="w-3.5 h-3.5 text-blue-400" /></span>
                        ) : (
                          <span title={t.sets.visibilityPrivate}><Lock className="w-3.5 h-3.5 text-slate-500" /></span>
                        )}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {localized.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {localized.description || (isEn ? "No description provided." : "Không có mô tả.")}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{questionCount} {t.sets.questionsCount}</span>

                    <div className="flex items-center gap-1">
                      {/* Nút Sao lưu Excel */}
                      <button
                        type="button"
                        onClick={() => handleBackup(set.id, set.title, "excel")}
                        disabled={isWorking}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-400 transition-colors cursor-pointer"
                        title="Export Excel"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>

                      {/* Nút Sao lưu JSON */}
                      <button
                        type="button"
                        onClick={() => handleBackup(set.id, set.title, "json")}
                        disabled={isWorking}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-500/20 hover:text-blue-300 text-slate-400 transition-colors cursor-pointer"
                        title="Sao lưu ra file JSON (.json)"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Nút Sửa */}
                      <Link
                        href={`/dashboard/sets/${set.id}/edit`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        title="Chỉnh sửa câu hỏi"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Nút Xóa */}
                      <form
                        action={async () => {
                          if (confirm(`Bạn có chắc muốn xóa bộ câu hỏi "${set.title}" không?`)) {
                            await deleteQuestionSet(set.id);
                          }
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Xóa bộ đề"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Quản trị các bộ đề khác (Chỉ Admin) */}
      {isAdmin && systemSets.length > 0 && (
        <div className="pt-8 border-t border-slate-800/80">
          <h2 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            <span>Bộ câu hỏi khác trong hệ thống ({systemSets.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {systemSets.map((set) => {
              const questionCount = set.questions?.[0]?.count ?? 0;
              const author = set.profiles?.display_name || "Giáo viên";

              return (
                <div
                  key={set.id}
                  className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/80 hover:border-rose-500/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {set.subject || "Tổng hợp"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono truncate max-w-[120px]">
                        {author}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">
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

                      <form
                        action={async () => {
                          if (confirm(`Bạn có chắc muốn xóa bộ câu hỏi "${set.title}" không?`)) {
                            await deleteQuestionSet(set.id);
                          }
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Xóa (Admin)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:pointer-events-none text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
    </div>
  );
}
