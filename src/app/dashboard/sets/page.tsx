import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { NavigationHeader } from "@/components/NavigationHeader";
import { QuestionSetsClient } from "./QuestionSetsClient";

export const dynamic = "force-dynamic";

export default async function QuestionSetsPage() {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  const { data: mySets } = await supabase
    .from("question_sets")
    .select("*, questions(count)")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  let systemSets: any[] = [];
  if (isAdmin) {
    const { data: allSets } = await supabase
      .from("question_sets")
      .select("*, questions(count), profiles:owner_id(display_name)")
      .neq("owner_id", user.id)
      .order("updated_at", { ascending: false });
    systemSets = allSets || [];
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavigationHeader profile={profile} activeItem="sets" />

      {/* Main Container - Dàn trải đều toàn màn hình */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8">
        <QuestionSetsClient
          mySets={(mySets as any) || []}
          systemSets={(systemSets as any) || []}
          isAdmin={isAdmin}
        />
      </main>
    </div>
  );
}
