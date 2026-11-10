import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, UserRole } from "@/types/database";

export async function requireUser(roles?: UserRole[]): Promise<{
  user: any;
  profile: Profile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    redirect("/login");
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Tự động thăng cấp Admin và Gói Plus cho tài khoản hoaifongg@gmail.com hoặc app_metadata role=admin (bảo mật tuyệt đối, không tin cậy user_metadata từ client)
  const isSuperAdminEmail =
    user.email?.toLowerCase() === "hoaifongg@gmail.com" ||
    user.app_metadata?.role === "admin";

  if (isSuperAdminEmail && profile?.role !== "admin") {
    try {
      const adminClient = createAdminClient();
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
      const { data: updated } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (updated) profile = updated;
      else if (profile) {
        profile.role = "admin";
        profile.plan = "plus";
      }
    } catch {
      if (profile) {
        profile.role = "admin";
        profile.plan = "plus";
      }
    }
  }

  if (!profile) {
    if (isSuperAdminEmail) {
      profile = {
        id: user.id,
        display_name:
          user.user_metadata?.display_name || "Phạm Nguyễn Hoài Phong (Admin)",
        role: "admin",
        plan: "plus",
        auth_type: "email",
        fireflies: 9999,
        created_at: new Date().toISOString(),
      } as Profile;
    } else {
      redirect("/onboarding");
    }
  }

  if (profile.must_change_password) {
    redirect("/change-password");
  }

  // Quản trị viên (Admin) có toàn quyền truy cập mọi tính năng (kể cả tính năng giáo viên hoặc học sinh)
  if (roles && profile.role !== "admin" && !roles.includes(profile.role as UserRole)) {
    redirect("/dashboard");
  }

  return { user, profile: profile as Profile };
}

export async function getOptionalUser(): Promise<{
  user: any | null;
  profile: Profile | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, profile: null };

    let { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const isSuperAdminEmail =
      user.email?.toLowerCase() === "hoaifongg@gmail.com" ||
      user.app_metadata?.role === "admin";

    if (isSuperAdminEmail && profile?.role !== "admin") {
      try {
        const adminClient = createAdminClient();
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
        const { data: updated } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (updated) profile = updated;
        else if (profile) {
          profile.role = "admin";
          profile.plan = "plus";
        }
      } catch {
        if (profile) {
          profile.role = "admin";
          profile.plan = "plus";
        }
      }
    }

    if (!profile && isSuperAdminEmail) {
      profile = {
        id: user.id,
        display_name:
          user.user_metadata?.display_name || "Phạm Nguyễn Hoài Phong (Admin)",
        role: "admin",
        plan: "plus",
        auth_type: "email",
        fireflies: 9999,
        created_at: new Date().toISOString(),
      } as Profile;
    }

    return { user, profile: (profile as Profile) || null };
  } catch {
    return { user: null, profile: null };
  }
}
