import { requireUser } from "@/lib/auth";
import { NewQuestionSetClient } from "./NewQuestionSetClient";

export const dynamic = "force-dynamic";

export default async function NewQuestionSetPage() {
  const { profile } = await requireUser(["teacher", "admin"]);

  return <NewQuestionSetClient profile={profile} />;
}
