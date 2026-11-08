"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Flame,
  Swords,
  Shield,
  Clock,
  Users,
  QrCode,
  BookOpen,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { createWorld } from "../actions";
import { NavigationHeader } from "@/components/NavigationHeader";
import type { Profile } from "@/types/database";

interface NewWorldClientProps {
  questionSets: Array<{
    id: string;
    title: string;
    subject: string | null;
    questions?: Array<{ count: number }>;
  }>;
  profile?: Profile | null;
}

export function NewWorldClient({ questionSets, profile = null }: NewWorldClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [worldTitle, setWorldTitle] = useState("");
  const [selectedSetId, setSelectedSetId] = useState<string>(questionSets[0]?.id || "");
  const [selectedMode, setSelectedMode] = useState<"survival" | "peaceful">("survival");
  const [dailyLimit, setDailyLimit] = useState<number>(30);
  const [allowGuests, setAllowGuests] = useState<boolean>(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createWorld(formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  const selectedSet = questionSets.find((s) => s.id === selectedSetId);
  const questionCount = (selectedSet as any)?.questions?.[0]?.count ?? 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="worlds" />

      {/* Main Container - Dàn trải đều toàn màn hình */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
        {/* Tiêu đề & Breadcrumb ngắn gọn */}
        <div className="pb-6 border-b border-slate-800/80 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-amber-400" />
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Thiết Lập Hầm Ngục & Thế Giới Mới
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Không cần mã PIN — Hệ thống tự tạo mã QR và link truy cập trực tiếp cho học sinh.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/worlds"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              Xem danh sách thế giới
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Bố cục 2 Cột Rộng Rãi: Trái = Form cài đặt, Phải = Xem trước & Luật chơi */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI (7 CỘT): FORM CẤU HÌNH */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Tên Thế Giới */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Tên Hầm Ngục / Thế Giới <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={worldTitle}
                onChange={(e) => setWorldTitle(e.target.value)}
                placeholder="ví dụ: Đảo Sinh Tồn 8A1 - Ôn thi Giữa kỳ"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm font-sans"
              />

              {/* Gợi ý chọn nhanh */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="text-slate-500">Gợi ý nhanh:</span>
                {[
                  "Đảo Sương Mù 8A1",
                  "Chiến Binh Sinh Tồn 9A2",
                  "Đấu Trường Tri Thức",
                  "Vượt Đêm Sương Mù",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWorldTitle(preset)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Chọn Bộ Câu Hỏi */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Bộ câu hỏi gắn vào thế giới
                </label>
                <Link
                  href="/dashboard/sets/new"
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo bộ đề mới</span>
                </Link>
              </div>

              {questionSets.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Chưa có bộ câu hỏi nào sẵn sàng.</span>
                  <Link
                    href="/dashboard/sets/new"
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Tạo bộ đề ngay →
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    name="setId"
                    value={selectedSetId}
                    onChange={(e) => setSelectedSetId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500 font-sans cursor-pointer"
                  >
                    {questionSets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.subject || "Tổng hợp"})
                      </option>
                    ))}
                  </select>

                  {selectedSet && (
                    <div className="flex items-center gap-3 text-xs text-slate-400 px-1 pt-1 font-mono">
                      <span>Môn: <strong className="text-slate-300">{selectedSet.subject || "Tổng hợp"}</strong></span>
                      <span>·</span>
                      <span>Số lượng: <strong className="text-amber-400">{questionCount} câu hỏi</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Chế Độ Chơi & Thời Gian */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Chế độ chơi & Giới hạn thời gian
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Chọn Mode */}
                <div
                  onClick={() => setSelectedMode("survival")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedMode === "survival"
                      ? "bg-amber-500/10 border-amber-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1 text-amber-400">
                    <Swords className="w-4 h-4" />
                    <span>Sinh Tồn Tri Thức</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Đói, mất máu khi sai, đợt quái đêm tấn công. Chế độ chuẩn hấp dẫn.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedMode("peaceful")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedMode === "peaceful"
                      ? "bg-emerald-500/10 border-emerald-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs mb-1 text-emerald-400">
                    <Shield className="w-4 h-4" />
                    <span>Yên Bình (Ôn Tập)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Không mất máu, không đói. Dành cho việc ôn tập và củng cố bài vở.
                  </p>
                </div>
              </div>

              <input type="hidden" name="mode" value={selectedMode} />

              {/* Giới hạn phút chơi */}
              <div className="pt-2">
                <label className="block text-[11px] font-mono text-slate-400 mb-1.5">
                  Giới hạn thời gian chơi mỗi ngày của học sinh
                </label>
                <select
                  name="dailyLimitMin"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value={15}>15 phút / ngày</option>
                  <option value={30}>30 phút / ngày (Khuyên dùng)</option>
                  <option value={45}>45 phút / ngày (1 tiết học)</option>
                  <option value={60}>60 phút / ngày</option>
                  <option value={0}>Không giới hạn thời gian</option>
                </select>
              </div>
            </div>

            {/* 4. Cho phép khách chơi thử */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
              <input
                type="checkbox"
                id="allowGuests"
                name="allowGuests"
                checked={allowGuests}
                onChange={(e) => setAllowGuests(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="allowGuests" className="text-xs cursor-pointer select-none">
                <p className="font-bold text-white mb-0.5">
                  Cho phép học sinh tham gia bằng Tên tạm (Khách)
                </p>
                <p className="text-[11px] text-slate-400">
                  Học sinh chưa kịp tạo tài khoản vẫn có thể bấm vào link hoặc quét mã QR để chơi ngay lập tức.
                </p>
              </label>
            </div>

            {/* Nút Submit & Hủy */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>{loading ? "Đang khởi tạo..." : "Khởi Tạo Hầm Ngục Ngay"}</span>
              </button>

              <Link
                href="/worlds"
                className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm transition-colors border border-slate-800"
              >
                Hủy bỏ
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI (5 CỘT): XEM TRƯỚC ĐẢO & THÔNG SỐ VẬN HÀNH */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card Preview Cơ Chế Vận Hành */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Cơ Chế Hầm Ngục Sương Mù</span>
              </h2>

              {/* Thông số trực quan */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Không cần mã PIN</span>
                  <span className="font-semibold text-emerald-400 font-mono">Link / QR tức thì</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Chế độ vận hành</span>
                  <span className="font-semibold text-amber-400 font-mono">
                    {selectedMode === "survival" ? "Sinh tồn tri thức" : "Yên bình ôn tập"}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Giới hạn thời gian</span>
                  <span className="font-semibold text-slate-200 font-mono">
                    {dailyLimit === 0 ? "Không giới hạn" : `${dailyLimit} phút / ngày`}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Lưu trữ nhân vật</span>
                  <span className="font-semibold text-emerald-400 font-mono">Liên tục nhiều ngày</span>
                </div>
              </div>

              {/* Tóm tắt 3 bước cho giáo viên */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Quy trình vào chơi 3 bước:
                </p>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Bấm <strong>Khởi Tạo Hầm Ngục</strong> để sinh phòng chơi.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Chiếu mã QR lên máy chiếu hoặc gửi link vào nhóm Zalo/Teams của lớp.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Theo dõi học sinh chiến đấu sinh tồn thời gian thực trên bảng điều khiển.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner hỗ trợ nhanh */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 border border-amber-500/20">
              <h3 className="text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <span>💡</span>
                <span>Lời khuyên tổ chức</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nên chọn chế độ <strong>Sinh Tồn Tri Thức</strong> với các bộ đề từ 10 - 25 câu hỏi để học sinh có đủ vòng quay nguyên liệu chế tạo vũ khí đánh trùm.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
