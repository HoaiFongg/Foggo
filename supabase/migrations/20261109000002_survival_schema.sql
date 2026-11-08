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

-- 3. Bổ sung các cột trạng thái sinh tồn cho session_players & game_sessions
alter table public.session_players
  add column if not exists hp integer not null default 100,
  add column if not exists max_hp integer not null default 100,
  add column if not exists inventory jsonb not null default '[]'::jsonb,
  add column if not exists equipment jsonb not null default '{}'::jsonb,
  add column if not exists stats jsonb not null default '{"kills": 0, "damage_dealt": 0, "damage_taken": 0, "items_crafted": 0, "bosses_defeated": 0}'::jsonb,
  add column if not exists is_alive boolean not null default true,
  add column if not exists wave_reached integer not null default 1;

alter table public.game_sessions
  add column if not exists teacher_id uuid references public.profiles(id),
  add column if not exists wave integer not null default 1,
  add column if not exists round integer not null default 0;

-- 4. Bảng nhật ký sự kiện sinh tồn (Survival Events)
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

-- 5. Tiến trình lâu dài tài khoản học sinh
alter table public.profiles
  add column if not exists xp integer not null default 0,
  add column if not exists level integer not null default 1;
