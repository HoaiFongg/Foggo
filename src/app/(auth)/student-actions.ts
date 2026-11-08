"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { toInternalEmail } from "@/lib/auth/internal-email";
import { generateRecoveryCode, hashRecovery, verifyRecovery } from "@/lib/auth/recovery";

const RESERVED = ["admin", "root", "support", "moderator", "system", "teacher", "giaovien", "foggo"];

const studentRegisterSchema = z.object({
  username: z
    .string()
    .toLowerCase()
    .regex(/^[a-z0-9_]{3,20}$/, "Tên đăng nhập 3–20 ký tự (chữ thường, số, dấu gạch dưới)"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(72),
  displayName: z.string().trim().min(2, "Tên hiển thị tối thiểu 2 ký tự").max(30),
  schoolName: z.string().trim().min(3, "Tên trường tối thiểu 3 ký tự").optional(),
  province: z.string().trim().optional(),
  className: z.string().trim().max(10).optional(),
});

export async function registerStudent(input: {
  username: string;
  password: string;
  displayName: string;
  schoolName?: string;
  province?: string;
  className?: string;
}) {
  const parsed = studentRegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Thông tin không hợp lệ" };
  }

  const { username, password, displayName, schoolName, province, className } = parsed.data;

  if (RESERVED.some((w) => username.includes(w))) {
    return { error: "Tên đăng nhập không được chứa các từ khóa hệ thống" };
  }
  if (password.toLowerCase().includes(username)) {
    return { error: "Mật khẩu không được chứa tên đăng nhập để đảm bảo an toàn" };
  }

  const admin = createAdminClient();

  // 1. Kiểm tra username đã tồn tại chưa
  const { data: existed } = await admin
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();

  if (existed) {
    return { error: "Tên đăng nhập này đã được sử dụng, vui lòng chọn tên khác" };
  }

  // 2. Xử lý trường và lớp nếu có
  let schoolId: string | null = null;
  let classId: string | null = null;

  if (schoolName && province) {
    const { data: school } = await admin
      .from("schools")
      .select("id")
      .ilike("name", schoolName)
      .eq("province", province)
      .maybeSingle();

    if (school) {
      schoolId = school.id;
    } else {
      const { data: newSchool } = await admin
        .from("schools")
        .insert({
          name: schoolName,
          province,
          status: "pending",
        })
        .select("id")
        .single();
      schoolId = newSchool?.id || null;
    }

    if (schoolId && className) {
      const currentYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
      const { data: classRoom } = await admin
        .from("classes")
        .select("id")
        .eq("school_id", schoolId)
        .ilike("name", className)
        .eq("school_year", currentYear)
        .maybeSingle();

      if (classRoom) {
        classId = classRoom.id;
      } else {
        const { data: newClass } = await admin
          .from("classes")
          .insert({
            school_id: schoolId,
            name: className,
            school_year: currentYear,
          })
          .select("id")
          .single();
        classId = newClass?.id || null;
      }
    }
  }

  // 3. Tạo tài khoản auth.users qua Admin API (email nội bộ, email_confirm = true)
  const internalEmail = toInternalEmail(username);
  const { data: authData, error: createError } = await admin.auth.admin.createUser({
    email: internalEmail,
    password,
    email_confirm: true,
    user_metadata: {
      username,
      display_name: displayName,
      auth_type: "username",
      role: "student",
    },
  });

  if (createError || !authData.user) {
    if (createError?.message?.includes("Bearer") || createError?.message?.includes("token")) {
      return {
        error: "Chức năng đăng ký học sinh không cần email yêu cầu SUPABASE_SERVICE_ROLE_KEY (secret key) trong .env.local. Vui lòng lấy mã service_role trong Supabase Dashboard > Project Settings > API.",
      };
    }
    return { error: createError?.message || "Không thể khởi tạo tài khoản" };
  }

  // 4. Sinh mã phục hồi và cập nhật profile
  const recoveryCode = generateRecoveryCode();
  const recoveryHash = hashRecovery(recoveryCode);

  await admin
    .from("profiles")
    .update({
      username,
      school_id: schoolId,
      class_id: classId,
      recovery_code_hash: recoveryHash,
    })
    .eq("id", authData.user.id);

  // 5. Nếu có classId, ghi nhận vào class_members
  if (classId) {
    await admin.from("class_members").insert({
      class_id: classId,
      student_id: authData.user.id,
      status: "pending",
      joined_via: "self",
    });
  }

  // 6. Tự động đăng nhập
  const supabase = await createClient();
  await supabase.auth.signInWithPassword({
    email: internalEmail,
    password,
  });

  return { ok: true, recoveryCode };
}

export async function resetWithRecovery(username: string, code: string, newPassword: string) {
  if (newPassword.length < 8) {
    return { error: "Mật khẩu mới phải có ít nhất 8 ký tự" };
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, recovery_code_hash")
    .ilike("username", username)
    .maybeSingle();

  const FAIL = { error: "Tên đăng nhập hoặc mã khôi phục không đúng" };

  if (!profile || !profile.recovery_code_hash) {
    return FAIL;
  }

  const isValid = verifyRecovery(code, profile.recovery_code_hash);
  if (!isValid) {
    return FAIL;
  }

  // Cập nhật mật khẩu mới cho user
  const { error } = await admin.auth.admin.updateUserById(profile.id, {
    password: newPassword,
  });

  if (error) {
    return { error: "Không thể đổi mật khẩu, vui lòng thử lại" };
  }

  // Tạo mã phục hồi mới và lưu lại
  const newRecoveryCode = generateRecoveryCode();
  await admin
    .from("profiles")
    .update({
      recovery_code_hash: hashRecovery(newRecoveryCode),
      must_change_password: false,
    })
    .eq("id", profile.id);

  return { ok: true, newRecoveryCode };
}

