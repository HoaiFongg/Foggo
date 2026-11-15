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
    user.email?.toLowerCase() === "hoaifongg@gmail.com" ||
    user.app_metadata?.role === "admin";

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

  // Tải danh sách người dùng kèm trường và lớp (dùng explicit FK để tránh lỗi PGRST201)
  const [{ data: users }, { data: authUsersData }] = await Promise.all([
    adminClient
      .from("profiles")
      .select("*, schools:school_id(name), classes:class_id(name)")
      .order("created_at", { ascending: false })
      .limit(150),
    adminClient.auth.admin.listUsers({ perPage: 200 }),
  ]);

  const authUserMap = new Map((authUsersData?.users || []).map((u) => [u.id, u]));

  const enrichedUsers = (users || []).map((u) => {
    const authUser = authUserMap.get(u.id);
    let managedPassword =
      authUser?.user_metadata?.managed_password ||
      authUser?.user_metadata?.initial_password ||
      null;

    // Các tài khoản test mẫu mặc định nếu chưa lưu
    if (!managedPassword) {
      if (u.username === "hocsinh_test") managedPassword = "TestPassword123!";
      else if (authUser?.email === "giaovien_test@foggo.vn") managedPassword = "TestPassword123!";
      else if (authUser?.email === "hoaifongg@gmail.com") managedPassword = "Admin@123456";
    }

    return {
      ...u,
      email: authUser?.email || (u.auth_type === "username" ? `${u.username}@student.foggo.vn` : ""),
      managed_password: managedPassword,
    };
  });

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
      users={enrichedUsers}
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
