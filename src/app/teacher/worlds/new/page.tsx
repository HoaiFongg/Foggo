import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { NewWorldClient } from "./NewWorldClient";

export default async function NewWorldPage() {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase
    .from("question_sets")
    .select("id, title, subject, play_count, questions(count)")
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query = query.or(`owner_id.eq.${user.id},visibility.eq.public`);
  }

  const { data: sets } = await query;

  return <NewWorldClient questionSets={sets || []} profile={profile} />;
}
