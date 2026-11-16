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
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      userPlan = profile.plan;
      planExpiresAt = profile.plan_expires_at;
    }

    return (
      <PricingClient
        profile={profile}
        isLoggedIn={!!user}
        currentPlan={userPlan}
        planExpiresAt={planExpiresAt}
      />
    );
  }

  return (
    <PricingClient
      profile={null}
      isLoggedIn={false}
      currentPlan="free"
      planExpiresAt={null}
    />
  );
}

