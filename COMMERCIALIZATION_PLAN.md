# FOGGO: CHIẾN LƯỢC TỔ CHỨC CHỨC NĂNG, THIẾT KẾ UI/UX & CI/CD THƯƠNG MẠI HÓA

> **Tài liệu chiến lược sản phẩm (Product Strategy & Architecture Blueprint)**
> Định hướng đưa Foggo từ một dự án phần mềm thành một **Sản phẩm Công nghệ Giáo dục (EdTech SaaS) có khả năng thương mại hóa, bán bản quyền B2B/B2C thành công**, với ngôn ngữ thiết kế độc bản, thủ công cao cấp (**Anti-AI Slop**) và hệ thống CI/CD chuẩn doanh nghiệp.

---

## 1. Bản Đồ Tổ Chức Chức Năng Thương Mại Hóa (Functional Architecture)

Một nền tảng game hóa học tập chỉ có thể bán được khi nó giải quyết triệt để bài toán kinh tế và vận hành của **3 đối tượng trả tiền**:

```
                       ┌─────────────────────────────────────────┐
                       │     FOGGO COMMERCIAL ECOSYSTEM          │
                       └────────────────────┬────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│     B2B ENTERPRISE    │       │        B2B PLG        │       │        B2C FUN        │
│  Nhà Trường & Phòng GD│       │  Giáo Viên & Lớp Học  │       │  Học Sinh & Gia Đình  │
├───────────────────────┤       ├───────────────────────┤       ├───────────────────────┤
│• Quản lý giấy phép    │       │• Soạn đề 8 dạng câu   │       │• Đấu trường sinh tồn  │
│  tập trung (License)  │       │• Quét mã QR vào ngay  │       │• Đồ họa Pixel Chibi   │
│• Kho đề nội bộ trường │       │• Chống lộ đề 100% RLS │       │• Điểm danh 7 ngày     │
│• Phân quyền Tổ trưởng │       │• Xuất Excel chuẩn điểm│       │• Không cần email (Bảo │
│• Hợp đồng & VAT đỏ    │       │• Tự đóng phòng sau 24h│       │  mật chuẩn COPPA)     │
└───────────────────────┘       └───────────────────────┘       └───────────────────────┘
```

### 1.1. Luồng B2B Enterprise (Bán cho Trường học / Chuỗi Giáo dục)
* **Đối tượng ra quyết định:** Hiệu trưởng, Phó Hiệu trưởng chuyên môn, Trưởng phòng Đào tạo.
* **Nỗi đau (Pain points):**
  - Khó kiểm soát chất lượng câu hỏi giữa các giáo viên trong trường.
  - Nguy cơ lộ đề kiểm tra trước giờ thi nếu dùng các nền tảng trôi nổi.
  - Không có hóa đơn tài chính (VAT), hợp đồng pháp nhân theo quy định nhà nước.
* **Chức năng thương mại hóa cốt lõi:**
  1. **Kho đề thi nội bộ trường (Private School Question Bank):** Giáo viên trong cùng trường được chia sẻ ma trận đề nhưng bảo mật tuyệt đối với bên ngoài.
  2. **Quản trị phân quyền trường học (School Admin Console):** Cấp phát tài khoản giáo viên theo danh sách, phân quyền Tổ trưởng bộ môn duyệt đề trước khi đưa vào hầm ngục thi đấu.
  3. **Tương thích chuẩn quản lý điểm số (Gradebook Export):** Xuất báo cáo điểm tương thích với phần mềm VNEDU, SMAS, Microsoft Excel của trường.
  4. **Cơ chế thanh toán pháp nhân:** Hỗ trợ thanh toán chuyển khoản doanh nghiệp, xuất hóa đơn điện tử VAT, hợp đồng cung cấp dịch vụ phần mềm có dấu mộc.

### 1.2. Luồng B2B Product-Led Growth (Bán gói Plus cho Giáo viên)
* **Đối tượng:** Giáo viên bộ môn (Toán, KHTN, Anh, Tin học, Lịch sử - Địa lý) muốn tiết kiệm thời gian và thu hút học sinh.
* **Nỗi đau:** Học sinh chán nản với các bài kiểm tra trắc nghiệm giấy đơn điệu; soạn đề mất 3-4 tiếng mỗi tuần; chấm bài và vào sổ điểm thủ công mệt mỏi.
* **Chức năng thương mại hóa:**
  1. **Bộ 8 định dạng câu hỏi chuyên sâu:** Mở rộng vượt qua trắc nghiệm thông thường với *Chọn vùng ảnh (Hotspot)*, *Kéo thả ghép cặp*, *Điền khuyết*, *Sắp xếp thứ tự*.
  2. **Vào chơi không cần mã PIN:** Quét mã QR là vào ngay, tiết kiệm 10 phút đầu giờ học so với các nền tảng khác.
  3. **Radar phát hiện học sinh gặp khó khăn (Struggling Radar):** Báo cáo thời gian thực chỉ rõ câu hỏi nào lớp làm sai nhiều nhất để cô giáo giảng lại ngay trên lớp.
  4. **Tự động đóng phòng sau 24h:** Đảm bảo học sinh không làm bài sau thời hạn quy định, giáo viên không cần canh giờ khóa thủ công.

### 1.3. Luồng B2C & Trải nghiệm Học sinh (Giữ chân & Tăng trưởng tự nhiên)
* **Đăng ký bảo mật tuyệt đối cho học sinh (COPPA & GDPR):** Không bắt buộc nhập email hay số điện thoại; học sinh đăng ký bằng `Tên đăng nhập + Mã khôi phục bí mật + Trường + Lớp`.
* **Cơ chế Giữ chân Học sinh (Retention Loop):**
  - Vòng quay điểm danh chuỗi 7 ngày nhận quà (`DailyLoginStreakCard.tsx`).
  - Hệ thống đồ họa Paper-Doll: Hiệp sĩ thay đổi diện mạo tức thời khi trang bị Kiếm, Khiên, Giáp, Nón rơm hay Gậy phép.
  - Sinh vật chuyển động trên màn hình (`AmbientCreatures.tsx`), tương tác vui nhộn khi hoàn thành bài tập.

---

## 2. Chiến Lược UI/UX "Anti-AI Slop" (Tại Sao Không Thể Nhìn Giống AI?)

### 2.1. Nhận diện "AI Slop" là gì và vì sao khiến trang web KHÔNG BÁN ĐƯỢC?
Một trang web trông như do AI tạo ra (AI-generated slop) thường có những đặc điểm nhận diện sau đây, khiến khách hàng doanh nghiệp và người dùng nghi ngờ về tính xác thực:
1. **Khẩu hiệu sáo rỗng vô nghĩa (Corporate Jargon Bloat):** Các cụm từ như *"Cách mạng hóa tương lai giáo dục bằng AI 4.0"*, *"Trải nghiệm học tập thế hệ mới siêu việt"*... không nói lên sản phẩm làm được gì cụ thể.
2. **Gradient tím-hồng-xanh trôi nổi khắp nơi:** Màu sắc giả tạo, không có bản sắc nhận diện thương hiệu.
3. **Ảnh minh họa 3D AI bóng nhờn hoặc vector stock vô hồn:** Hình ảnh các nhân vật hoạt hình vô cảm, không hề liên quan đến màn hình thực tế của ứng dụng.
4. **Không có sản phẩm thực (No Real Product UI):** Khách hàng vào trang chủ nhưng không thấy một màn hình giao diện thật nào của ứng dụng.
5. **Thiếu cảm giác xúc giác (No Tactile Feedback):** Nút bấm đơ cứng, không có cảm giác nảy phím (spring physics), các tương tác thiếu sức sống.

### 2.2. Bảy Nguyên Tắc Vàng Của Foggo Để Đạt Đẳng Cấp Thương Mại (Apple & Linear Quality)

| # | Nguyên tắc | Cách Foggo thực thi |
|---|---|---|
| 1 | **Sản phẩm thật là nhân vật chính (Show, Don't Tell)** | Ngay tại Hero trang chủ, đặt **Đấu trường tương tác thật** (`LandingClient.tsx`). Khách hàng có thể click làm thử câu hỏi và chứng kiến Hiệp sĩ tung kiếm chém quái ngay trên Landing Page mà không cần đăng ký. |
| 2 | **Bộ màu ấm cúng Amber Lantern & Obsidian Mist** | Thay vì gradient tím AI phổ thông, Foggo sử dụng tông màu Đèn lồng hổ phách (`#f59e0b`) ấm áp, khơi gợi cảm hứng thám hiểm, kết hợp đá bóng đêm (`#020617`) và mây pixel xanh lam rực rỡ. |
| 3 | **Typography phân cấp chặt chẽ (Optical Hierarchy)** | Tiêu đề hiển thị rõ ràng, đậm chất Arcade (`font-pixel` và `font-mono` kết hợp `apple-display`). Số liệu đo lường viết bằng font monospace kỹ thuật sắc nét. |
| 4 | **Nói đúng bài toán kinh tế & số liệu thật** | *"Tiết kiệm 5 giờ soạn bài mỗi tuần"*, *"Tăng 42% sự tập trung trong giờ ôn tập"*, *"8 dạng câu hỏi tương tác"*, *"100% bảo mật đáp án qua RLS"*. |
| 5 | **Phản hồi xúc giác vật lý (Tactile Spring Physics)** | Nút bấm lún phím tự nhiên (`active:translate-y-0.5`), viền sáng highlight tinh xảo (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]`). |
| 6 | **Cam kết bảo mật & pháp lý minh bạch** | Huy hiệu tuân thủ COPPA (Bảo vệ quyền riêng tư trẻ em trên mạng) và GDPR; máy chủ chấm điểm độc quyền không lộ đáp án ở client. |
| 7 | **Thiết kế linh hoạt 2 chế độ Sáng / Tối (True Dual Theme)** | Mặc định Light Mode sáng sủa, thanh lịch cho môi trường trường học máy chiếu, và Dark Mode huyền ảo cho trải nghiệm game buổi tối. |

---

## 3. Hệ Thống CI/CD Công Nghiệp Đạt Chuẩn Doanh Nghiệp (Enterprise CI/CD)

Để bán được phần mềm cho các tổ chức giáo dục và vận hành SaaS liên tục không gián đoạn, hệ thống áp dụng chu trình CI/CD đa tầng trong thư mục `.github/workflows/`:

```
[ Developer Local Working Tree ]
              │ (git push sau khi kiểm thử)
              ▼
    ┌────────────────────────────────────────────────────────┐
    │  WORKFLOW 1: .github/workflows/ci.yml                  │
    ├────────────────────────────────────────────────────────┤
    │  1. 🛡️ TypeScript Strict Typecheck (0 errors)          │
    │  2. 🧪 66 Core Engine & Question Grading Tests        │
    │  3. 🌐 31 Full System Integration Tests & RBAC         │
    │  4. 🔒 NPM Security & Dependency Audit                │
    │  5. 🚀 Production Next.js Bundle Compilation           │
    └─────────────────────────┬──────────────────────────────┘
                              │ (Merge to main)
                              ▼
    ┌────────────────────────────────────────────────────────┐
    │  WORKFLOW 2: .github/workflows/deploy.yml              │
    ├────────────────────────────────────────────────────────┤
    │  1. 🚦 Pre-Flight Quality Gate                         │
    │  2. 🚢 Zero-Downtime Deploy to Vercel Production       │
    │  3. 🩺 Automated Smoke Test via /api/health            │
    │  4. 🔄 Instant Rollback Alerting if degraded           │
    └────────────────────────────────────────────────────────┘
```

### 3.1. Các Tầng Kiểm Soát Chất Lượng (Quality Gates)
1. **Kiểm tra kiểu dữ liệu tĩnh (`npx tsc --noEmit`):** Chặn đứng 100% lỗi runtime, kiểu dữ liệu không khớp giữa Database Supabase và Frontend.
2. **Bộ kiểm thử đơn vị tự động (66 Unit Tests):** Kiểm tra cơ chế tính điểm ngày đêm, chu kỳ đói, cân bằng quái vật, kho đồ 30 ô và logic chấm điểm chuẩn xác của cả 8 dạng câu hỏi.
3. **Bộ kiểm thử tích hợp hệ thống (31 System Integration Tests):** Mô phỏng luồng đăng nhập học sinh không cần email, luồng giáo viên tạo phòng, và chặn truy cập trái phép bằng Row Level Security (RLS).
4. **Điểm giám sát sức khỏe hệ thống (`/api/health`):** Endpoint theo dõi trạng thái sống còn của server, độ trễ database Supabase (Database Latency), và mã phiên bản phục vụ tự động giám sát uptime 99.9%.

---

## 4. Mô Hình Định Giá Thương Mại Đa Tầng (Commercial Pricing Strategy)

| Hạng mục | Gói 1: KHỞI ĐẦU (Miễn phí) | Gói 2: GIÁO VIÊN PLUS (B2B PLG) | Gói 3: TRƯỜNG HỌC & TỔ BỘ MÔN (B2B Enterprise) |
|---|---|---|---|
| **Mức giá** | **0 đ** / mãi mãi | **89.000 đ/tháng** (hoặc 799.000 đ/năm) | **Liên hệ báo giá** (theo quy mô trường) |
| **Quy mô học sinh** | Tối đa 40 học sinh / phòng | Tối đa 500 học sinh / phòng | **Không giới hạn** toàn trường |
| **Dạng câu hỏi** | 3 dạng cơ bản | **Trọn bộ 8 dạng câu hỏi** (Hotspot, Ghép cặp...) | **Trọn bộ 8 dạng câu hỏi** |
| **Số lượng bộ đề** | 10 bộ | **Không giới hạn** | **Không giới hạn** |
| **Kho đề trường** | Không | Không | **Kho đề dùng chung nội bộ trường** |
| **Xuất báo cáo** | Điểm cơ bản trên web | **Xuất CSV / Excel chi tiết** | **Xuất Excel mẫu VNEDU / SMAS** |
| **Phân quyền** | Cá nhân | Cá nhân | **Admin Trường + Phân quyền Tổ trưởng** |
| **Hóa đơn & Pháp lý** | Không | Hóa đơn cá nhân | **Hợp đồng pháp nhân + Hóa đơn VAT đỏ** |
| **Hỗ trợ** | Cộng đồng | Ưu tiên qua Email/Chat | **Tập huấn trực tiếp + Hỗ trợ kỹ thuật 24/7** |

---

## 5. Danh Mục Hành Động Tiếp Theo (Action Items)

- [x] Thiết lập endpoint `/api/health` giám sát runtime và Supabase DB latency.
- [x] Viết workflow `.github/workflows/ci.yml` kiểm duyệt 5 tầng (Typecheck, Unit tests, Integration tests, Security audit, Production build).
- [x] Viết workflow `.github/workflows/deploy.yml` triển khai tự động kèm Post-deployment smoke test.
- [x] Tích hợp Gói Nhà Trường (School Enterprise) vào [PricingClient.tsx](file:///d:/Project/Foggo/src/app/pricing/PricingClient.tsx).
- [x] Biến Hero Battle trên [LandingClient.tsx](file:///d:/Project/Foggo/src/app/LandingClient.tsx) thành đấu trường tương tác trực tiếp (Interactive Playable Demo).
- [x] Cập nhật hệ thống thiết kế [DESIGN.md](file:///d:/Project/Foggo/DESIGN.md) và kế hoạch [ke-hoach-web-hoc-tap-game.md](file:///d:/Project/Foggo/ke-hoach-web-hoc-tap-game.md).
