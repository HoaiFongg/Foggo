"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";

export function QuickJoinCard() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();
    if (!cleanCode) return;

    setIsLoading(true);

    let token = cleanCode;
    if (cleanCode.includes("/j/")) {
      const parts = cleanCode.split("/j/");
      token = parts[parts.length - 1].split("?")[0].split("/")[0];
    } else if (cleanCode.includes("/world/")) {
      const parts = cleanCode.split("/world/");
      token = parts[parts.length - 1].split("?")[0].split("/")[0];
      router.push(`/world/${token}`);
      return;
    }

    router.push(`/j/${token}`);
  };

  return (
    <form onSubmit={handleJoin} className="flex items-center gap-2 mt-3">
      <div className="relative flex-1">
        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Nhập mã phòng hoặc liên kết..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl pixel-input bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-mono tracking-wider transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={!code.trim() || isLoading}
        className="px-4 py-2.5 rounded-xl pixel-btn-amber disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer uppercase font-mono"
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <>
            <span>Vào phòng</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
