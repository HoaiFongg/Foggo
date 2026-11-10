-- ============================================================================
-- Khóa bảo vệ các trường hệ thống quan trọng trên bảng profiles
-- Ngăn chặn người dùng thường tự sửa role, plan, fireflies, recovery_code_hash
-- Chỉ service_role (Admin Client / Server Action) mới có thể sửa các trường này
-- ============================================================================

create or replace function public.protect_profile_system_fields()
returns trigger language plpgsql security definer as $$
begin
  -- Nếu thao tác đến từ client thông thường (role authenticated)
  if auth.role() = 'authenticated' then
    new.role := old.role;
    new.plan := old.plan;
    new.plan_expires_at := old.plan_expires_at;
    new.fireflies := old.fireflies;
    new.recovery_code_hash := old.recovery_code_hash;
  end if;
  return new;
end; $$;

drop trigger if exists trg_protect_profile_system_fields on public.profiles;
create trigger trg_protect_profile_system_fields
  before update on public.profiles
  for each row execute function public.protect_profile_system_fields();
