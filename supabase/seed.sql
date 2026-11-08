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

