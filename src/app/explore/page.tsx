import { createClient } from "@/lib/supabase/server";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage() {
  const supabase = await createClient();

  const { data: publicSets } = await supabase
    .from("question_sets")
    .select(`
      id,
      title,
      description,
      subject,
      grade,
      visibility,
      created_at,
      profiles:created_by (
        display_name,
        avatar_url
      ),
      questions (
        id
      )
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(30);

  return <ExploreClient initialSets={publicSets || []} />;
}
