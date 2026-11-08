"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Nhân bản (Duplicate) bộ câu hỏi công khai về thư viện cá nhân
 */
export async function duplicateQuestionSet(setId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để sao chép bộ câu hỏi này" };
  }

  // 1. Tải bộ câu hỏi gốc
  const { data: originalSet } = await supabase
    .from("question_sets")
    .select("*, questions(*)")
    .eq("id", setId)
    .single();

  if (!originalSet) {
    return { error: "Không tìm thấy bộ câu hỏi nguồn" };
  }

  // 2. Tạo bản sao bộ câu hỏi mới cho user
  const { data: newSet, error: setError } = await supabase
    .from("question_sets")
    .insert({
      title: `${originalSet.title} (Bản sao)`,
      description: originalSet.description,
      subject: originalSet.subject,
      grade: originalSet.grade,
      visibility: "private",
      created_by: user.id,
    })
    .select()
    .single();

  if (setError || !newSet) {
    return { error: setError?.message || "Không thể tạo bản sao" };
  }

  // 3. Sao chép toàn bộ câu hỏi con
  const questions = originalSet.questions || [];
  if (questions.length > 0) {
    const questionInserts = questions.map((q: any) => ({
      set_id: newSet.id,
      position: q.position,
      type: q.type,
      content: q.content,
      answer_key: q.answer_key,
      time_limit_sec: q.time_limit_sec,
      points: q.points,
      explanation: q.explanation,
    }));

    await supabase.from("questions").insert(questionInserts);
  }

  revalidatePath("/dashboard/sets");
  return { success: true, newSetId: newSet.id };
}
