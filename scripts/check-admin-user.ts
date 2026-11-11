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

async function main() {
  loadEnv();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }
  console.log("=== SUPABASE USERS ===");
  for (const u of data.users) {
    console.log(`- Email: ${u.email} | ID: ${u.id} | Metadata:`, u.user_metadata, "AppMetadata:", u.app_metadata);
  }
}

main().catch(console.error);
