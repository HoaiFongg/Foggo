import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatencyMs = 0;

  try {
    const supabase = await createClient();
    const dbStart = Date.now();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    dbLatencyMs = Date.now() - dbStart;

    if (error) {
      dbStatus = `degraded: ${error.message}`;
    }
  } catch (err: any) {
    dbStatus = `unreachable: ${err?.message || "Unknown error"}`;
  }

  const isHealthy = !dbStatus.startsWith("degraded") && !dbStatus.startsWith("unreachable");

  return NextResponse.json(
    {
      status: isHealthy ? "ok" : "warning",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      version: process.env.npm_package_version || "1.0.0",
      services: {
        server: "healthy",
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
      responseTimeMs: Date.now() - startTime,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
