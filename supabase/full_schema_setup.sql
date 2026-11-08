-- ============================================================
-- FOGGO DATABASE SCHEMA (SUPABASE POSTGRES)
-- Migration: 20261109000001_initial_schema.sql
-- ============================================================

-- Bật extension cần thiết
create extension if not exists "pgcrypto";
create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- ============ 1. TRƯỜNG HỌC (SCHOOLS) ============
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text not null,
  district text,
  level text check (level in ('tieu_hoc','thcs','thpt','khac')),
  name_search text generated always as (lower(unaccent(name))) stored,
  status text not null default 'pending' check (status in ('verified','pending','rejected')),
  created_by uuid,
  created_at timestamptz not null default now()
);

create unique index if not exists schools_unique on public.schools (name_search, province);
create index if not exists schools_search on public.schools using gin (name_search gin_trgm_ops);

-- ============ 2. LỚP HỌC (CLASSES) ============
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  grade integer check (grade between 1 and 12),
  school_year text not null,
  teacher_id uuid,
  join_code char(8),
  created_at timestamptz not null default now()
);

create unique index if not exists classes_unique on public.classes (school_id, lower(name), school_year);
create unique index if not exists classes_join_code on public.classes (join_code) where join_code is not null;

-- ============ 3. PROFILES (HỒ SƠ NGƯỜI DÙNG) ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  plan text not null default 'free' check (plan in ('free','plus')),
  plan_expires_at timestamptz,
  fireflies integer not null default 0,
  auth_type text not null default 'email' check (auth_type in ('email','username','google','anonymous')),
  school_id uuid references public.schools(id),
  class_id uuid references public.classes(id),
  recovery_code_hash text,
  must_change_password boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower on public.profiles (lower(username));

-- Liên kết khóa ngoại teacher_id & created_by sau khi profiles đã tạo
alter table public.schools add constraint fk_schools_creator foreign key (created_by) references public.profiles(id) on delete set null;
alter table public.classes add constraint fk_classes_teacher foreign key (teacher_id) references public.profiles(id) on delete set null;

-- Tự động tạo profile khi người dùng đăng ký qua auth.users
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (
    id,
    display_name,
    username,
    role,
    auth_type,
    avatar_url
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', 'Người chơi Mới'),
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'auth_type', 'email'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ 4. THÀNH VIÊN LỚP (CLASS MEMBERS) ============
create table if not exists public.class_members (
  class_id uuid references public.classes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved')),
  joined_via text not null default 'self' check (joined_via in ('self','code','teacher')),
  created_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

-- ============ 5. BỘ CÂU HỎI (QUESTION SETS) ============
create table if not exists public.question_sets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  subject text,
  grade_level text,
  language text default 'vi',
  visibility text not null default 'private' check (visibility in ('private','unlisted','public')),
  play_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_question_sets_owner on public.question_sets(owner_id);
create index if not exists idx_question_sets_visibility on public.question_sets(visibility);

-- ============ 6. CÂU HỎI (QUESTIONS) ============
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.question_sets(id) on delete cascade,
  position integer not null,
  type text not null,
  content jsonb not null,
  answer_key jsonb not null,
  time_limit_sec integer not null default 20,
  points integer not null default 1000,
  explanation text,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_set_position on public.questions(set_id, position);

-- ============ 7. THẾ GIỚI / PHIÊN GAME (GAME SESSIONS) ============
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id),
  kind text not null default 'class' check (kind in ('class','link','solo','quick')),
  class_id uuid references public.classes(id),
  set_id uuid references public.question_sets(id),
  mode text not null default 'survival',
  title text not null,
  settings jsonb not null default '{}',
  join_token text unique,
  join_token_expires_at timestamptz,
  allow_guests boolean not null default false,
  max_players integer,
  status text not null default 'scheduled' check (status in ('scheduled','open','paused','closed')),
  starts_at timestamptz,
  ends_at timestamptz,
  current_index integer not null default -1,
  question_started_at timestamptz,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists idx_game_sessions_class on public.game_sessions (class_id, status);
create index if not exists idx_game_sessions_host on public.game_sessions (host_id, created_at desc);
create index if not exists idx_game_sessions_token on public.game_sessions (join_token) where join_token is not null;

-- ============ 8. NGƯỜI CHƠI TRONG THẾ GIỚI (SESSION PLAYERS) ============
create table if not exists public.session_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  user_id uuid references auth.users(id),
  nickname text not null,
  avatar text,
  score integer not null default 0,
  gold integer not null default 0,
  state jsonb not null default '{}',
  joined_at timestamptz not null default now(),
  banned boolean not null default false,
  state_version integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_session_players_session on public.session_players(session_id);
create unique index if not exists session_players_user_unique
  on public.session_players (session_id, user_id) where user_id is not null;

-- ============ 9. LƯỢT TRẢ LỜI CÂU HỎI (SESSION ANSWERS) ============
create table if not exists public.session_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid not null references public.session_players(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  answer jsonb not null,
  score_ratio numeric(4,3) not null,
  points_awarded integer not null,
  response_ms integer,
  created_at timestamptz not null default now(),
  unique (player_id, question_id)
);

-- ============ 10. GÓI ĐĂNG KÝ (SUBSCRIPTIONS) ============
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,
  provider_customer_id text,
  provider_subscription_id text,
  plan text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- ============ 11. ĐỒ TRANG TRÍ & SKIN (COSMETICS) ============
create table if not exists public.cosmetics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  rarity text not null default 'common' check (rarity in ('common','rare','epic','legendary')),
  price_fireflies integer
);

create table if not exists public.user_cosmetics (
  user_id uuid references public.profiles(id) on delete cascade,
  cosmetic_id uuid references public.cosmetics(id),
  acquired_at timestamptz default now(),
  primary key (user_id, cosmetic_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

alter table public.profiles enable row level security;
alter table public.schools enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.question_sets enable row level security;
alter table public.questions enable row level security;
alter table public.game_sessions enable row level security;
alter table public.session_players enable row level security;
alter table public.session_answers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.cosmetics enable row level security;
alter table public.user_cosmetics enable row level security;

-- PROFILES: Mọi người có thể đọc profile cơ bản, chỉ chủ tài khoản được sửa
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- SCHOOLS: Mọi người có thể đọc thông tin trường để tìm kiếm khi đăng ký
create policy "Schools viewable by everyone" on public.schools
  for select using (true);

create policy "Authenticated users can create school" on public.schools
  for insert with check (auth.role() = 'authenticated');

-- CLASSES: Mọi người có thể xem lớp trong trường
create policy "Classes viewable by authenticated users" on public.classes
  for select using (auth.role() = 'authenticated');

create policy "Teachers can manage their classes" on public.classes
  for all using (teacher_id = auth.uid());

-- QUESTION SETS: Xem public/unlisted, hoặc xem bộ câu hỏi của chính mình
create policy "Question sets viewable if public or owner" on public.question_sets
  for select using (
    visibility in ('public', 'unlisted') or owner_id = auth.uid()
  );

create policy "Users can manage own question sets" on public.question_sets
  for all using (owner_id = auth.uid());

-- QUESTIONS: Chỉ chủ sở hữu bộ câu hỏi mới truy cập trực tiếp qua client
-- Người chơi khi thi đấu sẽ nhận câu hỏi qua API Server (không kèm answer_key)
create policy "Owners can manage questions" on public.questions
  for all using (
    exists (
      select 1 from public.question_sets qs
      where qs.id = questions.set_id and qs.owner_id = auth.uid()
    )
  );

-- GAME SESSIONS: Host quản lý, người chơi xem được nếu có liên quan
create policy "Hosts can manage game sessions" on public.game_sessions
  for all using (host_id = auth.uid());

create policy "Sessions viewable by players" on public.game_sessions
  for select using (
    status in ('open', 'paused') or host_id = auth.uid()
  );

-- SESSION PLAYERS: Xem người chơi trong cùng session
create policy "Session players viewable by participants" on public.session_players
  for select using (true);

-- COSMETICS: Ai cũng có thể xem cửa hàng skin
create policy "Cosmetics viewable by everyone" on public.cosmetics
  for select using (true);

create policy "Users can view own cosmetics" on public.user_cosmetics
  for select using (user_id = auth.uid());

-- ============================================================================
-- FOGGO SURVIVAL SCHEMA MIGRATION
-- Giai đoạn 5: Cơ sở dữ liệu cho Chế độ Sinh tồn tri thức (Survival Quiz)
-- ============================================================================

-- 1. Thêm độ khó và nhãn chủ đề cho câu hỏi
alter table public.questions
  add column if not exists difficulty smallint not null default 1 check (difficulty between 1 and 3),
  add column if not exists tags text[] not null default '{}';

create index if not exists idx_questions_set_diff on public.questions (set_id, difficulty);

-- 2. Thêm cột round cho lượt trả lời để xoay vòng câu hỏi
alter table public.session_answers
  add column if not exists round integer not null default 0;

-- 3. Bảng nhật ký sự kiện sinh tồn (Survival Events)
create table if not exists public.survival_events (
  id bigserial primary key,
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid not null references public.session_players(id) on delete cascade,
  type text not null, -- 'kill','loot','craft','death','wave_result','boss_down','buy','sell','explore'
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_survival_events_session on public.survival_events (session_id, created_at);
alter table public.survival_events enable row level security;

create policy "Survival events readable by teacher and owner" on public.survival_events
  for select using (
    exists (
      select 1 from public.game_sessions s
      where s.id = survival_events.session_id and s.teacher_id = auth.uid()
    )
    or exists (
      select 1 from public.session_players p
      where p.id = survival_events.player_id and p.user_id = auth.uid()
    )
  );

create policy "Survival events insertable by session participants" on public.survival_events
  for insert with check (true);

-- 4. Tiến trình lâu dài tài khoản học sinh
alter table public.profiles
  add column if not exists xp integer not null default 0,
  add column if not exists level integer not null default 1;

-- ============================================================
-- FOGGO SEED DATA
-- supabase/seed.sql
-- ============================================================

-- 1. Cosmetics mẫu (Linh vật Cáo Gô và skin cơ bản)
insert into public.cosmetics (name, image_url, rarity, price_fireflies)
values
  ('Gô Mặc Định', '/blooks/go-classic.svg', 'common', 0),
  ('Gô Cầm Đèn Lồng Cổ', '/blooks/go-lantern.svg', 'rare', 50),
  ('Gô Thám Hiểm Sương Mù', '/blooks/go-explorer.svg', 'epic', 150),
  ('Gô Hoàng Kim', '/blooks/go-golden.svg', 'legendary', 500)
on conflict do nothing;

-- 2. Trường mẫu
insert into public.schools (name, province, district, level, status)
values
  ('THCS Trưng Vương', 'Hà Nội', 'Hoàn Kiếm', 'thcs', 'verified'),
  ('THCS Lê Quý Đôn', 'TP. Hồ Chí Minh', 'Quận 3', 'thcs', 'verified'),
  ('THCS Chu Văn An', 'Hà Nội', 'Tây Hồ', 'thcs', 'verified')
on conflict do nothing;

-- 3. Tự động liên kết và nâng cấp tài khoản hoaifongg@gmail.com thành ADMIN + GÓI PLUS
insert into public.profiles (id, display_name, role, plan, auth_type)
select 
  id, 
  coalesce(raw_user_meta_data->>'display_name', 'Phạm Nguyễn Hoài Phong (Admin)'),
  'admin',
  'plus',
  'email'
from auth.users
where email = 'hoaifongg@gmail.com'
on conflict (id) do update set
  role = 'admin',
  plan = 'plus';


