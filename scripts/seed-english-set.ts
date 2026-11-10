import fs from "fs";
import path from "path";
import { createAdminClient } from "../src/lib/supabase/admin";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    }
  }
}

async function main() {
  loadEnv();
  const admin = createAdminClient();

  // Find a teacher or admin user ID
  const { data: teachers } = await admin
    .from("profiles")
    .select("id")
    .in("role", ["teacher", "admin"])
    .limit(1);

  if (!teachers || teachers.length === 0) {
    console.error("No teacher profile found!");
    return;
  }

  const ownerId = teachers[0].id;

  // Check if English set already exists
  const { data: existing } = await admin
    .from("question_sets")
    .select("id")
    .eq("language", "en")
    .limit(1);

  let setId = existing?.[0]?.id;

  if (!setId) {
    console.log("Creating new English Question Set...");
    const { data: newSet, error: setErr } = await admin
      .from("question_sets")
      .insert({
        owner_id: ownerId,
        title: "Grade 7 CS & Digital Literacy (English)",
        description: "Official English Question Bank for Foggo Island: Survival IT, Digital Safety, and Tech Ethics.",
        language: "en",
        visibility: "public",
        subject: "Computer Science",
        grade_level: "Grade 7",
      })
      .select("id")
      .single();

    if (setErr) {
      console.error("Error creating set:", setErr);
      return;
    }
    setId = newSet.id;
    console.log("Created English Set ID:", setId);

    // Insert 10 high-quality English questions
    const englishQuestions = [
      {
        set_id: setId,
        position: 1,
        type: "single_choice",
        content: {
          prompt: "Which file format supports transparent backgrounds in logo graphics?",
          options: [
            { id: "opt_1", text: "PDF Document" },
            { id: "opt_2", text: "TIFF Format" },
            { id: "opt_3", text: "JPG / JPEG" },
            { id: "opt_4", text: "PNG (Portable Network Graphics)" }
          ]
        },
        answer_key: { correct: "opt_4" },
        points: 1000
      },
      {
        set_id: setId,
        position: 2,
        type: "multi_select",
        content: {
          prompt: "What changes can you make to on-screen text to make it easier to read for visually impaired readers? (CHOOSE 2)",
          options: [
            { id: "opt_1", text: "Font Style (Serif vs Sans-Serif)" },
            { id: "opt_2", text: "Font Size (Enlarge size)" },
            { id: "opt_3", text: "Flashing colors" },
            { id: "opt_4", text: "High Contrast ratio" }
          ],
          min_select: 1
        },
        answer_key: { correct: ["opt_2", "opt_4"], scoring: "partial" },
        points: 1000
      },
      {
        set_id: setId,
        position: 3,
        type: "single_choice",
        content: {
          prompt: "If a user wants to send an instant message to a colleague whose status is Unavailable, which is the best action?",
          options: [
            { id: "opt_1", text: "Email the colleague with the request." },
            { id: "opt_2", text: "Repeatedly call the colleague's personal phone." },
            { id: "opt_3", text: "Wait until the colleague's status becomes Available." },
            { id: "opt_4", text: "Spam urgent messages anyway." }
          ]
        },
        answer_key: { correct: "opt_3" },
        points: 1000
      },
      {
        set_id: setId,
        position: 4,
        type: "true_false",
        content: {
          prompt: "For each statement regarding webcam security, select True or False.",
          statements: [
            { id: "s1", text: "People should cover their webcams when not in active use." },
            { id: "s2", text: "All webcams have a recording indicator light that cannot be bypassed via malware." },
            { id: "s3", text: "Disabling webcam in operating system settings provides partial protection against unauthorized access." }
          ]
        },
        answer_key: { answers: { s1: true, s2: false, s3: true } },
        points: 1000
      },
      {
        set_id: setId,
        position: 5,
        type: "multi_select",
        content: {
          prompt: "Which two communication methods are asynchronous? (Choose 2)",
          options: [
            { id: "opt_1", text: "Live Video Conference" },
            { id: "opt_2", text: "Sending an Email message" },
            { id: "opt_3", text: "Direct Voice Call" },
            { id: "opt_4", text: "Leaving a forum comment or text message" }
          ],
          min_select: 1
        },
        answer_key: { correct: ["opt_2", "opt_4"], scoring: "partial" },
        points: 1000
      },
      {
        set_id: setId,
        position: 6,
        type: "single_choice",
        content: {
          prompt: "What is the primary benefit of file compression (e.g. ZIP / RAR archives)?",
          options: [
            { id: "opt_1", text: "Permanently encrypts and destroys access" },
            { id: "opt_2", text: "Decreases file size to speed up network transmission" },
            { id: "opt_3", text: "Expands storage requirements" },
            { id: "opt_4", text: "Slows down document reading speed" }
          ]
        },
        answer_key: { correct: "opt_2" },
        points: 1000
      },
      {
        set_id: setId,
        position: 7,
        type: "drag_match",
        content: {
          prompt: "Match each presentation design concept with its definition:",
          pairs: [
            { id: "p1", left: "Animation", right: "Visual movement applied to elements entering or exiting slides" },
            { id: "p2", left: "Transition", right: "Visual effect when advancing from one slide to the next" },
            { id: "p3", left: "Slide Master", right: "Top slide hierarchy that governs theme, colors, and layout" }
          ]
        },
        answer_key: { pairs: { p1: "p1", p2: "p2", p3: "p3" } },
        points: 1000
      },
      {
        set_id: setId,
        position: 8,
        type: "dropdown_list",
        content: {
          prompt: "Regarding Artificial Intelligence (AI) evaluation, which sources should you consult? Choose Yes or No:",
          dropdowns: [
            { id: "d1", label: "Source 1", options: ["Yes", "No"] },
            { id: "d2", label: "Source 2", options: ["Yes", "No"] },
            { id: "d3", label: "Source 3", options: ["Yes", "No"] }
          ],
          passage: "Academic journals and verified experts: {D} <br> Anonymous unverified social media rumor: {D} <br> Official technology documentation: {D}"
        },
        answer_key: { answers: { d1: "Yes", d2: "No", d3: "Yes" } },
        points: 1000
      }
    ];

    const { error: insErr } = await admin.from("questions").insert(englishQuestions);
    if (insErr) {
      console.error("Error inserting English questions:", insErr);
    } else {
      console.log(`Successfully seeded ${englishQuestions.length} English questions!`);
    }
  } else {
    console.log("English question set already exists with ID:", setId);
  }
}

main().catch(console.error);
