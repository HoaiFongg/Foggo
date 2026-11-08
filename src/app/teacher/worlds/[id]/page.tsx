import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { TeacherWorldClient } from "./TeacherWorldClient";

interface TeacherWorldPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherWorldPage({ params }: TeacherWorldPageProps) {
  const { id } = await params;
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("id", id)
    .eq("host_id", user.id)
    .single();

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

