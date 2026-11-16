# 🔑 DANH SÁCH TÀI KHOẢN TEST DỰ ÁN FOGGO (TEST ACCOUNTS)
> **Mục đích:** Lưu trữ cục bộ vĩnh viễn thông tin đăng nhập của các tài khoản thử nghiệm dành cho Lập trình viên, AI Agent và Người dùng để kiểm thử nhanh các luồng chức năng thực tế trên Web mà không cần đăng ký lại.

---

## 1. 🎒 TÀI KHOẢN HỌC SINH TEST CHÍNH (STUDENT - TEST)
Tài khoản học sinh test nhanh dùng cho kiểm thử giao diện và đấu trường:

| Thông tin | Giá trị đăng nhập |
|---|---|
| **Hình thức đăng nhập** | Bằng Tên đăng nhập (Username) hoặc Email |
| **Tên đăng nhập (Username)** | `test` |
| **Mật khẩu (Password)** | `12345678` |
| **Email nội bộ** | `test@student.foggo.vn` |
| **Tên hiển thị** | `test` |
| **Vai trò (Role)** | `student` |
| **Trường học** | `THCS LLQ` |
| **Lớp học** | `7A1` |
| **Trạng thái nhân vật** | Đã điểm danh ngày 1, có bãi săn quái và tham gia hầm ngục |

---

## 2. 🎒 TÀI KHOẢN HỌC SINH TỰ ĐỘNG HÓA (STUDENT - HOCSINH_TEST)
Tài khoản dùng cho test kịch bản tự động (`scripts/full-system-test.ts` & `test-account-runner.ts`):

| Thông tin | Giá trị đăng nhập |
|---|---|
| **Hình thức đăng nhập** | Bằng Tên đăng nhập (Username) hoặc Email |
| **Tên đăng nhập (Username)** | `hocsinh_test` |
| **Mật khẩu** | `TestPassword123!` |
| **Email nội bộ** | `hocsinh_test@student.foggo.vn` |
| **Tên hiển thị** | `Học Sinh Test (Thám Hiểm)` |
| **Vai trò (Role)** | `student` |
| **Trường học** | `THCS Lê Quý Đôn` |
| **Lớp học** | `9A1` |

---

## 3. 👨‍🏫 TÀI KHOẢN GIÁO VIÊN TEST (TEACHER)
Tài khoản dùng để kiểm thử luồng giáo viên: tạo bộ câu hỏi 8 dạng bài tương tác, mở hầm ngục lớp học, cấu hình tỉ lệ rơi đồ hiếm.

| Thông tin | Giá trị đăng nhập |
|---|---|
| **Hình thức đăng nhập** | Bằng Email |
| **Email** | `giaovien_test@foggo.vn` |
| **Mật khẩu** | `TestPassword123!` |
| **Tên hiển thị** | `Thầy Giáo Test (Giáo Viên)` |
| **Vai trò (Role)** | `teacher` |
| **Gói dịch vụ** | `plus` (Đã kích hoạt gói Plus đầy đủ tính năng) |

---

## 4. 👑 TÀI KHOẢN QUẢN TRỊ VIÊN HỆ THỐNG (SUPERADMIN)
Tài khoản tối cao có toàn quyền quản lý học sinh, duyệt giáo viên, nâng cấp gói Plus, cấu hình danh mục trường học 63 tỉnh/thành.

| Thông tin | Giá trị đăng nhập |
|---|---|
| **Hình thức đăng nhập** | Bằng Email |
| **Email** | `hoaifongg@gmail.com` |
| **Mật khẩu** | `Admin@123456` |
| **Tên hiển thị** | `Phạm Nguyễn Hoài Phong (Admin)` |
| **Vai trò (Role)** | `admin` (Superadmin tối cao) |
| **Gói dịch vụ** | `plus` |

---

## 5. 🚀 LỆNH KIỂM THỬ TỰ ĐỘNG
Để tự động xác thực tài khoản và kiểm thử toàn diện:
```bash
# 1. Chạy 65 unit tests
npm test

# 2. Chạy 31 integration & system test cases
npx tsx scripts/full-system-test.ts
```
