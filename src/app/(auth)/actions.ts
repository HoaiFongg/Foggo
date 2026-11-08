"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toInternalEmail } from "@/lib/auth/internal-email";

const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  role: z.enum(["student", "teacher"]),
  displayName: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự").optional(),
});

export async function register(formData: FormData) {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    displayName: formData.get("displayName") || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        role: parsed.data.role,
        display_name: parsed.data.displayName || "Người chơi mới",
        auth_type: "email",
      },
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message || "Không thể đăng ký tài khoản" };
  }

  redirect("/verify-email");
}

export async function login(formData: FormData) {
  const account = String(formData.get("account") || formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/dashboard");

  if (!account || !password) {
    return { error: "Vui lòng nhập tài khoản và mật khẩu" };
  }

  // Nếu người dùng nhập username (không có @), chuyển sang email nội bộ
  const email = account.includes("@") ? account : toInternalEmail(account);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Tên đăng nhập hoặc mật khẩu không chính xác" };
  }

  redirect(nextPath);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

