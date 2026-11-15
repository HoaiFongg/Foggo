import { createAdminClient } from "../src/lib/supabase/admin";
import * as fs from "fs";
import * as path from "path";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim();
      }
    }
  }
}

async function repair() {
  loadEnv();
  const admin = createAdminClient();
  const { data: players, error } = await admin
    .from("session_players")
    .select("id, user_id, nickname, state, hp, score, gold");

  if (error) {
    console.error("Error fetching players:", error);
    return;
  }

  const nowSec = Math.floor(Date.now() / 1000);
  console.log(`Checking ${players?.length} players...`);

  for (const p of players || []) {
    const state = p.state || {};
    const playSec = state.playSec || 0;
    const isCorrupted = playSec > 480 || (state.hp !== undefined && state.hp <= 0);

    if (isCorrupted) {
      console.log(`Fixing corrupted player: ${p.nickname} (playSec: ${playSec}, hp: ${state.hp})...`);
      const fixedState = {
        ...state,
        playSec: Math.min(playSec, 120), // Reset to Day 1 (120s)
        lastTickTimestamp: nowSec,
        hp: Math.max(state.hp || 0, 100), // Restore HP to 100
        hunger: Math.max(state.hunger || 0, 100), // Restore hunger to 100
      };

      const { error: updateErr } = await admin
        .from("session_players")
        .update({
          hp: 100,
          max_hp: 100,
          state: fixedState,
          updated_at: new Date().toISOString(),
        })
        .eq("id", p.id);

      if (updateErr) {
        console.error(`Failed to update player ${p.id}:`, updateErr);
      } else {
        console.log(`✅ Successfully repaired ${p.nickname} (playSec reset to ${fixedState.playSec}, HP restored to 100).`);
      }
    }
  }

  console.log("Repair completed!");
}

repair();
