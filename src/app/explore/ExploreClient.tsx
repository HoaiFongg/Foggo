"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Copy,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { duplicateQuestionSet } from "./actions";

import { NavigationHeader } from "@/components/NavigationHeader";
import type { Profile } from "@/types/database";
import { useLanguage } from "@/lib/i18n/useLanguage";
import { localizeQuestionSet } from "@/lib/i18n/questions-translation";

interface ExploreClientProps {
  initialSets: any[];
  profile?: Profile | null;
}

const SUBJECT_FILTERS = [
  "Tất cả",
  "Toán học",
  "Tiếng Anh",
  "Khoa học tự nhiên",
  "Lịch sử & Địa lý",
  "Ngữ văn",
  "Sinh tồn Foggo",
];

export function ExploreClient({ initialSets, profile = null }: ExploreClientProps) {
  const router = useRouter();
  const { t, language, isEn } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Mẫu dữ liệu cộng đồng nếu ban đầu chưa có nhiều bộ công khai
  const sampleSets = useMemo(
    () => [
      {
        id: "sample_1",
        title: "Bí Kíp Sinh Tồn Foggo: Động Thực Vật Rừng",
        description: "Bộ câu hỏi trắc nghiệm và chạm điểm yếu (Hotspot) về kỹ năng sinh tồn và nhận biết thảo dược.",
        subject: "Sinh tồn Foggo",
        grade: 6,
        questionsCount: 12,
        author: "Thầy Hưng (Foggo Ranger)",
      },
      {
        id: "sample_2",
        title: "Toán Học Lớp 6: Số Học & Phân Số Diệu Kỳ",
        description: "Các bài toán vui tính toán tài nguyên, xây dựng hàng rào và đếm xu sinh tồn.",
        subject: "Toán học",
        grade: 6,
        questionsCount: 15,
        author: "Cô Lan Anh",
      },
      {
        id: "sample_3",
        title: "English Adventure: Wilderness Vocabulary",
        description: "Từ vựng tiếng Anh chủ đề thiên nhiên, động vật hoang dã và hành trình khám phá đảo.",
        subject: "Tiếng Anh",
        grade: 7,
        questionsCount: 18,
        author: "Teacher Mike",
      },
      {
        id: "sample_4",
        title: "Khoa Học Tự Nhiên: Các Hiện Tượng Thời Tiết & Sương Mù",
        description: "Giải thích sự hình thành sương mù, mây mưa và chu kỳ ngày đêm trong tự nhiên.",
        subject: "Khoa học tự nhiên",
        grade: 6,
        questionsCount: 10,
        author: "Thầy Minh",
      },
    ],
    []
  );

  const displaySets = useMemo(() => {
    const combined = [
      ...initialSets.map((s) => {
        const loc = localizeQuestionSet(s, language);
        return {
          id: s.id,
          title: loc.title,
          description: loc.description,
          subject: s.subject ? (isEn && s.subject === "Tổng hợp" ? "General" : s.subject) : (isEn ? "General" : "Tổng hợp"),
          grade: s.grade,
          questionsCount: s.questions?.length || 0,
          author: s.profiles?.display_name || (isEn ? "Teacher" : "Giáo viên"),
        };
      }),
      ...sampleSets.map((s) => ({
        ...s,
        title: isEn ? (s.id === "sample_1" ? "Foggo Survival Codex: Forest Flora & Fauna" : s.id === "sample_2" ? "Grade 6 Math: Magical Fractions & Algebra" : "English Vocabulary: Island Explorer Quest") : s.title,
        description: isEn ? "Practice questions, hotspot weak-point tapping, and survival skill mastery." : s.description,
      })),
    ];

    return combined.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSubject =
        selectedSubject === "Tất cả" || selectedSubject === "All" || s.subject === selectedSubject;
      return matchSearch && matchSubject;
    });
  }, [initialSets, sampleSets, searchQuery, selectedSubject, language, isEn]);

  async function handleDuplicate(setId: string) {
    if (setId.startsWith("sample_")) {
      alert("Đã sao chép bộ câu hỏi mẫu thành công vào thư viện của bạn!");
      router.push("/dashboard/sets");
      return;
    }

    setDuplicatingId(setId);
    const res = await duplicateQuestionSet(setId);
    setDuplicatingId(null);

    if (res?.error) {
      alert(res.error);
      return;
    }

    setSuccessId(setId);
    setTimeout(() => {
      router.push(`/dashboard/sets/${res.newSetId}/edit`);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      {/* Header */}
      <NavigationHeader profile={profile} activeItem="explore" />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 space-y-6">
        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search by subject, lesson topic, or set title..." : "Tìm kiếm theo chủ đề, tên bài học, môn học..."}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans text-sm"
            />
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs font-mono">
            {SUBJECT_FILTERS.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubject === subj
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới danh sách bộ câu hỏi dàn trải rộng rãi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displaySets.map((s) => (
            <div
              key={s.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg hover:shadow-amber-500/5 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {s.subject} {s.grade ? `· Lớp ${s.grade}` : ""}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {s.questionsCount} câu hỏi
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2 leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {s.description || "Bộ câu hỏi sinh tồn tổng hợp được chia sẻ cho cộng đồng Foggo."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]">
                  Bởi: {s.author}
                </span>

                <button
                  type="button"
                  disabled={duplicatingId === s.id}
                  onClick={() => handleDuplicate(s.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {successId === s.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{duplicatingId === s.id ? "Đang chép..." : "Nhân bản"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

