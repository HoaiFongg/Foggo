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

  // Tải profile của user hiện tại
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const adminClient = createAdminClient();

  // Kiểm tra xem hệ thống đã có admin nào chưa
  const { count: adminCount } = await adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  const hasNoAdminYet = (adminCount || 0) === 0;

  // Nếu chưa có admin nào trong hệ thống, tự động thăng quyền cho tài khoản đầu tiên truy cập trang này
  if (hasNoAdminYet && profile) {
    await adminClient
      .from("profiles")
      .update({ role: "admin", plan: "plus" })
      .eq("id", user.id);

    profile.role = "admin";
    profile.plan = "plus";
  }

  const isUserAdmin = profile?.role === "admin";

  // Tải dữ liệu quản trị
  const { data: users } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

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
      currentUser={profile}
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

