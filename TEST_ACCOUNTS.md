# 🔑 DANH SÁCH TÀI KHOẢN TEST DỰ ÁN FOGGO (TEST ACCOUNTS)
> **Mục đích:** Lưu trữ vĩnh viễn thông tin đăng nhập của các tài khoản thử nghiệm dành cho Lập trình viên, AI Agent và Người dùng để kiểm thử nhanh các luồng chức năng thực tế trên Web mà không cần đăng ký lại.

---

## 1. 🎒 TÀI KHOẢN HỌC SINH TEST (STUDENT)
Tài khoản dùng để kiểm thử toàn bộ luồng trải nghiệm của học sinh: điểm danh 7 ngày, bãi farm quái tại nhà 24/7, đấu trường đánh quái theo lượt (RPG Arena), mua đồ thợ rèn, mặc giáp/vũ khí, và tham gia hầm ngục lớp học.

| Thông tin | Giá trị đăng nhập |
|---|---|
| **Hình thức đăng nhập** | Bằng Tên đăng nhập (Username) hoặc Email |
| **Tên đăng nhập (Username)** | `hocsinh_test` |
| **Mật khẩu** | `TestPassword123!` |
| **Email nội bộ** | `hocsinh_test@student.foggo.vn` |
| **Tên hiển thị** | `Học Sinh Test (Thám Hiểm)` |
| **Vai trò (Role)** | `student` (Tự động ẩn quản trị và tạo bộ đề) |
| **Trường học** | `THCS Lê Quý Đôn` |
| **Lớp học** | `9A1` |
| **Trạng thái nhân vật** | Đã có sẵn Bãi Farm Quái Solo, trang bị Kiếm Gỗ, Áo Vải, Táo và Bình máu |

---

## 2. 👨‍🏫 TÀI KHOẢN GIÁO VIÊN TEST (TEACHER)
Tài khoản dùng để kiểm thử luồng giáo viên: tạo bộ câu hỏi với 8 dạng bài tương tác, tải lên Excel, mở hầm ngục lớp học, cấu hình tỉ lệ rơi đồ hiếm và theo dõi tiến trình trực tiếp.

| Thông tin | Giá trị đăng nhập |
|---|---|
| **Hình thức đăng nhập** | Bằng Email |
| **Email** | `giaovien_test@foggo.vn` |
| **Mật khẩu** | `TestPassword123!` |
| **Tên hiển thị** | `Thầy Giáo Test (Giáo Viên)` |
| **Vai trò (Role)** | `teacher` |
| **Gói dịch vụ** | `plus` (Đã kích hoạt gói Plus đầy đủ tính năng) |

---

## 3. 👑 TÀI KHOẢN QUẢN TRỊ VIÊN HỆ THỐNG (SUPERADMIN)
Tài khoản tối cao có toàn quyền quản lý học sinh, duyệt giáo viên, nâng cấp gói Plus, cấu hình toàn bộ hệ thống.

| Thông tin | Giá trị đăng nhập |
|---|---|
| **Email** | `hoaifongg@gmail.com` |
| **Vai trò (Role)** | `admin` (Superadmin tối cao) |

---

## 4. 🚀 LỆNH KIỂM THỬ TỰ ĐỘNG
Để tự động xác thực tài khoản và mô phỏng luồng gameplay RPG (săn quái, mua trang bị thợ rèn, mặc đồ, ghi nhận DB), chạy lệnh:
```bash
npx tsx scripts/test-account-runner.ts
```
Script này tự động:
1. Xác minh tài khoản học sinh `hocsinh_test` và giáo viên `giaovien_test@foggo.vn`.
2. Đăng nhập và xác thực access_token.
3. Chạy mô phỏng săn quái Slime, kiểm tra sát thương, chuỗi streak và cộng Xu.
4. Mua trang bị tại Thợ Rèn và tự động mặc trang bị vào người.
5. Đồng bộ tiến trình chơi vào PostgreSQL Supabase.
