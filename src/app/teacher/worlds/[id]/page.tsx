import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { TeacherWorldClient } from "./TeacherWorldClient";

interface TeacherWorldPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherWorldPage({ params }: TeacherWorldPageProps) {
  const { id } = await params;
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("game_sessions").select("*").eq("id", id);
  if (!isAdmin) {
    query = query.eq("host_id", user.id);
  }

  const { data: session } = await query.single();

  if (!session) {
    notFound();
  }

  const { data: players } = await supabase
    .from("session_players")
    .select("*")
    .eq("session_id", id)
    .order("score", { ascending: false });

  return (
    <TeacherWorldClient
      session={session}
      players={players || []}
    />
  );
}
