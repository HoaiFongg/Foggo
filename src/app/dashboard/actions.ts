"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addItemToInventory } from "@/game-modes/survival/engine";
import { DAILY_REWARDS_CONFIG } from "@/lib/daily-rewards-config";

/**
 * Nhận thưởng điểm danh đăng nhập 7 ngày liên tiếp
 */
export async function claimDailyLoginReward() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn" };
  }

  // Ngày hiện tại theo múi giờ VN (GMT+7)
  const todayStr = new Date(Date.now() + 7 * 3600 * 1000).toISOString().split("T")[0];

  const currentStreakData = user.user_metadata?.daily_streak || {
    streakCount: 0,
    lastClaimDate: null,
    claimedDays: [],
  };

  const { lastClaimDate, streakCount = 0, claimedDays = [] } = currentStreakData;

  // Kiểm tra nếu đã nhận hôm nay
  if (lastClaimDate === todayStr) {
    return { error: "Hôm nay bạn đã nhận thưởng rồi! Hãy quay lại vào ngày mai nhé." };
  }

  // Tính số ngày chênh lệch
  let nextDay = 1;
  let nextClaimedDays: number[] = [];

  if (lastClaimDate) {
    const lastDate = new Date(lastClaimDate);
    const currDate = new Date(todayStr);
    const diffTime = currDate.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays === 1) {
      // Đăng nhập liên tiếp ngày tiếp theo
      nextDay = (streakCount % 7) + 1;
      nextClaimedDays = [...claimedDays, nextDay];
      if (nextDay === 1) {
        nextClaimedDays = [1]; // Bắt đầu tuần mới
      }
    } else {
      // Bị gián đoạn > 1 ngày -> bắt đầu lại ngày 1
      nextDay = 1;
      nextClaimedDays = [1];
    }
  } else {
    // Lần đầu điểm danh
    nextDay = 1;
    nextClaimedDays = [1];
  }

  const reward = DAILY_REWARDS_CONFIG.find((r) => r.day === nextDay) || DAILY_REWARDS_CONFIG[0];

  const adminClient = createAdminClient();

  // 1. Tặng Đom Đóm (fireflies) vào profile
  const { data: profile } = await adminClient
    .from("profiles")
    .select("fireflies")
    .eq("id", user.id)
    .single();

  const currentFireflies = profile?.fireflies || 0;
  await adminClient
    .from("profiles")
    .update({ fireflies: currentFireflies + reward.fireflies })
    .eq("id", user.id);

  // 2. Tặng Vàng & Vật phẩm vào phiên chơi solo gần nhất (nếu có)
  const { data: recentPlayer } = await adminClient
    .from("session_players")
    .select("id, gold, state")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recentPlayer) {
    let state = recentPlayer.state || {};
    let inventory = state.inventory || [];

    if (reward.items && reward.items.length > 0) {
      for (const it of reward.items) {
        const added = addItemToInventory(inventory, it.itemId, it.qty);
        inventory = added.inventory;
      }
      state.inventory = inventory;
    }

    await adminClient
      .from("session_players")
      .update({
        gold: (recentPlayer.gold || 0) + reward.coins,
        state,
        updated_at: new Date().toISOString(),
      })
      .eq("id", recentPlayer.id);
  }

  // 3. Cập nhật user_metadata
  const updatedStreakData = {
    streakCount: nextDay,
    lastClaimDate: todayStr,
    claimedDays: nextClaimedDays,
  };

  await adminClient.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      daily_streak: updatedStreakData,
    },
  });

  revalidatePath("/dashboard");

  return {
    success: true,
    day: nextDay,
    reward,
    streakData: updatedStreakData,
    message: `Điểm danh Ngày ${nextDay} thành công! Bạn nhận được ${reward.coins} Vàng 🪙 và ${reward.fireflies} Đom Đóm 🪲!`,
  };
}

