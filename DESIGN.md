# FOGGO DESIGN SYSTEM (DESIGN.md)
> Governed by **Apple Design** (WWDC Designing Fluid Interfaces & Optical Craft), **Taste-Skill 2.5** (Figma.com luxury standard) & **Impeccable** (visual hierarchy, typography, spatial discipline).

---

## 1. Core Visual World: "Apple Luminous Gallery & Amber Lantern"
Foggo is a survival RPG educational quiz platform. The aesthetic is inspired by Apple's signature keynote & hardware showcase:
*Pristine luminous canvas (#F5F5F7) paired with multi-layered frosted glass slabs (`.apple-glass`), specular edge lighting, optical typography, and fluid spring physics.*

### Surface Modes:
- **Default Mode: Apple Luxury Light (#F5F5F7)**:
  - Clean, high-end Apple hardware keynote backdrop (`#F5F5F7`) with a breathing ambient radial glow (`radial-gradient(120% 80% at 50% -10%, rgba(245,158,11,0.05), #F5F5F7)`).
  - Multi-layered frosted glass cards (`.apple-glass` with `backdrop-filter: blur(28px) saturate(190%)`, top specular highlight edge `inset 0 1px 0 0 rgba(255, 255, 255, 0.95)`).
  - High-contrast Apple Charcoal typography (`#1D1D1F`, `#333336`, `#6E6E73`).
  - Zero murkiness, zero muddy gray boxes, zero raw OS emojis.
- **Dark Mode (Obsidian Glass)**:
  - Accessible via theme toggle (`data-theme="dark"` / `.dark`).
  - Deep midnight blue-slate (`#0B0F19`) with frosted glass panels (`rgba(15, 23, 42, 0.78)`).
- **Operate & Experience**:
  - Tactile pill buttons with critically damped spring motion (`apple-press`).
  - Segmented controls with white squircle active tabs.
  - 100% Lucide SVG custom iconography.

---

## 2. Design Tokens & Palette

### Backgrounds & Surfaces:
- **Deepest Void**: `#020617` (`bg-slate-950`)
- **Elevated Surface (Obsidian Container)**: `#0c1220` (`bg-[#0c1220]`) with top highlight `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]`
- **Sub-surface (Item / List row)**: `rgba(15, 23, 42, 0.6)` (`dark:bg-slate-900/50`)
- **Border Hairline**: `rgba(255, 255, 255, 0.08)` (`dark:border-white/[0.08]`)
- **Border Hover Glow**: `rgba(245, 158, 11, 0.4)` (`hover:border-amber-500/40`)

### Brand & Accent Colors:
- **Amber Lantern (Primary Action & Fireflies)**:
  - Base: `#f59e0b` (`amber-500`)
  - Highlight: `#fbbf24` (`amber-400`)
  - Glow: `rgba(245, 158, 11, 0.25)` (`shadow-amber-500/25`)
- **Emerald Nature (Correct Answers, Health & Growth)**:
  - Base: `#10b981` (`emerald-500`)
  - Accent: `#34d399` (`emerald-400`)
  - Glow: `rgba(16, 185, 129, 0.2)` (`shadow-emerald-500/20`)
- **Crimson Spark (Danger, HP Loss, Boss & Damage)**:
  - Base: `#ef4444` (`rose-500` / `red-500`)
- **Mist Blue (School, Class, Mana & Community)**:
  - Base: `#3b82f6` (`blue-500`)

---

## 3. Typography Rules
- **Sans-serif (`font-sans`)**: Clean, high-legibility system stack (`system-ui, -apple-system, sans-serif`) with `-0.015em` letter-spacing.
- **Monospace (`font-mono`)**: Technical labels, timers, stats, streaks, numbers, and badges (`ui-monospace, monospace`).
- **Hierarchy Scale**:
  - Display Title: `text-4xl` to `text-7xl`, `font-black`, `tracking-tight`.
  - Section Heading: `text-xl` to `text-2xl`, `font-bold`.
  - Card Title: `text-sm` to `text-base`, `font-bold`.
  - Body Text: `text-xs` to `text-sm`, `text-slate-400` / `dark:text-slate-400`, line height `1.5`.
  - Metadata / Badges: `text-[10px]` to `text-xs`, `font-mono`, `font-bold`, uppercase tracking-wider.

---

## 4. Taste-Skill Anti-Slop Bans (Zero Tolerance)
1. ❌ **No raw emoji as functional icons** (e.g. `🪙`, `🧪`, `⭐`, `🛡️`, `✨`, `⚔️`, `👑` dropped into raw `span` tags). All reward icons are replaced by styled SVG Lucide components with glowing circular containers (`Coins`, `FlaskConical`, `Star`, `Shield`, `Sparkles`, `Swords`, `Crown`).
2. ❌ **No generic purple-to-blue gradients** (hallmark of generic AI templates). Foggo's palette is rooted in warm amber lantern glow against dark mist obsidian.
3. ❌ **No verbose explanatory chatter or textbook annotations**. Headings and descriptions are succinct, confident, and action-oriented.
4. ❌ **No muddy washed-out grey containers** (e.g. `bg-slate-400`). All surfaces use clean obsidian surfaces with subtle hairline borders.
5. ❌ **No `transition: all`**. Transitions explicitly name properties (`transition-colors`, `transition-transform`, `transition-opacity`).
6. ❌ **No scroll-reveal or fade-in-on-scroll animations** that cause blank flashes or jank.

---

## 5. Micro-interactions & Tactile Feel
- Buttons: `active:scale-[0.98]` on click, providing physical feedback.
- Cards: `hover:-translate-y-0.5` lift with soft border glow `hover:border-amber-500/40`.
- Loading states: Characterful (Bé Slime squishy bounce with animated squash-stretch and companion fireflies).

---

## 6. Ambient Atmosphere & Interactive Creatures (Apple Delight §16)
- **Multi-layer Ambient Canvas:**
  - Dark Mode: `#0B0F19` deep obsidian with dual celestial highlights — warm Amber lantern aura at top-right (`rgba(245, 158, 11, 0.14)`) and cool Sapphire starlight at top-left (`rgba(99, 102, 241, 0.15)`).
  - Light Mode: `#F5F5F7` Apple luxury pearl with subtle sunlit warmth.
  - Frosting: `.apple-glass` translucent surface blur (`backdrop-filter: blur(20px)`) over specular borders.
- **Ambient Wandering Creatures (`AmbientCreatures.tsx`):**
  - Cute companions (Bé Slime `/sprites/slime_...`, Bé Cáo Foggo `🦊🎒`, and Star Wisp) wander across the bottom every 20–35s.
  - Interactive tactile touch: Clicking a creature triggers an excited bounce, sparkle bursts `✨`, and encouraging speech bubble toasts.
  - Non-blocking layout: Outer container is strictly `pointer-events-none` with `pointer-events-auto` on the sprite, zero interference with forms/buttons. Disabled under `prefers-reduced-motion`.

---

## 7. Trash Bin, Soft Delete & Instant Undo Pattern
- **Soft Delete Safety:** Deleting a set moves it to the Trash Bin (`[DELETED:timestamp:visibility]`), preserving all questions and preventing foreign key errors with past game sessions.
- **Instant Undo Floating Toast:** A bottom-center Apple Glass pill with immediate 1-click "Hoàn tác" button appearing right after deletion.
- **Dedicated Trash Modal:** View deleted history, question count, deletion timestamp, 1-click Restore, and safe Permanent Purge.

---

## 8. Dungeon Monster Sprites & 8-Frame Combat Animations
Foggo's Monster Battle Arena features high-fidelity, pixel-perfect 8-frame sprite sheets sliced into individual high-definition asset frames:

### 1. Sói con rừng sương (`baby_wolf`)
- Frame 1: **Idle** - Đứng chờ quan sát
- Frame 2: **Prep Run** - Chuẩn bị chạy / cúi mình
- Frame 3: **Run** - Lao nhanh về phía trước
- Frame 4: **Jump** - Nhảy vồ công kích
- Frame 5: **Land** - Tiếp đất an toàn
- Frame 6: **Hurt** - Nhắm mắt giật mình khi bị trúng đòn
- Frame 7: **Death** - Nằm gục xuống đất khi cạn máu
- Frame 8: **Rest** - Ngồi nghỉ ngơi ngoan ngoãn

### 2. Nhện độc sương mù (`mist_spider`)
- Frame 1: **Idle** - Đứng chờ trong làn khói độc
- Frame 2: **Crawl** - Bò chậm rãi rình mồi
- Frame 3: **Attack** - Dâng chân chuẩn bị cắn
- Frame 4: **Poison Cloud** - Phun sương độc mù mịt
- Frame 5: **Hurt** - Choáng váng ngã lùi khi bị trúng đòn
- Frame 6: **Defeated** - Ngửa bụng bị đánh bại
- Frame 7: **Fade** - Tan biến dần vào làn sương mù
- Frame 8: **Residue** - Vũng độc sót lại trên nền đất

### 3. Heo rừng chúa (`boar_king` - Boss)
- Frame 1: **Idle** - Đứng uy nghi đội vương miện
- Frame 2: **Walk** - Đi tuần oai phong
- Frame 3: **Charge** - Lao tới húc dũng mãnh
- Frame 4: **Roar** - Gầm thét uy chấn rừng sâu
- Frame 5: **Impact** - Húc mạnh làm chấn động mặt đất
- Frame 6: **Stun** - Choáng váng sao bay quanh đầu
- Frame 7: **Defeated** - Ngã gục kiệt sức
- Frame 8: **Vanish** - Tan biến trong làn khói, chỉ còn lại vương miện và áo choàng hoàng gia

### 4. Yêu tinh rừng (`forest_goblin` / `goblin`)
- Frame 1: **Idle** - Đứng chờ quan sát
- Frame 2: **Walk** - Đi bộ tuần tra
- Frame 3: **Run** - Chạy áp sát
- Frame 4: **Jump** - Nhảy vồ công kích
- Frame 5: **Happy** - Vui vẻ khích tướng
- Frame 6: **Angry** - Tức giận khi trúng đòn
- Frame 7: **Sleep / Defeat** - Ngủ / Nằm bẹp gục ngã
- Frame 8: **Sit** - Ngồi nghỉ ngơi

### 5. Golem nhỏ (`small_golem` / `rock_golem`)
- Frame 1: **Idle** - Đứng chờ với mắt pha lê phát sáng
- Frame 2: **Crawl** - Bò nhô lên từ lòng đất
- Frame 3: **Attack** - Chuẩn bị vung nắm đấm đá
- Frame 4: **Poison / Gas** - Phun sương độc / khói đá chấn động
- Frame 5: **Hurt** - Choáng váng rạn nứt
- Frame 6: **Defeated** - Đổ gục vỡ vụn
- Frame 7: **Fade** - Tan biến trong khói bụi hầm ngục
- Frame 8: **Residue** - Tàn tích sỏi đá sót lại trên nền đất

### 6. Bộ xương cổ đại (`skeleton`)
- Frame 1: **Idle** - Đứng chờ tay cầm kiếm rỉ sét
- Frame 2: **Crawl** - Bò rình mồi trong bóng tối
- Frame 3: **Attack** - Giương kiếm lấy thế chém
- Frame 4: **Slash** - Chém kiếm tạo vệt trăng khuyết tím uy lực
- Frame 5: **Hurt** - Choáng váng xương cốt lung lay
- Frame 6: **Defeated** - Gục ngã rã rời
- Frame 7: **Fade** - Linh hồn tím bốc lên tan biến
- Frame 8: **Residue** - Đống tro tàn và mảnh áo choàng sót lại

### Quy chuẩn Hướng mặt & Chuyển động Mượt mà (Facing & Fluid Motion):
1. **Đối mặt trực tiếp (Face-to-Face)**: Hiệp sĩ ở bên TRÁI hướng sang phải (`-->`). Toàn bộ quái vật ở bên PHẢI đều hướng sang trái (`<--`) nhìn thẳng vào Hiệp sĩ.
2. **Nhịp điệu 5 giai đoạn (5-Phase Fluid Combat Timing)**:
   - *Anticipation (140ms)*: Lấy đà, chùn chân, giương vũ khí.
   - *Strike (180ms)*: Lướt tới mượt mà với spring easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
   - *Impact (180ms)*: Va chạm, chớp sáng, giật lùi và hiện số sát thương.
   - *Follow-through (180ms)*: Tiếp đất, hoàn tất đòn đánh.
   - *Recovery (180ms)*: Lùi về vị trí nhịp thở Idle, tuyệt đối không bị giật hay khựng khung hình.

## 23. HỆ THỐNG ĐỒ HỌA PIXEL ART TOÀN DIỆN CHO HIỆP SĨ & TRANG BỊ

### 1. Hiệp Sĩ Modular Paper-Doll Engine (`src/components/PixelHero.tsx`)
- **8 Khung hình Sprite Chibi sắc nét (`public/sprites/hero/`)**: `idle.png`, `walk.png`, `sword_attack.png`, `staff_attack.png`, `bow_attack.png`, `hurt.png`, `victory.png`, `sit.png`.
- **Phân tầng Paper-Doll tự động đồng bộ theo trang bị thời gian thực**:
  - *Lớp Áo Choàng Lưng*: Áo choàng đỏ hiệp sĩ hoàng gia phấp phới (`knight_armor`), áo choàng pháp sư tím thẫm đính sao vàng (`mage_robe`), ống tên da thợ săn (`bow`).
  - *Lớp Mũ Bảo Hộ*: Mũ sắt hiệp sĩ chùm lông vũ đỏ (`iron_helmet`), mũ da sói có tai (`leather_helmet`), nón rơm lữ hành rộng vành (`straw_hat`).
  - *Lớp Giáp Ngực*: Phiến giáp mạ vàng hoàng gia (`knight_armor`), ngọc phù hiệu ma thuật tím (`mage_robe`), giáp phiến sắt rèn kiên cố (`iron_armor`), giáp da sói tán đinh (`leather_armor`).
  - *Lớp Khiên*: Khiên năng lượng Pha Lê Aura phát quang (`magic_shield`), khiên sắt hiệp sĩ chữ thập xanh (`iron_shield`), khiên gỗ tròn đinh tán (`wooden_shield`).
  - *Lớp Hiệu Ứng Vũ Khí Nguyên Tố*: Ngọn lửa bốc cháy (`fire_staff`), pha lê phát sáng (`crystal_sword`), cầu ma thuật (`magic_staff`).
  - *Combat VFX*: Vệt chém trăng khuyết vàng rực / cầu ma thuật bùng nổ / mũi tên phong linh lao vút khi tấn công.

### 2. Bộ Icon Pixel Art Toàn Bộ Vật Phẩm (`src/components/PixelItemIcon.tsx`)
- Đồ họa SVG crispEdges 32x32 sắc nét trên mọi mật độ điểm ảnh (Retina / 4K / Mobile).
- Phủ kín 35+ vật phẩm trong game:
  - 11 Vũ khí: `wooden_club`, `wooden_sword`, `stone_axe`, `stone_sword`, `iron_sword`, `steel_sword`, `crystal_sword`, `hunting_bow`, `iron_bow`, `magic_staff`, `fire_staff`.
  - 3 Mũ bảo hộ: `straw_hat`, `leather_helmet`, `iron_helmet`.
  - 5 Áo giáp: `cloth_armor`, `leather_armor`, `iron_armor`, `knight_armor`, `mage_robe`.
  - 3 Khiên: `wooden_shield`, `iron_shield`, `magic_shield`.
  - 8 Thức ăn & Dược phẩm: `apple`, `bread`, `raw_meat`, `cooked_meat`, `meat_stew`, `bandage`, `small_healing_potion`, `healing_potion`.
  - 10 Nguyên liệu & Chiến lợi phẩm: `wood`, `stone`, `iron_ore`, `leather`, `bone`, `slime_gel`, `crystal`, `herb`, `gold_tusk`, `wood_fence`.
- Tích hợp trực tiếp vào Cửa hàng Thợ Rèn, Túi đồ 30 ô, và 4 Ô Trang Bị Nhân Vật.

## 24. HỆ THỐNG NỀN ĐỘNG PIXEL ART VÀ THIẾT KẾ RETRO RPG

### 1. Nền Động Đa Tầng (`src/components/PixelAnimatedBackground.tsx`)
- **Bầu trời Mây Pixel (Parallax Cloud Drift)**: 3 tầng mây pixel art khối vector chuyển động ngang êm ái (`pixelCloudDriftSlow`, `pixelCloudDriftMed`, `pixelCloudDriftFast`).
- **Bào tử & Bụi vàng phát quang (`pixelSporeFloat`)**: Các hạt đốm sáng bay từ dưới lên tạo không gian sống động kỳ ảo.
- **Hiệu ứng Click Sparkles**: Mỗi click chuột tạo chùm hạt pixel `✦`, `★`, `♦` lấp lánh phản hồi xúc giác tức thời.
- **Sinh vật Ambient xuất hiện & tương tác**:
  - Sói con (`baby_wolf`), Slime xanh (`slime`), Hiệp sĩ Chibi (`hero`), Yêu tinh rừng (`goblin`).
  - Hỗ trợ click để bật nhảy vui nhộn và hiển thị bóng thoại động viên học tập.

### 2. Bộ Lớp Giao Diện Pixel Retro UI (`globals.css`)
- `.pixel-panel`: Viền hộp 2px sắc nét cùng bóng đổ khối 3D.
- `.pixel-btn-amber` / `.pixel-btn-neutral`: Nút bấm có hiệu ứng lún phím khi nhấn chuột (`active:translate`).
- `.pixel-badge`: Nhãn chỉ số pixel art dạng hộp `[ QUEST ]`.

## 25. CHUẨN HÓA ĐỐI KHÁNG TRỰC DIỆN & HOẠT HỌA QUÁI VẬT MƯỢT MÀ

### 1. Trục Đối Kháng Trực Diện (Face-to-Face Orientation)
- Nhân vật Hiệp Sĩ ở cánh trái luôn hướng mặt sang phải (`-->`).
- Quái vật ở cánh phải được lật đối xứng bằng CSS (`-scale-x-100`) để luôn hướng mặt sang trái (`<--`), đảm bảo tính chân thực và đối kháng trực diện 100%.

### 2. Nhịp Độ Animation Mượt Mà Chuẩn RPG
- **Idle Breathing**: Nhịp thở 460ms chuyển đổi tự nhiên giữa đứng chờ và ngồi/bò nghỉ ngơi.
- **Attack Phase**: Đòn đánh chia rõ 4 giai đoạn vật lý (Anticipation 220ms -> Strike 260ms -> Impact 260ms -> Recovery 260ms), triệt tiêu hoàn toàn hiện tượng khựng giật.
- **Hurt & Defeat**: Quái nháy sáng đổi màu khi nhận sát thương; khi cạn HP phát hoạt ảnh gục ngã -> tan biến -> tàn tích.

## 26. QUY CHUẨN THIẾT KẾ THƯƠNG MẠI HÓA & "ANTI-AI SLOP" (SELLABLE DESIGN)

### 1. Triết Lý Thiết Kế Tránh Xa Dấu Vết Của AI (Eradicating AI Slop)
- **Không khẩu hiệu sáo rỗng:** Tuyệt đối không dùng văn mẫu chung chung ("Cách mạng hóa tương lai giáo dục bằng AI 4.0"). Mọi thông điệp đều gắn liền với giá trị thực tế của giáo viên: Tiết kiệm thời gian soạn bài, tăng mức độ tập trung của học sinh, xuất báo cáo điểm số chuẩn.
- **Sản phẩm thật (Real Interactive Demo):** Trang đích phải có khu vực trải nghiệm câu hỏi tương tác thật (Playable Hero Battle) để người dùng click thử nghiệm ngay lập tức.
- **Phân tầng định giá 3 cột rõ ràng:** Gói Khởi Đầu (Free), Gói Giáo Viên Plus (Pro), và Gói Trường Học / Tổ Bộ Môn (Enterprise B2B) với đầy đủ điều khoản xuất hóa đơn VAT điện tử, hợp đồng dịch vụ và cam kết bảo mật trẻ em COPPA & GDPR.
- **Bản sắc Amber Lantern độc bản:** Giữ vững gam màu vàng cam hổ phách ấm áp đặc trưng của Foggo, viền highlight specular phản chiếu ánh sáng và bề mặt kính mờ `.apple-glass` đa tầng, loại bỏ hoàn toàn các gradient tím AI phổ biến.





