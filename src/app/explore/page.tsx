import { createClient } from "@/lib/supabase/server";
import { getOptionalUser } from "@/lib/auth";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage() {
  const { profile } = await getOptionalUser();
  const supabase = await createClient();

  const { data: publicSets } = await supabase
    .from("question_sets")
    .select(`
      id,
      title,
      description,
      subject,
      grade_level,
      visibility,
      created_at,
      profiles:owner_id (
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

  return <ExploreClient initialSets={publicSets || []} profile={profile} />;
}
