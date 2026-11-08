import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { QuestionSetEditorClient } from "./QuestionSetEditorClient";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionSetPage({ params }: EditPageProps) {
  const { id } = await params;
  const { user } = await requireUser(["teacher", "admin"]);
  const supabase = await createClient();

  // Tải thông tin bộ câu hỏi
  const { data: set } = await supabase
    .from("question_sets")
    .select("*")
    .eq("id", id)
    .single();

  if (!set || set.owner_id !== user.id) {
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

