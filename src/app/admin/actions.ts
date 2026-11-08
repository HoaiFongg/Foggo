"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole, UserPlan } from "@/types/database";

// Kiểm tra quyền Admin của caller
async function verifyAdminCaller() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Chưa đăng nhập");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Bạn không có quyền quản trị viên (Admin)");
  }

  return user;
}

export async function updateUserRole({
  targetUserId,
  newRole,
}: {
  targetUserId: string;
  newRole: UserRole;
}) {
  await verifyAdminCaller();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function updateUserPlan({
  targetUserId,
  newPlan,
}: {
  targetUserId: string;
  newPlan: UserPlan;
}) {
  await verifyAdminCaller();
  const adminClient = createAdminClient();

  const daysToAdd = newPlan === "plus" ? 365 : 0;
  const expiresAt = newPlan === "plus" ? new Date(Date.now() + daysToAdd * 86400000).toISOString() : null;

  const { error } = await adminClient
    .from("profiles")
    .update({
      plan: newPlan,
      plan_expires_at: expiresAt,
    })
    .eq("id", targetUserId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function verifySchool({
  schoolId,
  status,
}: {
  schoolId: string;
  status: "verified" | "rejected";
}) {
  await verifyAdminCaller();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("schools")
    .update({ status })
    .eq("id", schoolId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  return { success: true };
}
