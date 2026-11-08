import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  if (profile.must_change_password) {
    redirect("/change-password");
  }

  if (roles && !roles.includes(profile.role as UserRole)) {
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return { user, profile: (profile as Profile) || null };
  } catch {
    return { user: null, profile: null };
  }
}

