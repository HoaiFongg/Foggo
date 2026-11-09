-- ============================================================
-- FOGGO DATABASE SCHEMA & SETUP (SUPABASE POSTGRES)
-- Toàn bộ CSDL cho Dự án Foggo (Giai đoạn 0 -> Giai đoạn 8)
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
  name_search text,
  status text not null default 'pending' check (status in ('verified','pending','rejected')),
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Trigger tự động chuẩn hóa name_search không dấu (tránh lỗi immutable của Postgres unaccent)
create or replace function public.schools_set_name_search()
returns trigger as $$
begin
  new.name_search := lower(unaccent(new.name));
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_schools_name_search on public.schools;
create trigger trg_schools_name_search
  before insert or update on public.schools
  for each row execute function public.schools_set_name_search();

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
  xp integer not null default 0,
  level integer not null default 1,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_lower on public.profiles (lower(username));

-- Liên kết khóa ngoại teacher_id & created_by an toàn (idempotent)
alter table public.schools drop constraint if exists fk_schools_creator;
alter table public.schools add constraint fk_schools_creator foreign key (created_by) references public.profiles(id) on delete set null;

alter table public.classes drop constraint if exists fk_classes_teacher;
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
  )
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);
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
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  tags text[] not null default '{}',
  explanation text,
  created_at timestamptz not null default now()
);

create index if not exists idx_questions_set_position on public.questions(set_id, position);
create index if not exists idx_questions_set_diff on public.questions(set_id, difficulty);

-- ============ 7. THẾ GIỚI / PHIÊN GAME (GAME SESSIONS) ============
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id),
  teacher_id uuid references public.profiles(id),
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
  wave integer not null default 1,
  round integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  current_index integer not null default -1,
  question_started_at timestamptz,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

-- Đảm bảo các cột mở rộng luôn có mặt nếu bảng đã tồn tại trước đó
alter table public.game_sessions
  add column if not exists teacher_id uuid references public.profiles(id),
  add column if not exists wave integer not null default 1,
  add column if not exists round integer not null default 0;

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
  hp integer not null default 100,
  max_hp integer not null default 100,
  inventory jsonb not null default '[]'::jsonb,
  equipment jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{"kills": 0, "damage_dealt": 0, "damage_taken": 0, "items_crafted": 0, "bosses_defeated": 0}'::jsonb,
  is_alive boolean not null default true,
  wave_reached integer not null default 1,
  state jsonb not null default '{}',
  joined_at timestamptz not null default now(),
  banned boolean not null default false,
  state_version integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Đảm bảo các cột mở rộng cho session_players
alter table public.session_players
  add column if not exists hp integer not null default 100,
  add column if not exists max_hp integer not null default 100,
  add column if not exists inventory jsonb not null default '[]'::jsonb,
  add column if not exists equipment jsonb not null default '{}'::jsonb,
  add column if not exists stats jsonb not null default '{"kills": 0, "damage_dealt": 0, "damage_taken": 0, "items_crafted": 0, "bosses_defeated": 0}'::jsonb,
  add column if not exists is_alive boolean not null default true,
  add column if not exists wave_reached integer not null default 1;

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
  round integer not null default 0,
  created_at timestamptz not null default now(),
  unique (player_id, question_id)
);

alter table public.session_answers
  add column if not exists round integer not null default 0;

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

-- ============ 12. NHẬT KÝ SỰ KIỆN SINH TỒN (SURVIVAL EVENTS) ============
create table if not exists public.survival_events (
  id bigserial primary key,
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid not null references public.session_players(id) on delete cascade,
  type text not null, -- 'kill','loot','craft','death','wave_result','boss_down','buy','sell','explore'
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_survival_events_session on public.survival_events (session_id, created_at);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (DROP & RECREATE SAFELY)
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
alter table public.survival_events enable row level security;

-- PROFILES
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- SCHOOLS
drop policy if exists "Schools viewable by everyone" on public.schools;
create policy "Schools viewable by everyone" on public.schools
  for select using (true);

drop policy if exists "Authenticated users can create school" on public.schools;
create policy "Authenticated users can create school" on public.schools
  for insert with check (auth.role() = 'authenticated');

-- CLASSES
drop policy if exists "Classes viewable by authenticated users" on public.classes;
create policy "Classes viewable by authenticated users" on public.classes
  for select using (auth.role() = 'authenticated');

drop policy if exists "Teachers can manage their classes" on public.classes;
create policy "Teachers can manage their classes" on public.classes
  for all using (teacher_id = auth.uid());

-- QUESTION SETS
drop policy if exists "Question sets viewable if public or owner" on public.question_sets;
create policy "Question sets viewable if public or owner" on public.question_sets
  for select using (
    visibility in ('public', 'unlisted') or owner_id = auth.uid()
  );

drop policy if exists "Users can manage own question sets" on public.question_sets;
create policy "Users can manage own question sets" on public.question_sets
  for all using (owner_id = auth.uid());

-- QUESTIONS
drop policy if exists "Owners can manage questions" on public.questions;
create policy "Owners can manage questions" on public.questions
  for all using (
    exists (
      select 1 from public.question_sets qs
      where qs.id = questions.set_id and qs.owner_id = auth.uid()
    )
  );

-- GAME SESSIONS
drop policy if exists "Hosts can manage game sessions" on public.game_sessions;
create policy "Hosts can manage game sessions" on public.game_sessions
  for all using (host_id = auth.uid() or teacher_id = auth.uid());

drop policy if exists "Sessions viewable by players" on public.game_sessions;
create policy "Sessions viewable by players" on public.game_sessions
  for select using (
    status in ('open', 'paused') or host_id = auth.uid() or teacher_id = auth.uid()
  );

-- SESSION PLAYERS
drop policy if exists "Session players viewable by participants" on public.session_players;
create policy "Session players viewable by participants" on public.session_players
  for select using (true);

drop policy if exists "Players can join sessions" on public.session_players;
create policy "Players can join sessions" on public.session_players
  for insert with check (true);

drop policy if exists "Players can update own session" on public.session_players;
create policy "Players can update own session" on public.session_players
  for update using (true);

drop policy if exists "Players can delete own session" on public.session_players;
create policy "Players can delete own session" on public.session_players
  for delete using (true);

-- COSMETICS
drop policy if exists "Cosmetics viewable by everyone" on public.cosmetics;
create policy "Cosmetics viewable by everyone" on public.cosmetics
  for select using (true);

drop policy if exists "Users can view own cosmetics" on public.user_cosmetics;
create policy "Users can view own cosmetics" on public.user_cosmetics
  for select using (user_id = auth.uid());

-- SURVIVAL EVENTS
drop policy if exists "Survival events readable by teacher and owner" on public.survival_events;
create policy "Survival events readable by teacher and owner" on public.survival_events
  for select using (
    exists (
      select 1 from public.game_sessions s
      where s.id = survival_events.session_id and (s.host_id = auth.uid() or s.teacher_id = auth.uid())
    )
    or exists (
      select 1 from public.session_players p
      where p.id = survival_events.player_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "Survival events insertable by session participants" on public.survival_events;
create policy "Survival events insertable by session participants" on public.survival_events
  for insert with check (true);

-- ============================================================
-- FOGGO SEED DATA
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

-- Đồng bộ metadata trong auth.users cho tài khoản hoaifongg@gmail.com
update auth.users
set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin', 'plan', 'plus')
where email = 'hoaifongg@gmail.com';
