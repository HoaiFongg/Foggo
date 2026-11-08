import { createClient } from "@/lib/supabase/server";
import { PricingClient } from "./PricingClient";

export default async function PricingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userPlan: "free" | "plus" = "free";
  let planExpiresAt: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, plan_expires_at")
      .eq("id", user.id)
      .single();

    if (profile) {
      userPlan = profile.plan;
      planExpiresAt = profile.plan_expires_at;
    }
  }

  return (
    <PricingClient
      isLoggedIn={!!user}
      currentPlan={userPlan}
      planExpiresAt={planExpiresAt}
    />
  );
}
