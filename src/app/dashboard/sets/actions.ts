"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import type { QuestionType } from "@/types/database";

export async function createQuestionSet(formData: FormData) {
  const { user } = await requireUser(["teacher", "admin"]);
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const gradeLevel = String(formData.get("gradeLevel") || "").trim();
  const visibility = (String(formData.get("visibility") || "private")) as "private" | "unlisted" | "public";

  if (!title) {
    return { error: "Vui lòng nhập tiêu đề cho bộ câu hỏi" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("question_sets")
    .insert({
      owner_id: user.id,
      title,
      description: description || null,
      subject: subject || null,
      grade_level: gradeLevel || null,
      visibility,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message || "Không thể tạo bộ câu hỏi" };
  }

  // Tự động tạo câu hỏi mặc định đầu tiên
  await supabase.from("questions").insert({
    set_id: data.id,
    position: 0,
    type: "single_choice",
    content: {
      prompt: "Câu hỏi đầu tiên của bạn là gì?",
      image_url: null,
      options: [
        { id: "opt_1", text: "Lựa chọn 1 (Đúng)" },
        { id: "opt_2", text: "Lựa chọn 2" },
        { id: "opt_3", text: "Lựa chọn 3" },
        { id: "opt_4", text: "Lựa chọn 4" },
      ],
    },
    answer_key: {
      correct: "opt_1",
    },
    time_limit_sec: 20,
    points: 1000,
  });

  revalidatePath("/dashboard/sets");
  redirect(`/dashboard/sets/${data.id}/edit`);
}

export async function deleteQuestionSet(id: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("question_sets").delete().eq("id", id);
  if (!isAdmin) {
    query = query.eq("owner_id", user.id);
  }

  const { error } = await query;

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/sets");
  return { success: true };
}

export async function saveQuestionSetDetails(
  id: string,
  details: {
    title: string;
    description?: string;
    subject?: string;
    grade_level?: string;
    visibility?: "private" | "unlisted" | "public";
  }
) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase
    .from("question_sets")
    .update({
      title: details.title,
      description: details.description || null,
      subject: details.subject || null,
      grade_level: details.grade_level || null,
      visibility: details.visibility || "private",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (!isAdmin) {
    query = query.eq("owner_id", user.id);
  }

  const { error } = await query;

  if (error) return { error: error.message };
  revalidatePath("/dashboard/sets");
  return { success: true };
}

export async function saveQuestionsBatch(
  setId: string,
  questions: Array<{
    id?: string;
    position: number;
    type: QuestionType;
    content: any;
    answer_key: any;
    time_limit_sec: number;
    points: number;
    explanation?: string;
  }>
) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  // Kiểm tra quyền sở hữu bộ câu hỏi (hoặc quyền Admin)
  let checkQuery = supabase.from("question_sets").select("id").eq("id", setId);
  if (!isAdmin) {
    checkQuery = checkQuery.eq("owner_id", user.id);
  }
  const { data: set } = await checkQuery.single();

  if (!set) {
    return { error: "Bạn không có quyền chỉnh sửa bộ câu hỏi này" };
  }

  // Xóa các câu hỏi cũ của set này và insert lại danh sách mới để đảm bảo thứ tự
  await supabase.from("questions").delete().eq("set_id", setId);

  const rows = questions.map((q, idx) => ({
    set_id: setId,
    position: idx,
    type: q.type,
    content: q.content,
    answer_key: q.answer_key,
    time_limit_sec: q.time_limit_sec || 20,
    points: q.points || 1000,
    explanation: q.explanation || null,
  }));

  if (rows.length > 0) {
    const { error } = await supabase.from("questions").insert(rows);
    if (error) return { error: error.message };
  }

  revalidatePath(`/dashboard/sets/${setId}/edit`);
  revalidatePath("/dashboard/sets");
  return { success: true };
}
