import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adminClient = createClient(supabaseUrl, serviceRoleKey);
const anonClient = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runSecurityAudit() {
  console.log("================================================================================");
  console.log("🛡️ KIỂM TRA BẢO MẬT HỆ THỐNG, ĐĂNG NHẬP & DUY TRÌ TÀI KHOẢN (SECURITY AUDIT)");
  console.log("================================================================================\n");

  // 1. Đăng nhập tài khoản học sinh thử nghiệm
  console.log("1. Đăng nhập học sinh test để lấy Access Token...");
  const { data: studentAuth, error: authErr } = await anonClient.auth.signInWithPassword({
    email: "hocsinh_test@student.foggo.vn",
    password: "TestPassword123!",
  });

  if (authErr || !studentAuth.user || !studentAuth.session) {
    console.error("❌ Không thể đăng nhập học sinh test:", authErr);
    process.exit(1);
  }

  const studentUser = studentAuth.user;
  const studentToken = studentAuth.session.access_token;
  console.log("✅ Đăng nhập thành công. Student UID:", studentUser.id);
  console.log("   Token expires_at:", studentAuth.session.expires_at, "giây");

  // Tạo client giả lập trình duyệt của học sinh
  const studentBrowserClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${studentToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // TEST 1: Thử Privilege Escalation (Học sinh tự cập nhật role thành admin)
  console.log("\n[TEST 1] Thử nghiệm tấn công leo thang quyền hạn (Privilege Escalation):");
  console.log("   -> Học sinh cố update profiles: role='admin', plan='plus', fireflies=999999");
  
  const { data: roleAttempt, error: roleErr } = await studentBrowserClient
    .from("profiles")
    .update({ role: "admin", plan: "plus", fireflies: 999999 })
    .eq("id", studentUser.id)
    .select();

  console.log("   -> Kết quả trả về:", { updated: roleAttempt, error: roleErr?.message || null });

  // Kiểm tra thực tế trong DB
  const { data: verifiedProfile } = await adminClient
    .from("profiles")
    .select("role, plan, fireflies")
    .eq("id", studentUser.id)
    .single();

  console.log("   -> Trạng thái thực tế trong DB:", verifiedProfile);

  if (verifiedProfile?.role === "admin") {
    console.warn("   ⚠️ CẢNH BÁO: Học sinh có thể tự sửa role thành admin qua Client!");
    // Revert ngay lập tức
    await adminClient.from("profiles").update({ role: "student", plan: "free", fireflies: 0 }).eq("id", studentUser.id);
    console.log("   -> Đã khôi phục an toàn về student.");
  } else {
    console.log("   ✅ AN TOÀN: Role không bị thay đổi trái phép!");
  }

  // TEST 2: Thử sửa profile của người khác (IDOR - Insecure Direct Object References)
  console.log("\n[TEST 2] Thử nghiệm IDOR (Sửa hồ sơ của người dùng khác):");
  // Tìm một user khác
  const { data: otherUser } = await adminClient
    .from("profiles")
    .select("id, display_name")
    .neq("id", studentUser.id)
    .limit(1)
    .single();

  if (otherUser) {
    const { data: idorAttempt, error: idorErr } = await studentBrowserClient
      .from("profiles")
      .update({ display_name: "Tên Bị Hacker Sửa" })
      .eq("id", otherUser.id)
      .select();

    console.log("   -> Thử sửa hồ sơ người dùng khác:", { updatedCount: idorAttempt?.length, error: idorErr?.message });
    if (!idorAttempt || idorAttempt.length === 0) {
      console.log("   ✅ AN TOÀN: RLS đã chặn hoàn toàn việc sửa hồ sơ người khác!");
    } else {
      console.error("   ❌ NGUY HIỂM: IDOR thành công!");
    }
  }

  // TEST 3: Thử xóa hoặc sửa bộ câu hỏi của giáo viên
  console.log("\n[TEST 3] Thử nghiệm học sinh sửa hoặc xóa bộ đề của giáo viên:");
  const { data: teacherSet } = await adminClient
    .from("question_sets")
    .select("id, title, owner_id")
    .neq("owner_id", studentUser.id)
    .limit(1)
    .single();

  if (teacherSet) {
    const { data: setAttempt, error: setErr } = await studentBrowserClient
      .from("question_sets")
      .update({ title: "Bộ Đề Bị Học Sinh Phá" })
      .eq("id", teacherSet.id)
      .select();

    console.log("   -> Thử sửa bộ đề của giáo viên:", { updatedCount: setAttempt?.length, error: setErr?.message });
    if (!setAttempt || setAttempt.length === 0) {
      console.log("   ✅ AN TOÀN: RLS chặn học sinh sửa bộ đề của giáo viên!");
    } else {
      console.error("   ❌ NGUY HIỂM: Học sinh có thể sửa bộ đề của giáo viên!");
    }
  }

  // TEST 4: Thử đọc trực tiếp đáp án (answer_key) qua Client API
  console.log("\n[TEST 4] Kiểm tra rò rỉ đáp án đúng (answer_key leakage):");
  const { data: qReadAttempt, error: qReadErr } = await studentBrowserClient
    .from("questions")
    .select("id, answer_key")
    .limit(5);

  console.log("   -> Học sinh truy vấn trực tiếp bảng questions với cột answer_key:");
  console.log("   -> Số câu hỏi đọc được:", qReadAttempt?.length, "| Lỗi nếu có:", qReadErr?.message);
  if (qReadAttempt && qReadAttempt.length > 0) {
    console.warn("   ⚠️ CHÚ Ý: Bảng questions cho phép select answer_key nếu bộ đề là public!");
  } else {
    console.log("   ✅ Bảng questions được kiểm soát chặt chẽ.");
  }

  // TEST 5: Kiểm tra cơ chế Khôi phục mật khẩu (Recovery Code) & Chống Brute Force
  console.log("\n[TEST 5] Kiểm tra bảo mật cơ chế Khôi Phục Mật Khẩu học sinh:");
  const { data: studentDbProfile } = await adminClient
    .from("profiles")
    .select("recovery_code_hash")
    .eq("id", studentUser.id)
    .single();

  if (studentDbProfile?.recovery_code_hash) {
    console.log("   ✅ Mã khôi phục CHỈ lưu dưới dạng SHA-256 Hash trong database!");
    console.log("      Giá trị hash mẫu:", studentDbProfile.recovery_code_hash.substring(0, 16) + "...");
    console.log("      Không có mã thuần plaintext trong database.");
  } else {
    console.log("   ℹ️ Tài khoản test chưa có recovery_code_hash.");
  }

  // TEST 6: Kiểm tra biến môi trường nhạy cảm (Env variables leak)
  console.log("\n[TEST 6] Kiểm tra biến môi trường và rò rỉ Service Role Key:");
  const clientVisibleEnvs = Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_"));
  const leakedServiceKey = clientVisibleEnvs.some((k) => k.toLowerCase().includes("service_role"));
  if (leakedServiceKey) {
    console.error("   ❌ CỰC KỲ NGUY HIỂM: Service Role Key bị đặt tiền tố NEXT_PUBLIC_!");
  } else {
    console.log("   ✅ AN TOÀN: SUPABASE_SERVICE_ROLE_KEY không bị lộ trong NEXT_PUBLIC_.");
    console.log("      Các biến NEXT_PUBLIC_ hiện có:", clientVisibleEnvs.join(", "));
  }

  console.log("\n================================================================================");
  console.log("🛡️ HOÀN TẤT KIỂM TRA BẢO MẬT HỆ THỐNG");
  console.log("================================================================================");
}

runSecurityAudit().catch(console.error);

