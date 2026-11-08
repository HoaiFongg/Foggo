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

