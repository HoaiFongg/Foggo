export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "student" | "teacher" | "admin";
export type UserPlan = "free" | "plus";
export type AuthType = "email" | "username" | "google" | "anonymous";

export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  plan: UserPlan;
  plan_expires_at: string | null;
  fireflies: number;
  auth_type: AuthType;
  school_id: string | null;
  class_id: string | null;
  recovery_code_hash: string | null;
  must_change_password: boolean;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  province: string;
  district: string | null;
  level: "tieu_hoc" | "thcs" | "thpt" | "khac" | null;
  status: "verified" | "pending" | "rejected";
  created_by: string | null;
  created_at: string;
}

export interface ClassRoom {
  id: string;
  school_id: string;
  name: string;
  grade: number | null;
  school_year: string;
  teacher_id: string | null;
  join_code: string | null;
  created_at: string;
}

export type QuestionType =
  | "single_choice"
  | "true_false"
  | "multi_select"
  | "drag_order"
  | "drag_match"
  | "drag_fill"
  | "hotspot"
  | "true_false_multi"
  | "dropdown_list";

export interface QuestionSet {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  subject: string | null;
  grade_level: string | null;
  language: string;
  visibility: "private" | "unlisted" | "public";
  play_count: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  set_id: string;
  position: number;
  type: QuestionType;
  content: Json;
  answer_key: Json;
  time_limit_sec: number;
  points: number;
  explanation: string | null;
  created_at: string;
}

export interface GameSession {
  id: string;
  host_id: string;
  kind: "class" | "link" | "solo" | "quick";
  class_id: string | null;
  set_id: string | null;
  mode: string;
  title: string;
  settings: Json;
  join_token: string | null;
  join_token_expires_at: string | null;
  allow_guests: boolean;
  max_players: number | null;
  status: "scheduled" | "open" | "paused" | "closed";
  starts_at: string | null;
  ends_at: string | null;
  current_index: number;
  question_started_at: string | null;
  created_at: string;
  closed_at: string | null;
}

export interface SessionPlayer {
  id: string;
  session_id: string;
  user_id: string | null;
  nickname: string;
  avatar: string | null;
  score: number;
  gold: number;
  state: Json;
  joined_at: string;
  banned: boolean;
  state_version: number;
  updated_at: string;
}

