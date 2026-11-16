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

export async function softDeleteQuestionSet(id: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("question_sets").select("id, title, description, visibility, owner_id").eq("id", id);
  if (!isAdmin) {
    query = query.eq("owner_id", user.id);
  }

  const { data: set, error: fetchErr } = await query.single();
  if (fetchErr || !set) {
    return { error: "Không tìm thấy bộ đề hoặc bạn không có quyền xóa." };
  }

  // Nếu đã bị xóa trước đó thì không làm lại
  if (set.description?.startsWith("[DELETED:")) {
    return { success: true, title: set.title };
  }

  const deletedTag = `[DELETED:${Date.now()}:${set.visibility || "private"}]`;
  const cleanOriginalDesc = set.description ? set.description.trim() : "";
  const newDescription = cleanOriginalDesc ? `${deletedTag} ${cleanOriginalDesc}` : deletedTag;

  const { error: updateErr } = await supabase
    .from("question_sets")
    .update({
      description: newDescription,
      visibility: "private",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateErr) {
    return { error: updateErr.message };
  }

  revalidatePath("/dashboard/sets");
  return { success: true, title: set.title };
}

export async function deleteQuestionSet(id: string) {
  // Mặc định chuyển vào Thùng rác để an toàn, tránh lỗi Foreign Key và hỗ trợ Hoàn tác
  return softDeleteQuestionSet(id);
}

export async function restoreQuestionSet(id: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("question_sets").select("id, title, description, owner_id").eq("id", id);
  if (!isAdmin) {
    query = query.eq("owner_id", user.id);
  }

  const { data: set, error: fetchErr } = await query.single();
  if (fetchErr || !set) {
    return { error: "Không tìm thấy bộ đề cần hoàn tác." };
  }

  const rawDesc = set.description || "";
  let originalVisibility: "private" | "unlisted" | "public" = "private";
  let restoredDesc: string | null = null;

  const match = rawDesc.match(/^\[DELETED:(\d+):([a-z]+)\]\s*([\s\S]*)$/);
  if (match) {
    const parsedVis = match[2];
    if (parsedVis === "public" || parsedVis === "unlisted" || parsedVis === "private") {
      originalVisibility = parsedVis;
    }
    restoredDesc = match[3]?.trim() || null;
  } else {
    // Fallback nếu có định dạng khác
    const simpleMatch = rawDesc.match(/^\[DELETED:[^\]]+\]\s*([\s\S]*)$/);
    restoredDesc = simpleMatch ? simpleMatch[1]?.trim() || null : rawDesc;
  }

  const { error: updateErr } = await supabase
    .from("question_sets")
    .update({
      description: restoredDesc,
      visibility: originalVisibility,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateErr) {
    return { error: updateErr.message };
  }

  revalidatePath("/dashboard/sets");
  return { success: true, title: set.title };
}

export async function permanentDeleteQuestionSet(id: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  // Kiểm tra quyền
  let checkQuery = supabase.from("question_sets").select("id, title").eq("id", id);
  if (!isAdmin) {
    checkQuery = checkQuery.eq("owner_id", user.id);
  }
  const { data: set, error: checkErr } = await checkQuery.single();
  if (checkErr || !set) {
    return { error: "Không tìm thấy bộ đề hoặc bạn không có quyền xóa vĩnh viễn." };
  }

  // 1. Gỡ liên kết foreign key ở game_sessions để tránh vi phạm ràng buộc RESTRICT
  await supabase.from("game_sessions").update({ set_id: null }).eq("set_id", id);

  // 2. Xóa các câu hỏi thuộc bộ đề này
  await supabase.from("questions").delete().eq("set_id", id);

  // 3. Xóa vĩnh viễn bản ghi question_sets
  const { error: delErr } = await supabase.from("question_sets").delete().eq("id", id);
  if (delErr) {
    return { error: delErr.message };
  }

  revalidatePath("/dashboard/sets");
  return { success: true, title: set.title };
}

export async function emptyTrashQuestionSets() {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("question_sets").select("id").like("description", "[DELETED:%");
  if (!isAdmin) {
    query = query.eq("owner_id", user.id);
  }

  const { data: sets, error } = await query;
  if (error || !sets || sets.length === 0) {
    return { success: true, count: 0 };
  }

  const setIds = sets.map((s) => s.id);

  // 1. Gỡ set_id ở game_sessions
  await supabase.from("game_sessions").update({ set_id: null }).in("set_id", setIds);

  // 2. Xóa câu hỏi
  await supabase.from("questions").delete().in("set_id", setIds);

  // 3. Xóa question_sets
  const { error: delErr } = await supabase.from("question_sets").delete().in("id", setIds);
  if (delErr) {
    return { error: delErr.message };
  }

  revalidatePath("/dashboard/sets");
  return { success: true, count: setIds.length };
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

export async function createQuestionSetFromExcel(data: {
  title: string;
  description?: string;
  subject?: string;
  gradeLevel?: string;
  questions: Array<{
    type: QuestionType;
    content: any;
    answer_key: any;
    time_limit_sec: number;
    points: number;
    explanation?: string;
  }>;
}) {
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  const title = (data.title || "Bộ câu hỏi tải lên từ Excel").trim();
  const { data: set, error: setError } = await supabase
    .from("question_sets")
    .insert({
      owner_id: user.id,
      title,
      description: data.description || "Nhập tự động từ file Excel",
      subject: data.subject || "Tổng hợp",
      grade_level: data.gradeLevel || null,
      visibility: "private",
    })
    .select("id")
    .single();

  if (setError || !set) {
    return { error: setError?.message || "Không thể tạo bộ câu hỏi từ Excel" };
  }

  if (data.questions && data.questions.length > 0) {
    const rows = data.questions.map((q, idx) => ({
      set_id: set.id,
      position: idx,
      type: q.type,
      content: q.content,
      answer_key: q.answer_key,
      time_limit_sec: q.time_limit_sec || 20,
      points: q.points || 1000,
      explanation: q.explanation || null,
    }));

    const { error: qError } = await supabase.from("questions").insert(rows);
    if (qError) {
      return { error: `Đã tạo bộ đề nhưng lỗi khi lưu câu hỏi: ${qError.message}` };
    }
  }

  revalidatePath("/dashboard/sets");
  return { success: true, setId: set.id };
}

export async function getQuestionsForExport(setId: string) {
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  let query = supabase.from("question_sets").select("*").eq("id", setId);
  if (!isAdmin) {
    query = query.or(`owner_id.eq.${user.id},visibility.eq.public`);
  }
  const { data: set, error: setError } = await query.single();
  if (setError || !set) {
    return { error: "Không tìm thấy bộ câu hỏi hoặc bạn không có quyền truy cập" };
  }

  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select("*")
    .eq("set_id", setId)
    .order("position", { ascending: true });

  if (qError) {
    return { error: "Không thể lấy danh sách câu hỏi" };
  }

  return { success: true, set, questions: questions || [] };
}
