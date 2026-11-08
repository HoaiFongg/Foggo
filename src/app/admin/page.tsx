import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminClient } from "./AdminClient";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const adminClient = createAdminClient();

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isSuperAdminEmail =
    user.email === "hoaifongg@gmail.com" ||
    user.user_metadata?.role === "admin";

  if (isSuperAdminEmail && profile?.role !== "admin") {
    await adminClient.from("profiles").upsert({
      id: user.id,
      display_name:
        profile?.display_name ||
        user.user_metadata?.display_name ||
        "Phạm Nguyễn Hoài Phong (Admin)",
      role: "admin",
      plan: "plus",
      auth_type: "email",
    });

    if (profile) {
      profile.role = "admin";
      profile.plan = "plus";
    } else {
      profile = {
        id: user.id,
        display_name: "Phạm Nguyễn Hoài Phong (Admin)",
        role: "admin",
        plan: "plus",
        auth_type: "email",
      } as any;
    }
  }

  const { count: adminCount } = await adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  const hasNoAdminYet = (adminCount || 0) === 0;

  if (hasNoAdminYet && profile) {
    await adminClient
      .from("profiles")
      .update({ role: "admin", plan: "plus" })
      .eq("id", user.id);

    profile.role = "admin";
    profile.plan = "plus";
  }

  const isUserAdmin = profile?.role === "admin" || isSuperAdminEmail;

  // Tải danh sách người dùng kèm trường và lớp
  const { data: users } = await adminClient
    .from("profiles")
    .select("*, schools(name), classes(name)")
    .order("created_at", { ascending: false })
    .limit(150);

  const { data: schools } = await adminClient
    .from("schools")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: totalQuestions } = await adminClient
    .from("questions")
    .select("*", { count: "exact", head: true });

  const { count: totalSessions } = await adminClient
    .from("game_sessions")
    .select("*", { count: "exact", head: true });

  return (
    <AdminClient
      currentUser={profile || user}
      isUserAdmin={isUserAdmin}
      users={users || []}
      schools={schools || []}
      metrics={{
        totalUsers: users?.length || 0,
        totalSchools: schools?.length || 0,
        totalQuestions: totalQuestions || 0,
        totalSessions: totalSessions || 0,
      }}
    />
  );
}
