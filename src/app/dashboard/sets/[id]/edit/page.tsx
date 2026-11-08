import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { QuestionSetEditorClient } from "./QuestionSetEditorClient";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionSetPage({ params }: EditPageProps) {
  const { id } = await params;
  const { user, profile } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();
  const isAdmin = profile.role === "admin";

  // Tải thông tin bộ câu hỏi
  let query = supabase.from("question_sets").select("*").eq("id", id);
  if (!isAdmin) {
    query = query.eq("owner_id", user.id);
  }
  const { data: set } = await query.single();

  if (!set) {
    notFound();
  }

  // Tải danh sách câu hỏi thuộc bộ này
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("set_id", id)
    .order("position", { ascending: true });

  const initialQuestions = (questions || []).map((q) => ({
    id: q.id,
    position: q.position,
    type: q.type,
    content: q.content,
    answer_key: q.answer_key,
    time_limit_sec: q.time_limit_sec,
    points: q.points,
    explanation: q.explanation || undefined,
  }));

  return (
    <QuestionSetEditorClient
      setId={set.id}
      initialTitle={set.title}
      initialQuestions={initialQuestions}
    />
  );
}
