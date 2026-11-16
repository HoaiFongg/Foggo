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
    message: `Điểm danh Ngày ${nextDay} thành công! Bạn nhận được ${reward.coins} Vàng 🪙 và ${reward.fireflies} Điểm Thành Tích 🏆!`,
  };
}

/**
 * Đổi tên hiển thị nhân vật của học sinh
 */
export async function updateStudentDisplayName(newDisplayName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn" };
  }

  const trimmed = newDisplayName.trim();
  if (trimmed.length < 2 || trimmed.length > 40) {
    return { error: "Tên hiển thị phải từ 2 đến 40 ký tự" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ display_name: trimmed })
    .eq("id", user.id);

  if (error) {
    return { error: error.message || "Không thể cập nhật tên" };
  }

  await adminClient.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      display_name: trimmed,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, displayName: trimmed };
}

/**
 * Cập nhật trường học và lớp học của học sinh để kết nối bạn bè cùng trường cùng lớp
 */
export async function updateStudentSchoolClass({
  schoolName,
  province,
  className,
}: {
  schoolName: string;
  province: string;
  className: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn" };
  }

  const adminClient = createAdminClient();
  let schoolId: string | null = null;
  let classId: string | null = null;

  if (schoolName.trim() && province.trim()) {
    const { data: school } = await adminClient
      .from("schools")
      .select("id")
      .ilike("name", schoolName.trim())
      .eq("province", province.trim())
      .maybeSingle();

    if (school) {
      schoolId = school.id;
    } else {
      const { data: newSchool } = await adminClient
        .from("schools")
        .insert({
          name: schoolName.trim(),
          province: province.trim(),
          status: "pending",
        })
        .select("id")
        .single();
      schoolId = newSchool?.id || null;
    }

    if (schoolId && className.trim()) {
      const currentYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
      const { data: classRoom } = await adminClient
        .from("classes")
        .select("id")
        .eq("school_id", schoolId)
        .ilike("name", className.trim())
        .eq("school_year", currentYear)
        .maybeSingle();

      if (classRoom) {
        classId = classRoom.id;
      } else {
        const { data: newClass } = await adminClient
          .from("classes")
          .insert({
            name: className.trim(),
            school_id: schoolId,
            school_year: currentYear,
          })
          .select("id")
          .single();
        classId = newClass?.id || null;
      }
    }
  }

  const { error } = await adminClient
    .from("profiles")
    .update({
      school_id: schoolId,
      class_id: classId,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message || "Không thể cập nhật trường lớp" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Đổi mật khẩu tài khoản người dùng đang đăng nhập
 */
export async function updateOwnPassword(newPassword: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn" };
  }

  const trimmed = newPassword.trim();
  if (trimmed.length < 6) {
    return { error: "Mật khẩu mới tối thiểu 6 ký tự" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(user.id, {
    password: trimmed,
    user_metadata: {
      ...user.user_metadata,
      managed_password: trimmed,
      last_password_reset_at: new Date().toISOString(),
    },
  });

  if (error) {
    return { error: error.message || "Không thể cập nhật mật khẩu" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Lấy thông tin bảo mật & mã khôi phục của tài khoản
 */
export async function getStudentAccountSecurity() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn" };
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("profiles")
    .select("username, display_name, role, recovery_code_hash, created_at, schools:school_id(name), classes:class_id(name)")
    .eq("id", user.id)
    .single();

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      username: profile?.username || user.user_metadata?.username,
      displayName: profile?.display_name || user.user_metadata?.display_name,
      role: profile?.role || "student",
      recoveryCode: profile?.recovery_code_hash,
      schoolName: (profile as any)?.schools?.name || "",
      className: (profile as any)?.classes?.name || "",
      createdAt: profile?.created_at,
    },
  };
}


