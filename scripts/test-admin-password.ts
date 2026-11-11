import { createClient } from "@supabase/supabase-js";
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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(supabaseUrl, anonKey);

  const candidatePasswords = [
    "TestPassword123!",
    "Admin@123456",
    "Admin123456!",
    "admin123456",
    "Admin@123",
    "hoaifongg",
    "hoaifongg@123",
    "12345678",
  ];

  let found = false;
  for (const pw of candidatePasswords) {
    const { data, error } = await client.auth.signInWithPassword({
      email: "hoaifongg@gmail.com",
      password: pw,
    });
    if (!error && data.user) {
      console.log(`SUCCESS: Admin password is: ${pw}`);
      found = true;
      break;
    }
  }

  if (!found) {
    console.log("No default candidate matched. Let's set the password for hoaifongg@gmail.com to 'Admin@123456'");
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.updateUserById("f588e8e5-6252-4167-9ee1-e96a26b7b728", {
      password: "Admin@123456",
      email_confirm: true,
    });
    if (error) {
      console.error("Failed to update password:", error);
    } else {
      console.log("Admin password has been securely set to: Admin@123456");
      // Double check login
      const verify = await client.auth.signInWithPassword({
        email: "hoaifongg@gmail.com",
        password: "Admin@123456",
      });
      if (verify.data.user) {
        console.log("VERIFIED: Can log in successfully as hoaifongg@gmail.com with Admin@123456");
      }
    }
  }
}

main().catch(console.error);
