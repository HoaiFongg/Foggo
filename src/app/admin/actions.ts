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

  const isSuperAdmin =
    user.email?.toLowerCase() === "hoaifongg@gmail.com" ||
    user.app_metadata?.role === "admin";

  if (isSuperAdmin) return user;

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

  const { error } = await adminClient
    .from("profiles")
    .update({ plan: newPlan })
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

export async function awardFireflies({
  targetUserId,
  amount,
}: {
  targetUserId: string;
  amount: number;
}) {
  await verifyAdminCaller();
  const adminClient = createAdminClient();

  const { data: userProfile } = await adminClient
    .from("profiles")
    .select("fireflies")
    .eq("id", targetUserId)
    .single();

  const newFireflies = Math.max(0, (userProfile?.fireflies || 0) + amount);

  const { error } = await adminClient
    .from("profiles")
    .update({ fireflies: newFireflies })
    .eq("id", targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true, newFireflies };
}

export async function resetStudentRecoveryCode({
  studentId,
}: {
  studentId: string;
}) {
  await verifyAdminCaller();
  const adminClient = createAdminClient();

  const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  const { error } = await adminClient
    .from("profiles")
    .update({ recovery_code_hash: newCode, must_change_password: false })
    .eq("id", studentId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true, newCode };
}

export async function adminUpdateUserPassword({
  targetUserId,
  newPassword,
}: {
  targetUserId: string;
  newPassword: string;
}) {
  await verifyAdminCaller();
  if (!newPassword || newPassword.length < 6) {
    return { error: "Mật khẩu mới tối thiểu 6 ký tự" };
  }

  const adminClient = createAdminClient();

  // Cập nhật mật khẩu trong Supabase Auth đồng thời lưu managed_password vào metadata để admin quản trị
  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    password: newPassword,
    user_metadata: {
      managed_password: newPassword,
      last_password_reset_at: new Date().toISOString(),
    },
  });

  if (error) {
    return { error: error.message || "Không thể cập nhật mật khẩu người dùng" };
  }

  revalidatePath("/admin");
  return { success: true, password: newPassword };
}
