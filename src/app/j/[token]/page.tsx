import Link from "next/link";
import { notFound } from "next/navigation";
import { Flame, AlertTriangle, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getOptionalUser } from "@/lib/auth";
import { JoinPageClient } from "./JoinPageClient";

interface JoinPageProps {
  params: Promise<{ token: string }>;
}

export default async function JoinTokenPage({ params }: JoinPageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("game_sessions")
    .select("id, title, mode, status, allow_guests")
    .eq("join_token", token)
    .single();

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white font-mono">LINK KHÔNG HỢP LỆ</h1>
        <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
          Link này không tồn tại, đã hết hạn hoặc giáo viên đã đổi sang một link mới để bảo mật phòng.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ Foggo</span>
        </Link>
      </div>
    );
  }

  const { user, profile } = await getOptionalUser();

  const currentUser = user
    ? {
        displayName: profile?.display_name || user?.user_metadata?.display_name || "Nhà Thám Hiểm",
        isLoggedIn: true,
      }
    : null;

  return (
    <JoinPageClient
      token={token}
      session={session}
      currentUser={currentUser}
    />
  );
}

