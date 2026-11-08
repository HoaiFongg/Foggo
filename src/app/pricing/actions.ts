"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Nâng cấp tài khoản lên gói Plus (Mô phỏng cổng thanh toán PayOS / QR)
 */
export async function upgradeToPlus({
  cycle,
}: {
  cycle: "monthly" | "yearly";
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để nâng cấp gói" };
  }

  const daysToAdd = cycle === "yearly" ? 365 : 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + daysToAdd);

  // 1. Cập nhật profile lên Plus
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      plan: "plus",
      plan_expires_at: expiresAt.toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: profileError.message };
  }

  // 2. Lưu vào bảng subscriptions
  await supabase.from("subscriptions").insert({
    user_id: user.id,
    plan: "plus",
    status: "active",
    expires_at: expiresAt.toISOString(),
  });

  revalidatePath("/pricing");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/subscription");

  return {
    success: true,
    expiresAt: expiresAt.toISOString(),
  };
}
