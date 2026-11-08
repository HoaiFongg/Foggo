"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Copy, Check, Download, ArrowRight, Flame } from "lucide-react";

export default function RecoveryCodePage() {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const savedCode = sessionStorage.getItem("foggo_recovery_code");
    const savedUser = sessionStorage.getItem("foggo_username");
    if (!savedCode) {
      router.push("/login");
      return;
    }
    setCode(savedCode);
    if (savedUser) setUsername(savedUser);
  }, [router]);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const content = `TÀI KHOẢN FOGGO\n\nTên đăng nhập: ${username}\nMã khôi phục: ${code}\nNgày tạo: ${new Date().toLocaleDateString("vi-VN")}\n\nLưu ý: Giữ mã này cẩn thận. Nếu bạn quên mật khẩu, mã này là cách duy nhất để bạn tự đặt lại mật khẩu của mình!`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foggo-recovery-${username || "code"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleContinue() {
    sessionStorage.removeItem("foggo_recovery_code");
    sessionStorage.removeItem("foggo_username");
    router.push("/dashboard");
  }

  if (!code) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_25px_rgba(245,158,11,0.25)]">
            <Flame className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white mt-4 font-mono">LƯU MÃ KHÔI PHỤC</h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Mã này chỉ xuất hiện <span className="text-amber-400 font-semibold">MỘT LẦN DUY NHẤT</span>
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Vì bạn đăng ký <strong>không dùng email</strong>, mã này là chiếc chìa khóa duy nhất để bạn đặt lại mật khẩu nếu bị quên. Hãy ghi lại hoặc tải file về máy ngay bây giờ!
            </p>
          </div>

          {/* Ô hiển thị mã khôi phục */}
          <div className="my-6 p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-amber-500/40 text-center relative group">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2 font-mono">
              Mã khôi phục bí mật
            </p>
            <div className="text-2xl sm:text-3xl font-black tracking-widest text-amber-400 font-mono select-all">
              {code}
            </div>
            {username && (
              <p className="text-xs text-slate-400 mt-2 font-mono">
                Tài khoản: <span className="text-white">{username}</span>
              </p>
            )}
          </div>

          {/* Nút hành động sao chép & tải file */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? "Đã sao chép" : "Sao chép mã"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Tải file .txt</span>
            </button>
          </div>

          {/* Checkbox xác nhận */}
          <label className="flex items-start gap-3 text-xs text-slate-300 cursor-pointer select-none mb-6">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950 w-4 h-4"
            />
            <span>
              Tôi xác nhận đã lưu lại mã khôi phục này ở nơi an toàn.
            </span>
          </label>

          <button
            onClick={handleContinue}
            disabled={!confirmed}
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/30 active:scale-[0.99] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <span>Tiến vào Thế giới Foggo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

