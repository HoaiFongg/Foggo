-- ============================================================================
-- Fix RLS policies on session_players
-- Cho phép học sinh, giáo viên tham gia (insert) và cập nhật (update) nhân vật
-- ============================================================================

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

