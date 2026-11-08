"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame, Compass, ArrowRight, Sparkles, User, ShieldAlert } from "lucide-react";

interface JoinPageClientProps {
  token: string;
  session: {
    id: string;
    title: string;
    mode: string;
    status: string;
    allow_guests: boolean;
  };
  currentUser: {
    displayName: string;
    isLoggedIn: boolean;
  } | null;
}

export function JoinPageClient({
  token,
  session,
  currentUser,
}: JoinPageClientProps) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/world/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          nickname: currentUser?.isLoggedIn ? currentUser.displayName : nickname,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Không thể tham gia thế giới này");
        setLoading(false);
        return;
      }

      // Chuyển tới màn hình đảo của học sinh
      router.push(`/world/${data.sessionId}`);
    } catch {
      setError("Lỗi kết nối máy chủ, vui lòng thử lại");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Thế giới info */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(245,158,11,0.25)] mb-4">
            <Flame className="w-8 h-8 animate-pulse" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Thế Giới Đang Mở
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-mono mt-3">
            {session.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Không cần mã PIN · Vào chơi trực tiếp
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {currentUser?.isLoggedIn ? (
            /* Đã đăng nhập */
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400 font-mono">Nhân vật của bạn</p>
                  <p className="text-sm font-bold text-white">{currentUser.displayName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleJoin()}
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Đang kết nối vào đảo...</span>
                ) : (
                  <>
                    <Compass className="w-5 h-5" />
                    <span>Tiến vào Đảo Sinh Tồn</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          ) : session.allow_guests ? (
            /* Chưa đăng nhập & cho phép khách */
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                  Biệt danh (Nickname) của bạn
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="ví dụ: Tuấn Khủng Long"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Đang vào...</span>
                ) : (
                  <>
                    <span>Vào chơi với tên tạm (Khách)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400 mb-2">
                  Muốn lưu điểm và Đom Đóm vĩnh viễn?
                </p>
                <div className="flex items-center justify-center gap-3 text-xs font-semibold">
                  <Link
                    href={`/login?next=/j/${token}`}
                    className="text-amber-400 hover:underline"
                  >
                    Đăng nhập
                  </Link>
                  <span className="text-slate-600">·</span>
                  <Link
                    href="/register/student"
                    className="text-amber-400 hover:underline"
                  >
                    Đăng ký nhanh (30s)
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            /* Chưa đăng nhập & không cho phép khách */
            <div className="text-center space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2.5 text-left">
                <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
                <span>
                  Thế giới này do giáo viên tạo riêng cho lớp và yêu cầu đăng nhập tài khoản học sinh.
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={`/login?next=/j/${token}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105"
                >
                  <span>Đăng nhập để vào chơi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/register/student"
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center transition-colors"
                >
                  <span>Chưa có tài khoản? Đăng ký học sinh không cần email</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

