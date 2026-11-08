import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { NewWorldClient } from "./NewWorldClient";

export default async function NewWorldPage() {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  const { data: sets } = await supabase
    .from("question_sets")
    .select("id, title, subject")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return <NewWorldClient questionSets={sets || []} />;
}
