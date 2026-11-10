# FOGGO: KẾ HOẠCH XÂY DỰNG WEB HỌC TẬP DẠNG GAME SINH TỒN

> **Tên sản phẩm: Foggo** (đọc "fô-gô"). Ghép từ *fog* (sương mù) + *go* (tiến lên): học sinh bị bỏ vào một hòn đảo phủ sương mù, **trả lời đúng để tan sương, tiến lên và sống sót**.
>
> | Hạng mục | Quyết định |
> |---|---|
> | Khẩu hiệu gợi ý | "Tan sương, tiến lên!" · "Trả lời đúng, tan sương mù." |
> | Linh vật | **Gô**, chú cáo nhỏ cầm đèn lồng (đèn sáng dần khi sương tan) |
> | Tiền trong ván | **Xu** (mục 5A.6) |
> | Tiền ngoài ván (kiếm sau mỗi ván, mua skin) | **Đom Đóm** (cột `fireflies` trong database), thay cho `tokens` |
> | Nhân vật phụ gợi ý | Thương nhân **Cô Túi**, Thợ rèn **Bác Búa** (tự đặt lại nếu muốn) |
> | Tên miền dự kiến | `foggo.com` / `foggo.vn` (**chưa xác nhận còn trống**, cần kiểm tra trước khi dùng) |
> | Việc cần làm trước khi đầu tư thương hiệu | Kiểm tra tên miền, tên trên App Store/Google Play, tên trang mạng xã hội, tra nhãn hiệu trên hệ thống của Cục Sở hữu trí tuệ. Lưu ý đã thấy một nhà phát triển game indie tên *foggo* trên itch.io. Đây không phải tư vấn pháp lý, nên tham khảo người am hiểu nếu kinh doanh |

> Stack: **Next.js + Supabase + GitHub + Vercel**
> Điểm nổi bật: thêm các dạng câu hỏi mới (chọn nhiều đáp án, kéo thả, chọn vùng trên ảnh, đúng/sai) và các tính năng "Plus" nâng cao.

---

## MỤC LỤC

1. [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm)
2. [Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
3. [Kiến trúc hệ thống](#3-kiến-trúc-hệ-thống)
   - 3A. [Chức năng đăng nhập và xác thực](#3a-chức-năng-đăng-nhập-và-xác-thực-authentication)
4. [Các dạng câu hỏi](#4-các-dạng-câu-hỏi)
5. [Chế độ chơi (Game modes)](#5-chế-độ-chơi-game-modes)
   - 5A. [**Chế độ chính: Sinh tồn tri thức**](#5a-chế-độ-chính-sinh-tồn-tri-thức-survival-quiz)
   - 5B. [**Vào chơi không cần mã PIN: mô hình Thế giới**](#5b-vào-chơi-không-cần-mã-pin-mô-hình-thế-giới)
6. [Thiết kế database (Supabase)](#6-thiết-kế-database-supabase)
7. [Bảo mật và Row Level Security](#7-bảo-mật-và-row-level-security)
8. [Realtime: luồng chơi game](#8-realtime-luồng-chơi-game)
9. [Cấu trúc thư mục dự án](#9-cấu-trúc-thư-mục-dự-án)
10. [Gói Free / Plus và thanh toán](#10-gói-free--plus-và-thanh-toán)
11. [Lộ trình theo giai đoạn](#11-lộ-trình-theo-giai-đoạn)
12. [Thiết lập GitHub + Vercel + Supabase](#12-thiết-lập-github--vercel--supabase)
13. [Kiểm thử](#13-kiểm-thử)
14. [Chi phí dự kiến](#14-chi-phí-dự-kiến)
15. [Rủi ro và lưu ý pháp lý](#15-rủi-ro-và-lưu-ý-pháp-lý)
16. [Checklist tổng](#16-checklist-tổng)

---

## 1. Tổng quan sản phẩm

### 1.1. Mục tiêu
Một nền tảng học tập qua trò chơi, nơi:
- **Giáo viên/người tạo** tạo bộ câu hỏi (Question Set) và mở **Thế giới** cho lớp (hoặc chia sẻ link/QR).
- **Học sinh/người chơi** vào thế giới từ trang lớp hoặc bằng link/QR (**không cần mã PIN**), trả lời câu hỏi để sinh tồn, đánh quái, chế tạo; nhân vật được **lưu lại** giữa các lần chơi.
- Có bảng xếp hạng, báo cáo kết quả, và hệ thống phần thưởng (Đom Đóm, avatar).

### 1.2. Đối tượng người dùng

| Vai trò | Mô tả | Cần đăng nhập? |
|---|---|---|
| Khách (Guest) | Mở link/QR giáo viên chia sẻ + nhập tên để chơi (nếu giáo viên cho phép) | Không |
| Học sinh | Có tài khoản, lưu Đom Đóm, avatar, lịch sử | Có |
| Giáo viên | Tạo bộ câu hỏi, tạo Thế giới cho lớp, mở sự kiện, xem báo cáo | Có |
| Admin | Quản trị hệ thống, kiểm duyệt | Có |

### 1.3. Điểm khác biệt (USP)
Bốn dạng câu hỏi mới so với Blooket gốc:
1. **Chọn nhiều đáp án** cùng lúc (Multiple Select)
2. **Kéo thả** (Drag & Drop: sắp xếp thứ tự, ghép cặp, điền chỗ trống)
3. **Chọn vùng đúng trên ảnh** (Hotspot)
4. **Đúng / Sai** (True/False, có thể mở rộng nhiều mệnh đề)

**Khác biệt về cách chơi:** đảo phủ sương mù mở dần theo câu trả lời (mục 5A.21), không mã PIN, thế giới lưu lâu dài nhiều ngày, game sinh tồn thống nhất thay cho các mini-game rời rạc (so sánh chi tiết ở mục 5B.8).

### 1.4. Phạm vi MVP (bản đầu tiên)
- Đăng ký / đăng nhập: email + mật khẩu, Google, chơi với tư cách khách, **và học sinh đăng ký chỉ bằng tên đăng nhập + mật khẩu + trường + lớp (không cần email)**
- Tạo / sửa / xóa bộ câu hỏi với **đủ 6 dạng câu hỏi** (4 cơ bản + 4 mới)
- **Thế giới của lớp** + vào chơi từ trang lớp hoặc link/QR (**không dùng mã PIN**, mục 5B)
- **Chế độ chơi chính: Sinh tồn tri thức (Solo)** — trả lời câu hỏi để đánh quái, hái lượm, chế tạo; nhận xu hoặc vật phẩm; sống sót qua ngày đêm (xem mục 5A). Kèm tùy chọn "Yên bình" để ôn tập
- Bảng xếp hạng trực tiếp + báo cáo cuối game
- Triển khai trên Vercel

Những thứ để **sau MVP**: thanh toán Plus, nhiều game mode, marketplace bộ câu hỏi, AI tạo câu hỏi...

---

## 2. Công nghệ sử dụng

### 2.1. Bảng công nghệ

| Lớp | Công nghệ | Lý do chọn |
|---|---|---|
| Framework | **Next.js 14/15 (App Router) + TypeScript** | Chạy tốt nhất trên Vercel, SSR + API routes |
| Giao diện | **Tailwind CSS + shadcn/ui** | Dựng UI nhanh, đẹp, dễ tùy biến |
| Animation | **Framer Motion** | Hiệu ứng game mượt |
| Kéo thả | **@dnd-kit/core** | Nhẹ, hỗ trợ cảm ứng (điện thoại) tốt |
| Hotspot | **HTML5 Canvas / SVG** + `react-konva` (tùy chọn) | Vẽ vùng đa giác/hình chữ nhật/tròn trên ảnh |
| State | **Zustand** | Đơn giản cho state game phía client |
| Form | **React Hook Form + Zod** | Validate dữ liệu câu hỏi |
| Database | **Supabase Postgres** | Có sẵn Auth, Realtime, Storage |
| Auth | **Supabase Auth** | Email + Google, anonymous sign-in cho guest |
| Realtime | **Supabase Realtime** (Broadcast + Presence) | Bảng xếp hạng, sự kiện lớp giữa giáo viên và người chơi (kênh riêng tư) |
| Lưu ảnh | **Supabase Storage** | Ảnh câu hỏi, avatar |
| Thanh toán | **Stripe** hoặc **PayOS / SePay / VNPay** | Xem mục 10 |
| Hosting | **Vercel** | Deploy tự động từ GitHub |
| Mã nguồn | **GitHub** | Quản lý version, CI |
| Giám sát lỗi | **Sentry** (tùy chọn) | Bắt lỗi production |
| Phân tích | **Vercel Analytics / PostHog** (tùy chọn) | Theo dõi người dùng |

### 2.2. Công cụ phát triển
- Node.js 20+, pnpm (hoặc npm)
- Supabase CLI (chạy local + quản lý migration)
- VS Code (hoặc Cursor) + ESLint + Prettier
- Postman / Thunder Client để test API

---

## 3. Kiến trúc hệ thống

```
┌─────────────────┐        ┌──────────────────────────────┐
│  Trình duyệt    │        │          VERCEL              │
│ (GV / Học sinh) │◄──────►│  Next.js (SSR + API Routes)  │
└────────┬────────┘        │  Server Actions / Webhooks   │
         │                 └──────────────┬───────────────┘
         │ WebSocket (Realtime)           │ service_role key
         │                                │ (chỉ chạy phía server)
         ▼                                ▼
┌──────────────────────────────────────────────────────────┐
│                      SUPABASE                            │
│  Auth │ Postgres (RLS) │ Realtime │ Storage │ Edge Fn    │
└──────────────────────────────────────────────────────────┘
         ▲
         │ Webhook
┌────────┴────────┐
│ Stripe / PayOS  │
└─────────────────┘
```

### 3.1. Nguyên tắc kiến trúc quan trọng
1. **Chấm điểm phải làm ở server**, KHÔNG làm ở client. Nếu gửi đáp án đúng xuống trình duyệt người chơi thì họ có thể mở DevTools xem và gian lận.
2. **Server là "nguồn sự thật"** cho trạng thái game (HP, túi đồ, đồng hồ chơi...), không phụ thuộc giáo viên có đang online; Realtime chỉ dùng để thông báo bảng xếp hạng và sự kiện.
3. **Người chơi gửi đáp án qua API** (Server Action / Route Handler), server chấm rồi lưu vào DB, sau đó trả kết quả.
4. Dùng **RLS** cho mọi bảng; chỉ dùng `service_role` ở server khi thật sự cần.

### 3.2. Hai cách đồng bộ game (chọn 1)

| Cách | Mô tả | Ưu | Nhược |
|---|---|---|---|
| **A. Broadcast + API (khuyến nghị)** | Server phát sự kiện qua Broadcast; người chơi gửi đáp án qua API | Nhanh, ít tốn DB write | Cần xử lý reconnect |
| **B. Postgres Changes** | Mọi thay đổi ghi vào DB, client subscribe | Đơn giản, dễ khôi phục trạng thái | Chậm hơn, tốn quota hơn |

→ **Khuyến nghị:** Kết hợp. Trạng thái chính (phase, câu hiện tại) lưu trong bảng `game_sessions` (để reconnect khôi phục được), còn các sự kiện nhanh (đếm ngược, bảng điểm) dùng Broadcast.

---

## 3A. Chức năng đăng nhập và xác thực (Authentication)

Dùng **Supabase Auth** kết hợp thư viện `@supabase/ssr` để phiên đăng nhập hoạt động tốt cả ở trình duyệt, Server Components, Server Actions và Middleware của Next.js.

### 3A.1. Các phương thức đăng nhập

| # | Phương thức | Dành cho | Gói | Ghi chú |
|---|---|---|---|---|
| 1 | **Email + mật khẩu** | Giáo viên, học sinh | MVP | Bắt buộc xác nhận email |
| 2 | **Google (OAuth)** | Giáo viên, học sinh | MVP | Tiện nhất, nhiều học sinh có tài khoản Google trường |
| 3 | **Khách (Anonymous)** | Người chơi vào thế giới bằng link/QR | MVP | Không cần đăng ký, chỉ nhập nickname; giáo viên phải bật "cho phép khách" |
| 4 | **Magic Link (email không mật khẩu)** | Mọi người | V2 | Tùy chọn, giảm chuyện quên mật khẩu |
| 5 | **Facebook / Microsoft / Apple** | Mọi người | V2 | Microsoft hữu ích cho trường dùng Office 365; Apple bắt buộc nếu sau này có app iOS có đăng nhập mạng xã hội |
| 6 | **Tên đăng nhập + mật khẩu + trường + lớp (KHÔNG cần email)** | Học sinh | **MVP** | Xem mục **3A.13** |
| 7 | **Tài khoản do giáo viên tạo hàng loạt** | Học sinh nhỏ tuổi | V2 | Xem mục 3A.9 và 3A.13.7 |

### 3A.2. Các trang và route cần làm

| Route | Chức năng | Ai truy cập |
|---|---|---|
| `/login` | Đăng nhập (email/mật khẩu, Google, magic link) | Chưa đăng nhập |
| `/register` | Đăng ký + chọn vai trò (Học sinh / Giáo viên) | Chưa đăng nhập |
| `/register/student` | Đăng ký học sinh **không cần email**: tên đăng nhập, mật khẩu, trường, lớp (mục 3A.13) | Chưa đăng nhập |
| `/register/recovery-code` | Hiện **mã khôi phục** một lần sau khi đăng ký | Vừa đăng ký |
| `/forgot-password/username` | Khôi phục bằng tên đăng nhập + mã khôi phục | Chưa đăng nhập |
| `/change-password` | Bắt buộc đổi mật khẩu (sau khi giáo viên đặt lại) | Đã đăng nhập |
| `/verify-email` | Thông báo "hãy kiểm tra email" + nút gửi lại | Vừa đăng ký |
| `/forgot-password` | Nhập email để nhận link đặt lại mật khẩu | Chưa đăng nhập |
| `/reset-password` | Nhập mật khẩu mới (từ link trong email) | Có token khôi phục |
| `/auth/callback` | Route xử lý OAuth và xác nhận email (đổi `code` lấy session) | Hệ thống |
| `/auth/confirm` | Route xác nhận OTP/token hash từ email | Hệ thống |
| `/onboarding` | Hoàn tất hồ sơ lần đầu (username, vai trò, avatar) | Mới đăng nhập |
| `/settings/account` | Đổi tên, avatar, email, mật khẩu, xóa tài khoản | Đã đăng nhập |
| `/logout` | Đăng xuất (POST) | Đã đăng nhập |

### 3A.3. Luồng xử lý

**Đăng ký bằng email:**
```
1. Người dùng điền form (email, mật khẩu, vai trò, đồng ý điều khoản)
2. supabase.auth.signUp({ email, password, options: { data: { role }, emailRedirectTo } })
3. Supabase gửi email xác nhận → người dùng bấm link
4. /auth/confirm đổi token lấy session → chuyển tới /onboarding
5. Trigger handle_new_user đã tạo sẵn dòng trong bảng profiles
6. Người dùng hoàn tất onboarding (username, avatar) → vào /dashboard
```

**Đăng nhập bằng Google:**
```
1. Bấm "Đăng nhập với Google" → signInWithOAuth({ provider: 'google', redirectTo: .../auth/callback })
2. Google xác thực → quay về /auth/callback?code=...
3. exchangeCodeForSession(code) → có session
4. Nếu profile chưa có username → /onboarding, ngược lại → /dashboard
```

**Người chơi khách:**
```
1. Mở link/QR giáo viên chia sẻ (/j/<token>), nhập nickname
2. Nếu chưa có session → supabase.auth.signInAnonymously()
3. Gọi API join phòng với user_id của phiên ẩn danh
4. Sau game, hiện lời mời "Tạo tài khoản để lưu điểm và Đom Đóm"
5. Nếu đăng ký → nâng cấp tài khoản ẩn danh thành tài khoản thật bằng
   supabase.auth.updateUser({ email, password }) hoặc linkIdentity('google')
   (giữ nguyên user_id nên lịch sử chơi không bị mất)
```

**Quên mật khẩu:**
```
1. /forgot-password → resetPasswordForEmail(email, { redirectTo: .../reset-password })
2. Người dùng bấm link trong email → /reset-password
3. updateUser({ password: mậtKhẩuMới }) → đăng xuất các phiên cũ (tùy chọn) → /login
```
Luôn hiển thị thông báo chung "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn" để không lộ email nào đã đăng ký.

### 3A.4. Code mẫu (Next.js App Router + `@supabase/ssr`)

**`src/lib/supabase/client.ts`** (dùng trong Client Components)
```ts
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

**`src/lib/supabase/server.ts`** (dùng trong Server Components / Actions / Route Handlers)
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* gọi từ Server Component: bỏ qua, middleware sẽ làm mới session */
          }
        },
      },
    }
  );
}
```

**`src/middleware.ts`** (làm mới session + bảo vệ route)
```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/teacher", "/settings", "/onboarding"];
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Dùng getUser() (xác thực với server), KHÔNG dùng getSession() để quyết định quyền truy cập
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isAnonymous = user?.is_anonymous ?? false;

  const needsAuth = PROTECTED.some((p) => path.startsWith(p));
  if (needsAuth && (!user || isAnonymous)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && !isAnonymous && AUTH_PAGES.includes(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)"],
};
```

**`src/app/(auth)/actions.ts`** (Server Actions)
```ts
"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Tối thiểu 8 ký tự"),
  role: z.enum(["student", "teacher"]),
  acceptTerms: z.literal("on"),
});

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { role: parsed.data.role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });
  if (error) return { error: "Không thể đăng ký. Vui lòng thử lại." };
  redirect("/verify-email");
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) return { error: "Email hoặc mật khẩu không đúng" };
  redirect(String(formData.get("next") || "/dashboard"));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
```

**`src/app/auth/callback/route.ts`** (OAuth)
```ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Chỉ cho phép chuyển hướng nội bộ để tránh open redirect
      const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${safe}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

**Nút Google (Client Component)**
```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton() {
  const signIn = () =>
    createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  return <button onClick={signIn}>Đăng nhập với Google</button>;
}
```

### 3A.5. Cập nhật database cho phần đăng nhập

```sql
-- Bổ sung cột cho profiles
alter table public.profiles
  add column if not exists onboarded boolean not null default false,
  add column if not exists birth_year integer,
  add column if not exists locale text default 'vi',
  add column if not exists last_seen_at timestamptz;

-- Username: chỉ chữ thường, số, gạch dưới, 3-20 ký tự
alter table public.profiles
  add constraint username_format
  check (username is null or username ~ '^[a-z0-9_]{3,20}$');

-- Cập nhật trigger: lấy role từ metadata nhưng CHỈ cho phép student/teacher
-- (không bao giờ cho phép người dùng tự đặt role = 'admin' khi đăng ký)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested_role text := new.raw_user_meta_data->>'role';
begin
  insert into public.profiles (id, display_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',
             new.raw_user_meta_data->>'name', 'Người chơi'),
    new.raw_user_meta_data->>'avatar_url',
    case when requested_role in ('student','teacher') then requested_role else 'student' end
  );
  return new;
end; $$;

-- Chặn người dùng tự đổi role / plan / fireflies từ client
-- (policy "profiles_update_own" ở mục 7 đã khóa plan; mở rộng khóa cả role và fireflies)
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role   = (select role   from public.profiles where id = auth.uid())
    and plan   = (select plan   from public.profiles where id = auth.uid())
    and fireflies = (select fireflies from public.profiles where id = auth.uid())
  );
```

> Lưu ý: người dùng ẩn danh (guest) vẫn có dòng trong `auth.users`, nên trigger cũng sẽ tạo profile cho họ. Có thể thêm cột `is_guest` hoặc dọn dẹp định kỳ các tài khoản ẩn danh cũ (ví dụ xóa sau 30 ngày không hoạt động) bằng cron.

### 3A.6. Cấu hình trong Supabase Dashboard

- [ ] **Authentication → Providers:** bật *Email*, bật *Google* (cần tạo OAuth Client ID ở Google Cloud Console; thêm Authorized redirect URI do Supabase cung cấp, dạng `https://<project-ref>.supabase.co/auth/v1/callback`).
- [ ] Bật **Anonymous sign-ins**.
- [ ] **Confirm email:** BẬT (bắt buộc xác nhận email trước khi đăng nhập).
- [ ] **URL Configuration:**
  - *Site URL*: URL production (ví dụ `https://foggo.com`).
  - *Redirect URLs*: thêm `http://localhost:3000/**`, URL production, và URL preview của Vercel (dạng wildcard `https://*-<ten-team>.vercel.app/**`).
- [ ] **Email Templates:** chỉnh nội dung email xác nhận, đặt lại mật khẩu, magic link sang **tiếng Việt**, gắn logo.
- [ ] **SMTP tùy chỉnh (rất quan trọng):** Email mặc định của Supabase bị giới hạn số lượng gửi rất thấp và chỉ phù hợp để thử nghiệm. Hãy cấu hình SMTP riêng (ví dụ Resend, SendGrid, Brevo, Amazon SES) và dùng tên miền riêng (thiết lập SPF/DKIM/DMARC) để email không vào spam.
- [ ] **Password policy:** đặt độ dài tối thiểu 8, yêu cầu chữ + số; bật *leaked password protection* nếu gói của bạn hỗ trợ.
- [ ] **Bot protection:** bật CAPTCHA (Cloudflare Turnstile hoặc hCaptcha) cho đăng ký / đăng nhập / đăng nhập ẩn danh, vì ẩn danh rất dễ bị lạm dụng tạo hàng loạt.
- [ ] **Rate limits:** xem lại giới hạn số lần đăng nhập, gửi email, xác minh OTP trong *Authentication → Rate Limits*.
- [ ] **Session:** đặt thời hạn phiên và thời gian refresh token hợp lý (một số tùy chọn này tùy gói dịch vụ).

### 3A.7. Phân quyền theo vai trò (RBAC)

| Hành động | Khách | Học sinh | Giáo viên | Admin |
|---|---|---|---|---|
| Vào thế giới bằng link/QR (khách: nếu giáo viên cho phép) | ✅ | ✅ | ✅ | ✅ |
| Xem bộ câu hỏi công khai | ✅ | ✅ | ✅ | ✅ |
| Lưu Đom Đóm / avatar / lịch sử | ❌ | ✅ | ✅ | ✅ |
| Tạo bộ câu hỏi | ❌ | ✅ (giới hạn) | ✅ | ✅ |
| Tạo thế giới / mở sự kiện lớp | ❌ | ❌ (hoặc tùy chọn) | ✅ | ✅ |
| Xem báo cáo lớp | ❌ | ❌ | ✅ | ✅ |
| Kiểm duyệt, khóa tài khoản | ❌ | ❌ | ❌ | ✅ |

Triển khai ở **3 lớp**: (1) middleware chặn route, (2) kiểm tra trong Server Action/API, (3) RLS trong database. Không tin kiểm tra ở giao diện.

Helper kiểm tra quyền ở server:
```ts
// src/lib/auth.ts
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser(roles?: Array<"student"|"teacher"|"admin">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.is_anonymous) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/onboarding");
  if (roles && !roles.includes(profile.role)) redirect("/dashboard");
  return { user, profile };
}
```

### 3A.8. Trang cài đặt tài khoản

- Đổi tên hiển thị, username (kiểm tra trùng), avatar.
- Đổi mật khẩu (yêu cầu nhập mật khẩu cũ hoặc đăng nhập lại gần đây).
- Đổi email (gửi xác nhận cho email mới).
- Liên kết / hủy liên kết Google (`linkIdentity` / `unlinkIdentity`), không cho hủy nếu đó là phương thức đăng nhập duy nhất.
- Danh sách thiết bị / phiên đang đăng nhập và nút "Đăng xuất khỏi tất cả thiết bị" (`signOut({ scope: 'global' })`).
- **Xóa tài khoản:** xác nhận bằng mật khẩu hoặc gõ chữ xác nhận; xóa qua API server dùng `service_role` (`auth.admin.deleteUser`), các bảng đã đặt `on delete cascade`. Đây cũng là yêu cầu bảo vệ dữ liệu cá nhân.
- **Xuất dữ liệu cá nhân** (tùy chọn nhưng nên có).

### 3A.9. Học sinh nhỏ tuổi và tài khoản do giáo viên tạo (giai đoạn sau)

> Phần đăng ký học sinh bằng tên đăng nhập (không email) đã được thiết kế đầy đủ ở **mục 3A.13** và làm ngay từ MVP. Mục này chỉ còn phần giáo viên tạo hàng loạt.

Nhiều học sinh tiểu học không có email. Hai hướng xử lý:

1. **Chơi khách + nickname** (đã có ở MVP): đơn giản nhất, không lưu dữ liệu lâu dài.
2. **Lớp học + tài khoản do giáo viên cấp:**
   - Giáo viên tạo lớp (bảng `classes`, `class_members`) và nhận **mã lớp**.
   - Giáo viên tạo hàng loạt tài khoản học sinh: username + mật khẩu ban đầu.
   - Triển khai bằng cách dùng email giả dạng `username.malop@students.foggo.com` (không gửi email thật) và tạo bằng `auth.admin.createUser` ở server (`email_confirm: true`).
   - Học sinh đăng nhập bằng username + mật khẩu, giáo viên có thể đặt lại mật khẩu cho học sinh.

Ngoài ra: nếu người dùng dưới độ tuổi quy định, cần có cơ chế xin **sự đồng ý của phụ huynh/nhà trường** và thu thập ít dữ liệu nhất (xem mục 15).

### 3A.10. Bảo mật riêng cho đăng nhập

- [ ] Luôn dùng `supabase.auth.getUser()` ở server để xác thực, **không** dùng `getSession()` làm căn cứ phân quyền.
- [ ] Cookie phiên là `httpOnly`, `secure`, `sameSite=lax` (do `@supabase/ssr` xử lý); chỉ chạy HTTPS ở production.
- [ ] Chống **open redirect** ở tham số `next` (chỉ nhận đường dẫn nội bộ, như code mẫu).
- [ ] Thông báo lỗi chung chung, không tiết lộ email có tồn tại hay không.
- [ ] Giới hạn số lần đăng nhập sai và số email gửi (Supabase rate limits + Upstash Ratelimit cho các API riêng của bạn).
- [ ] CAPTCHA cho đăng ký, đăng nhập ẩn danh, quên mật khẩu.
- [ ] Không bao giờ để `role` do client tự quyết định khi cập nhật hồ sơ (đã khóa bằng RLS ở 3A.5).
- [ ] Không log mật khẩu, token trong console/Sentry.
- [ ] (V2) Xác thực hai lớp **MFA (TOTP)** cho tài khoản giáo viên/admin: Supabase hỗ trợ `auth.mfa.*`.
- [ ] (V2) Gửi email thông báo khi có đăng nhập từ thiết bị mới hoặc khi đổi mật khẩu/email.

### 3A.11. Kiểm thử đăng nhập

- [ ] Đăng ký email → nhận email xác nhận → xác nhận → vào onboarding.
- [ ] Đăng ký trùng email → thông báo hợp lý.
- [ ] Đăng nhập sai mật khẩu nhiều lần → bị giới hạn.
- [ ] Đăng nhập Google lần đầu (tạo profile) và lần sau (không tạo trùng).
- [ ] Quên mật khẩu → link hết hạn / link dùng lại lần 2 → xử lý đúng.
- [ ] F5, đóng/mở tab, hết hạn token → phiên tự làm mới.
- [ ] Khách chơi xong → nâng cấp thành tài khoản → lịch sử còn nguyên.
- [ ] Người chưa đăng nhập truy cập `/dashboard` → chuyển về `/login?next=/dashboard`, đăng nhập xong quay lại đúng trang.
- [ ] Học sinh cố gọi API tạo thế giới / gửi `update profiles set role='admin'` → bị từ chối.
- [ ] Đăng nhập trên điện thoại (Safari iOS, Chrome Android), kể cả trình duyệt trong app (Zalo, Facebook): **Google OAuth thường bị chặn trong WebView** của các app này, cần hiển thị cảnh báo "Hãy mở bằng Chrome/Safari".

### 3A.12. Việc cần làm theo giai đoạn

| Giai đoạn | Việc đăng nhập |
|---|---|
| **1 (Nền tảng)** | Cấu hình Supabase Auth, middleware, đăng ký/đăng nhập email, Google, đăng xuất, xác nhận email, quên/đặt lại mật khẩu, onboarding, SMTP riêng; **đăng ký học sinh không cần email (tên đăng nhập + trường + lớp), mã khôi phục** (3A.13.12 bước 1–5) |
| **3 (Chơi game)** | Đăng nhập ẩn danh cho khách, nâng cấp khách thành tài khoản |
| **6 (Báo cáo)** | Trang cài đặt tài khoản đầy đủ, xóa tài khoản; **quản lý lớp cho giáo viên (mã lớp, duyệt học sinh, đặt lại mật khẩu, tạo hàng loạt), trang admin duyệt trường** (3A.13.12 bước 6–8) |
| **8 (Hoàn thiện)** | CAPTCHA, rate limit, rà soát bảo mật, email thông báo |
| **Sau ra mắt** | MFA cho giáo viên, Microsoft/Apple/Facebook, lớp học và tài khoản do giáo viên tạo |

### 3A.13. Đăng ký KHÔNG CẦN EMAIL (tên đăng nhập + mật khẩu + trường + lớp)

> Dành cho **học sinh**. Giáo viên vẫn nên dùng email hoặc Google (cần khôi phục tài khoản, nhận hóa đơn thanh toán).

#### 3A.13.1. Vấn đề kỹ thuật và cách giải quyết

Supabase Auth chỉ hỗ trợ đăng nhập bằng **email** hoặc **số điện thoại**, không có sẵn "username + mật khẩu". Cách làm phổ biến: **tạo email nội bộ giả từ tên đăng nhập**, người dùng không bao giờ nhìn thấy nó.

```
Người dùng gõ:   tên đăng nhập = "minh_8a1"
Hệ thống dùng:   email nội bộ   = "minh_8a1@accounts.foggo.com"
```

Quy tắc bắt buộc:
- Dùng **tên miền bạn sở hữu** (hoặc miền con) cho email nội bộ để không ai khác nhận được thư gửi đến địa chỉ đó. **Không cấu hình MX** cho miền con này.
- Tạo tài khoản bằng **server (admin API)** với `email_confirm: true`, KHÔNG cho client gọi `signUp` trực tiếp bằng email giả (vì sẽ chờ xác nhận mãi và Supabase sẽ cố gửi email).
- **Không bao giờ** gửi email tới địa chỉ nội bộ. Ẩn mọi chức năng "quên mật khẩu qua email" với loại tài khoản này.
- **Tên đăng nhập cố định**, không cho đổi sau khi tạo (vì nó gắn với email nội bộ). Muốn đổi thì chỉ qua admin/giáo viên, hoặc cho đổi `display_name` thay thế.
- Lưu `auth_type = 'username'` trong `profiles` để phân biệt với tài khoản email/Google.

#### 3A.13.2. Form đăng ký

| Trường | Bắt buộc | Quy tắc |
|---|---|---|
| Tên đăng nhập | ✅ | 3–20 ký tự, chỉ `a-z`, `0-9`, `_`; không phân biệt hoa/thường; duy nhất toàn hệ thống; chặn từ cấm (`admin`, `support`, từ tục...) |
| Mật khẩu | ✅ | Tối thiểu 8 ký tự, tối đa 72; kiểm tra không quá phổ biến (`12345678`, `password`...); không trùng tên đăng nhập |
| Nhập lại mật khẩu | ✅ | Phải khớp |
| Tên hiển thị | ✅ | Tên/biệt danh dùng khi chơi (lọc từ không phù hợp) |
| Trường | ✅ | Chọn tỉnh/thành → tìm trường (gõ tự động gợi ý); không có thì "Thêm trường mới" |
| Lớp | ✅ | Chọn lớp có sẵn của trường, hoặc nhập mới (ví dụ `8A1`, kèm khối lớp) |
| Mã lớp của giáo viên | ❌ | Nếu có: tự động vào đúng lớp của giáo viên (xem 3A.13.7) |
| Đồng ý điều khoản | ✅ | Có điều khoản riêng cho học sinh; nếu dưới độ tuổi quy định thì cần xác nhận của phụ huynh/nhà trường (xem 3A.13.9) |

**Vai trò luôn là `student`.** Form này không có lựa chọn "Giáo viên", và server tự gán `role = 'student'`, bỏ qua mọi giá trị `role` do client gửi lên.

#### 3A.13.3. Thiết kế database cho Trường và Lớp

```sql
create extension if not exists unaccent;
create extension if not exists pg_trgm;

-- ============ TRƯỜNG ============
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text not null,                 -- Tỉnh/Thành phố
  district text,
  level text check (level in ('tieu_hoc','thcs','thpt','khac')),
  name_search text generated always as (lower(unaccent(name))) stored,
  status text not null default 'pending'
    check (status in ('verified','pending','rejected')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create unique index schools_unique on public.schools (name_search, province);
create index schools_search on public.schools using gin (name_search gin_trgm_ops);

-- ============ LỚP ============
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,                     -- "8A1"
  grade integer check (grade between 1 and 12),
  school_year text not null,              -- "2025-2026"
  teacher_id uuid references public.profiles(id),   -- null nếu chưa có giáo viên nhận lớp
  join_code char(8),                      -- giáo viên chia sẻ cho học sinh
  created_at timestamptz not null default now()
);
create unique index classes_unique on public.classes (school_id, lower(name), school_year);
create unique index classes_join_code on public.classes (join_code) where join_code is not null;

-- ============ THÀNH VIÊN LỚP ============
create table public.class_members (
  class_id uuid references public.classes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','approved')),
  joined_via text not null default 'self' check (joined_via in ('self','code','teacher')),
  created_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

-- ============ BỔ SUNG PROFILES ============
alter table public.profiles
  add column if not exists auth_type text not null default 'email'
    check (auth_type in ('email','username','google')),
  add column if not exists school_id uuid references public.schools(id),
  add column if not exists class_id uuid references public.classes(id),
  add column if not exists recovery_code_hash text,
  add column if not exists must_change_password boolean not null default false;

-- Tên đăng nhập không phân biệt hoa/thường (mã hóa luôn lưu chữ thường)
create unique index if not exists profiles_username_lower
  on public.profiles (lower(username));

alter table public.schools        enable row level security;
alter table public.classes        enable row level security;
alter table public.class_members  enable row level security;

-- Ai cũng tìm được trường đã xác minh (để chọn khi đăng ký); người tạo thấy trường của mình
create policy "schools_select" on public.schools
  for select using (status = 'verified' or created_by = auth.uid());

-- Lớp: thấy lớp của trường mình + lớp do mình dạy
create policy "classes_select" on public.classes
  for select using (
    teacher_id = auth.uid()
    or school_id = (select school_id from public.profiles where id = auth.uid())
  );

-- Giáo viên xem được thành viên lớp của mình; học sinh xem được dòng của chính mình
create policy "members_select" on public.class_members
  for select using (
    student_id = auth.uid()
    or exists (select 1 from public.classes c
               where c.id = class_id and c.teacher_id = auth.uid())
  );
-- INSERT/UPDATE thành viên lớp, tạo trường/lớp mới: chỉ qua API server (service_role)
```

> **Vì sao dùng bảng riêng thay vì ô nhập chữ tự do?** Nếu để học sinh gõ tự do thì sẽ có "THPT Nguyen Trai", "thpt nguyễn trãi", "Nguyễn Trãi" là 3 trường khác nhau, báo cáo theo lớp/trường sẽ vô nghĩa. Bảng chuẩn hóa cho phép giáo viên xem theo lớp và tìm kiếm trường chính xác.

**Dữ liệu trường:**
- Trường mới do học sinh thêm có `status = 'pending'`, vẫn dùng được ngay nhưng admin duyệt/gộp trùng sau (trang quản trị `/admin/schools`).
- Có thể nạp sẵn danh sách trường phổ thông từ nguồn công khai để học sinh chọn nhanh; kiểm tra điều kiện sử dụng dữ liệu trước khi dùng.
- **Dữ liệu trường/lớp của học sinh không hiển thị công khai** cho người chơi khác (xem 3A.13.9).

#### 3A.13.4. Luồng đăng ký, đăng nhập

**Đăng ký:**
```
1. Học sinh điền form → Server Action `registerStudent`
2. Server: kiểm tra CAPTCHA, rate limit theo IP, validate bằng Zod
3. Kiểm tra tên đăng nhập chưa tồn tại + không nằm trong danh sách cấm
4. Xử lý trường/lớp: tìm theo id, hoặc tạo mới (status 'pending') trong cùng 1 transaction logic
5. admin.createUser({ email: nội_bộ, password, email_confirm: true,
                       user_metadata: { username, display_name, auth_type: 'username', role: 'student' } })
6. Cập nhật profile: school_id, class_id (và tạo class_members: 'pending', hoặc 'approved' nếu có mã lớp)
7. Sinh MÃ KHÔI PHỤC (recovery code), lưu hash, hiện cho người dùng MỘT LẦN
8. Đăng nhập luôn (signInWithPassword) → chuyển tới trang "Lưu mã khôi phục" → /dashboard
```

**Đăng nhập:** form có ô "Tên đăng nhập hoặc email". Nếu giá trị không chứa `@` thì hiểu là tên đăng nhập và đổi sang email nội bộ trước khi gọi `signInWithPassword`.

#### 3A.13.5. Code mẫu

```ts
// src/lib/auth/internal-email.ts
export const toInternalEmail = (username: string) =>
  `${username.trim().toLowerCase()}@${process.env.INTERNAL_EMAIL_DOMAIN}`;
// INTERNAL_EMAIL_DOMAIN=accounts.foggo.com  (miền bạn sở hữu, không có MX)
```

```ts
// src/lib/auth/recovery.ts
import { randomBytes, createHash, timingSafeEqual } from "crypto";

// Mã dạng XXXX-XXXX-XXXX (bảng chữ không có ký tự dễ nhầm 0/O, 1/I)
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function generateRecoveryCode() {
  const bytes = randomBytes(12);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}
export const hashRecovery = (code: string) =>
  createHash("sha256").update(code.replace(/-/g, "").toUpperCase()).digest("hex");
export function verifyRecovery(code: string, hash: string) {
  const a = Buffer.from(hashRecovery(code), "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
```

```ts
// src/app/(auth)/student-actions.ts
"use server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";   // service_role, chỉ chạy server
import { createClient } from "@/lib/supabase/server";
import { toInternalEmail } from "@/lib/auth/internal-email";
import { generateRecoveryCode, hashRecovery } from "@/lib/auth/recovery";

const RESERVED = ["admin", "root", "support", "moderator", "system", "teacher", "giaovien"];

const schema = z.object({
  username: z.string().toLowerCase().regex(/^[a-z0-9_]{3,20}$/, "3–20 ký tự: chữ thường, số, _"),
  password: z.string().min(8, "Tối thiểu 8 ký tự").max(72),
  displayName: z.string().trim().min(2).max(30),
  schoolId: z.string().uuid().optional(),
  newSchool: z.object({ name: z.string().trim().min(5).max(120), province: z.string() }).optional(),
  classId: z.string().uuid().optional(),
  newClass: z.object({ name: z.string().trim().min(1).max(10), grade: z.number().int().min(1).max(12) }).optional(),
  classCode: z.string().length(8).optional(),
  acceptTerms: z.literal(true),
});

export async function registerStudent(input: unknown) {
  // 1) CAPTCHA + rate limit theo IP: làm ở đây (Turnstile verify, Upstash Ratelimit)
  const p = schema.safeParse(input);
  if (!p.success) return { error: p.error.issues[0].message };
  const d = p.data;
  if (RESERVED.some((w) => d.username.includes(w))) return { error: "Tên đăng nhập không hợp lệ" };
  if (d.password.toLowerCase().includes(d.username)) return { error: "Mật khẩu không được chứa tên đăng nhập" };

  const admin = createAdminClient();

  // 2) Tên đăng nhập đã tồn tại?
  const { data: existed } = await admin.from("profiles").select("id").ilike("username", d.username).maybeSingle();
  if (existed) return { error: "Tên đăng nhập đã được sử dụng" };

  // 3) Xác định trường & lớp (tìm hoặc tạo, status 'pending' cho dữ liệu mới)
  // ... (tách thành hàm resolveSchoolAndClass, kiểm tra trùng bằng name_search + province)

  // 4) Tạo tài khoản — role luôn là 'student'
  const { data, error } = await admin.auth.admin.createUser({
    email: toInternalEmail(d.username),
    password: d.password,
    email_confirm: true,
    user_metadata: { username: d.username, display_name: d.displayName, auth_type: "username", role: "student" },
  });
  if (error || !data.user) return { error: "Không thể tạo tài khoản. Vui lòng thử lại." };

  // 5) Mã khôi phục
  const recoveryCode = generateRecoveryCode();
  await admin.from("profiles").update({
    username: d.username,
    school_id: /* schoolId đã resolve */ null,
    class_id:  /* classId đã resolve */ null,
    recovery_code_hash: hashRecovery(recoveryCode),
    onboarded: true,
  }).eq("id", data.user.id);

  // 6) Đăng nhập luôn
  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email: toInternalEmail(d.username), password: d.password });

  return { ok: true, recoveryCode };   // hiển thị 1 lần ở màn hình tiếp theo
}
```

```ts
// Đăng nhập: chấp nhận tên đăng nhập hoặc email
export async function loginAny(formData: FormData) {
  const id = String(formData.get("identifier")).trim();
  const email = id.includes("@") ? id : toInternalEmail(id);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email, password: String(formData.get("password")),
  });
  if (error) return { error: "Tên đăng nhập/email hoặc mật khẩu không đúng" };
  redirect("/dashboard");
}
```

> Trigger `handle_new_user` (mục 3A.5) đọc `user_metadata` khi tạo tài khoản. Vì `user_metadata` do **server** đặt (admin API) nên đáng tin lúc tạo; nhưng người dùng có thể tự sửa `user_metadata` sau đó từ client, nên **không bao giờ dùng `user_metadata` để phân quyền** sau thời điểm tạo. Hãy luôn đọc `role` từ bảng `profiles`.

#### 3A.13.6. Khôi phục mật khẩu khi không có email

Không có email nên **không thể gửi link đặt lại**. Cung cấp 3 cách, ưu tiên theo thứ tự:

| Cách | Mô tả | Ghi chú |
|---|---|---|
| **1. Mã khôi phục** | Khi đăng ký hệ thống cấp mã `XXXX-XXXX-XXXX`, hiện một lần, yêu cầu tải/chụp/in lưu lại. Quên mật khẩu → nhập tên đăng nhập + mã khôi phục + mật khẩu mới | Tự phục vụ, không phụ thuộc ai |
| **2. Giáo viên đặt lại** | Giáo viên đã duyệt học sinh vào lớp bấm "Đặt lại mật khẩu" → hệ thống tạo mật khẩu tạm, học sinh phải đổi khi đăng nhập (`must_change_password = true`) | Cách phù hợp nhất với học sinh nhỏ tuổi |
| **3. Thêm email sau** | Trong Cài đặt, cho phép liên kết email (`updateUser({ email })`, xác nhận qua email) → từ đó dùng "quên mật khẩu qua email" bình thường | Khuyến khích nhưng không bắt buộc |

**Màn hình sau đăng ký (bắt buộc):** hiện mã khôi phục kèm các nút *Sao chép / Tải file .txt / In*, và một ô tick "Tôi đã lưu mã này" mới cho tiếp tục. Giải thích rõ: *"Nếu quên mật khẩu và mất mã này, bạn cần nhờ giáo viên đặt lại, hoặc sẽ không vào lại được tài khoản."*

```ts
// Đặt lại bằng mã khôi phục (server action)
export async function resetWithRecovery(username: string, code: string, newPassword: string) {
  // Rate limit RẤT chặt: ví dụ 5 lần/giờ cho mỗi (IP + username) để chống dò mã
  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles")
    .select("id, recovery_code_hash").ilike("username", username).maybeSingle();

  // Trả cùng một thông báo dù username có tồn tại hay không
  const FAIL = { error: "Tên đăng nhập hoặc mã khôi phục không đúng" };
  if (!profile?.recovery_code_hash || !verifyRecovery(code, profile.recovery_code_hash)) return FAIL;

  await admin.auth.admin.updateUserById(profile.id, { password: newPassword });
  const newCode = generateRecoveryCode();                       // xoay mã sau mỗi lần dùng
  await admin.from("profiles").update({ recovery_code_hash: hashRecovery(newCode) }).eq("id", profile.id);
  return { ok: true, newRecoveryCode: newCode };
}
```
Mã khôi phục dài 12 ký tự trong bảng chữ 32 ký tự (~60 bit) kết hợp giới hạn số lần thử đủ chống dò mã trong thực tế.

**API giáo viên đặt lại mật khẩu học sinh** (`POST /api/teacher/reset-student-password`): server kiểm tra (1) người gọi là `teacher`, (2) học sinh có trong `class_members` **đã approved** của một lớp mà giáo viên này là `teacher_id`, (3) ghi log (ai, khi nào, cho ai). Sau đó `admin.auth.admin.updateUserById(...)` với mật khẩu tạm ngẫu nhiên và đặt `must_change_password = true`; middleware chuyển hướng học sinh tới trang đổi mật khẩu cho đến khi hoàn tất.

#### 3A.13.7. Liên kết học sinh với giáo viên (chống gán nhầm lớp)

Học sinh tự chọn "trường + lớp" chỉ là **khai báo cá nhân**, chưa chứng minh được thật sự thuộc lớp của giáo viên nào. Để giáo viên chỉ thấy đúng học sinh của mình:

- Giáo viên tạo lớp → hệ thống sinh `join_code` (8 ký tự) → giáo viên đưa mã cho lớp.
- **Có mã lớp khi đăng ký** → vào `class_members` với `status = 'approved'`, `joined_via = 'code'`.
- **Chỉ chọn lớp trong danh sách** → `status = 'pending'`; giáo viên của lớp (nếu có) thấy danh sách "chờ duyệt" và bấm duyệt/từ chối.
- Chỉ học sinh `approved` mới xuất hiện trong báo cáo lớp và mới được giáo viên đặt lại mật khẩu.
- Học sinh có thể nhập mã lớp muộn hơn trong Cài đặt.
- Giáo viên cũng có thể **tạo hàng loạt tài khoản học sinh** (nhập danh sách họ tên → hệ thống sinh tên đăng nhập + mật khẩu tạm, xuất file in cho lớp). Trường hợp này dùng chung hàm tạo tài khoản ở 3A.13.5, với `joined_via = 'teacher'`, `must_change_password = true`.

#### 3A.13.8. Chống lạm dụng khi ai cũng đăng ký được không cần email

Không có email xác minh nên dễ bị tạo tài khoản hàng loạt, spam, đặt tên xấu. Các lớp phòng thủ:

- [ ] **CAPTCHA** (Cloudflare Turnstile) bắt buộc trên form đăng ký, đăng nhập sau vài lần sai, và khôi phục mật khẩu.
- [ ] **Rate limit** đăng ký theo IP (ví dụ 5 tài khoản/giờ/IP; lưu ý nhiều học sinh cùng một trường có thể dùng chung IP, nên đặt ngưỡng vừa phải hoặc nới theo lớp).
- [ ] **Honeypot field** ẩn trong form để chặn bot đơn giản.
- [ ] **Bộ lọc tên** (tên đăng nhập, tên hiển thị, tên trường/lớp mới): chặn từ tục, từ cấm, từ giả mạo (admin, support, tên giáo viên nổi tiếng...).
- [ ] **Tài khoản hạn chế khi mới tạo** (tùy chọn): chưa được đăng bộ câu hỏi công khai cho đến khi đã chơi vài ván.
- [ ] **Giới hạn thử mật khẩu**: sau 5 lần sai thì khóa tạm hoặc bắt CAPTCHA.
- [ ] **Phát hiện bất thường**: đăng ký hàng loạt từ một IP/user-agent, tên có mẫu giống nhau → cảnh báo admin.
- [ ] **Báo cáo và khóa tài khoản** do admin/giáo viên.
- [ ] **Dọn dẹp**: tài khoản tên đăng nhập không hoạt động nhiều tháng và chưa có dữ liệu có thể xóa theo chính sách đã công bố.

#### 3A.13.9. Quyền riêng tư và trẻ em (rất quan trọng)

Tên trường và lớp của trẻ em là **dữ liệu cá nhân nhạy cảm**. Nguyên tắc:

- **Thu thập tối thiểu:** chỉ những gì cần cho tính năng (trường, lớp để giáo viên quản lý). Không thu họ tên thật, ngày sinh đầy đủ, địa chỉ, số điện thoại. Khuyến khích dùng biệt danh.
- **Không hiển thị công khai:** người chơi khác chỉ thấy tên hiển thị/biệt danh, **không** thấy trường, lớp. Chỉ giáo viên đã duyệt học sinh mới xem được thông tin lớp.
- **Không có tìm kiếm người dùng công khai**, không có nhắn tin hay mạng xã hội giữa học sinh.
- **Đồng ý của phụ huynh/nhà trường:** quy định về dữ liệu cá nhân của trẻ em (tại Việt Nam, xem Nghị định 13/2023/NĐ-CP) thường yêu cầu sự đồng ý của cha mẹ hoặc người giám hộ với trẻ em dưới ngưỡng tuổi nhất định. Thiết kế sẵn: ô xác nhận trong form + điều khoản riêng cho học sinh + trang giải thích cho phụ huynh. **Hãy tham khảo luật sư hoặc người am hiểu pháp lý** để xác định cơ chế đồng ý phù hợp (đồng ý qua nhà trường/giáo viên, xác nhận điện tử...) trước khi ra mắt. Mình không phải luật sư nên chỉ đưa ra điểm cần lưu ý.
- **Quyền của người dùng:** có nút xóa tài khoản và xuất dữ liệu; giáo viên/phụ huynh có đường liên hệ yêu cầu xóa dữ liệu của học sinh.
- **Lưu trữ mật khẩu/mã khôi phục:** mật khẩu do Supabase Auth băm; mã khôi phục chỉ lưu **hash**, không bao giờ lưu bản rõ. Không ghi log mật khẩu hay mã.
- **Dữ liệu trường/lớp tự thêm:** không cho hiển thị tên lớp/trường do người dùng nhập ở bất cứ chỗ công khai nào cho đến khi được duyệt (tránh chèn nội dung xấu).

#### 3A.13.10. Ảnh hưởng đến các phần khác của kế hoạch

| Phần | Điều chỉnh |
|---|---|
| **Middleware / `requireUser`** | Chấp nhận tài khoản `auth_type='username'` như người dùng thật (khác với tài khoản ẩn danh); nếu `must_change_password` thì chuyển tới `/change-password` |
| **Trang Cài đặt tài khoản** | Với tài khoản `username`: ẩn "đổi email" ban đầu, hiện nút **"Thêm email để khôi phục dễ hơn"**; thêm nút **"Tạo mã khôi phục mới"** (yêu cầu nhập mật khẩu hiện tại); hiện trường/lớp và ô nhập mã lớp |
| **Quản lý lớp (giáo viên)** | Trang `/dashboard/classes`: tạo lớp, xem mã lớp, danh sách học sinh (chờ duyệt/đã duyệt), đặt lại mật khẩu, tạo tài khoản hàng loạt |
| **Báo cáo** | Thêm lọc theo lớp; chỉ gồm học sinh `approved` |
| **Thanh toán Plus** | Không cần email để chơi, nhưng khi nâng cấp nên yêu cầu thêm email (hoặc SĐT phụ huynh) để gửi biên nhận và liên hệ hỗ trợ; nhiều trường hợp Plus do **giáo viên/nhà trường mua** cho cả lớp nên có thể xem xét "gói lớp học" |
| **Supabase Dashboard** | Giữ "Confirm email" BẬT (tài khoản username tạo qua admin API với `email_confirm: true` nên không bị ảnh hưởng); không bật email OTP cho miền nội bộ |
| **Biến môi trường** | Thêm `INTERNAL_EMAIL_DOMAIN` |
| **Kiểm thử** | Thêm danh sách ở 3A.13.11 |

#### 3A.13.11. Kiểm thử đăng ký không cần email

- [ ] Đăng ký thành công với username + mật khẩu + trường + lớp, vào dashboard ngay, thấy màn hình mã khôi phục.
- [ ] Trùng tên đăng nhập khác hoa/thường (`Minh_8A1` vs `minh_8a1`) → bị từ chối.
- [ ] Gửi `role: "teacher"` hoặc `role: "admin"` trong request đăng ký → bị bỏ qua, tài khoản là `student`.
- [ ] Tên đăng nhập chứa từ cấm / ký tự lạ / quá dài → bị từ chối.
- [ ] Hai học sinh cùng đăng ký "THPT Nguyen Trai" và "THPT Nguyễn Trãi" cùng tỉnh → chỉ tạo **một** trường.
- [ ] Đăng nhập bằng username và bằng email (tài khoản email cũ) đều hoạt động.
- [ ] Quên mật khẩu bằng mã khôi phục: đúng mã → vào được và mã mới được cấp; sai mã 5 lần → bị khóa tạm; mã cũ không dùng lại được.
- [ ] Giáo viên đặt lại mật khẩu cho học sinh **không thuộc lớp mình** → bị từ chối.
- [ ] Học sinh `pending` không xuất hiện trong báo cáo lớp.
- [ ] Bot đăng ký liên tục từ một IP → bị rate limit/CAPTCHA chặn.
- [ ] Học sinh A không xem được trường/lớp/thông tin của học sinh B (kiểm tra bằng chính anon key + token của A).
- [ ] Xác nhận hệ thống **không gửi email** nào tới địa chỉ nội bộ (kiểm tra log SMTP).
- [ ] Học sinh thêm email sau → xác nhận email → dùng "quên mật khẩu qua email" được.
- [ ] Thử trên điện thoại cấu hình thấp: form trường/lớp dễ dùng, gợi ý trường nhanh.

#### 3A.13.12. Thứ tự làm

1. Migration: `schools`, `classes`, `class_members`, cột mới của `profiles`, RLS.
2. `toInternalEmail`, `registerStudent`, `loginAny` + test.
3. Form đăng ký (tìm trường, chọn/nhập lớp) + trang mã khôi phục.
4. `resetWithRecovery` + trang quên mật khẩu (nhánh tên đăng nhập).
5. CAPTCHA + rate limit + bộ lọc tên.
6. Giáo viên: tạo lớp, mã lớp, duyệt học sinh, đặt lại mật khẩu, tạo hàng loạt.
7. Trang quản trị duyệt/gộp trường.
8. Điều khoản học sinh + trang dành cho phụ huynh.

---

## 4. Các dạng câu hỏi

Tất cả dạng câu hỏi lưu chung trong bảng `questions`, với cột `type` và cột `content` (JSONB) chứa dữ liệu riêng theo từng loại. Cột `answer_key` (JSONB) chứa đáp án đúng và **không bao giờ gửi xuống người chơi**.

### 4.1. Danh sách dạng câu hỏi

| # | Mã `type` | Tên | Gói |
|---|---|---|---|
| 1 | `single_choice` | Trắc nghiệm 1 đáp án | Free |
| 2 | `true_false` | Đúng / Sai (Hỗ trợ 1 hoặc nhiều nhận định) | Free |
| 3 | `multi_select` | Chọn nhiều đáp án | Free |
| 4 | `dropdown_list` | Lựa chọn từ danh sách (Dropdown thả xuống) | Free |
| 5 | `drag_order` | Kéo thả: sắp xếp thứ tự | Plus |
| 6 | `drag_match` | Kéo thả: ghép cặp | Plus |
| 7 | `drag_fill` | Kéo thả: điền chỗ trống | Plus |
| 8 | `hotspot` | Chọn vùng đúng trên ảnh | Plus |
| 9 | `typing` (mở rộng sau) | Gõ đáp án | Free |

> Bạn có thể tự quyết dạng nào Free, dạng nào Plus. Gợi ý trên chỉ để tham khảo.

### 4.2. Cấu trúc dữ liệu chi tiết

#### (1) `single_choice`
```json
// content (gửi cho người chơi)
{
  "prompt": "Thủ đô của Việt Nam là gì?",
  "image_url": null,
  "options": [
    { "id": "a", "text": "Hà Nội" },
    { "id": "b", "text": "Huế" },
    { "id": "c", "text": "Đà Nẵng" },
    { "id": "d", "text": "TP.HCM" }
  ]
}
// answer_key (CHỈ server)
{ "correct": "a" }
```
**Chấm điểm:** đúng khi `answer === correct`.

#### (2) `true_false`
```json
{ "prompt": "Trái Đất quay quanh Mặt Trời." }
// answer_key
{ "correct": true }
```

#### (3) `multi_select` — chọn nhiều đáp án
```json
{
  "prompt": "Chọn tất cả số nguyên tố:",
  "options": [
    { "id": "a", "text": "2" }, { "id": "b", "text": "4" },
    { "id": "c", "text": "7" }, { "id": "d", "text": "9" }
  ],
  "min_select": 1,
  "max_select": 4
}
// answer_key
{ "correct": ["a", "c"], "scoring": "all_or_nothing" }
```
**Các kiểu chấm điểm** (cho giáo viên chọn):
- `all_or_nothing`: đúng hết mới được điểm.
- `partial`: điểm = `(số đúng - số sai) / tổng số đáp án đúng`, tối thiểu 0.
- `per_option`: mỗi lựa chọn đúng/sai được tính điểm riêng.

#### (4) `drag_order` — kéo thả sắp xếp thứ tự
```json
{
  "prompt": "Sắp xếp các hành tinh theo khoảng cách từ Mặt Trời (gần → xa):",
  "items": [
    { "id": "i1", "text": "Trái Đất" },
    { "id": "i2", "text": "Sao Thủy" },
    { "id": "i3", "text": "Sao Hỏa" }
  ]
}
// answer_key
{ "correct_order": ["i2", "i1", "i3"], "scoring": "exact" }
```
**Chấm điểm:** `exact` (đúng toàn bộ) hoặc `partial` (đếm số vị trí đúng / tổng).
*Lưu ý: thứ tự `items` gửi cho người chơi phải được xáo trộn ở server.*

#### (5) `drag_match` — kéo thả ghép cặp
```json
{
  "prompt": "Ghép quốc gia với thủ đô:",
  "left":  [ { "id": "l1", "text": "Nhật Bản" }, { "id": "l2", "text": "Pháp" } ],
  "right": [ { "id": "r1", "text": "Paris" }, { "id": "r2", "text": "Tokyo" } ]
}
// answer_key
{ "pairs": { "l1": "r2", "l2": "r1" }, "scoring": "partial" }
```

#### (6) `drag_fill` — kéo thả điền chỗ trống
```json
{
  "prompt": "Điền từ vào chỗ trống:",
  "template": "Nước sôi ở {{1}} độ C và đóng băng ở {{2}} độ C.",
  "word_bank": [
    { "id": "w1", "text": "100" }, { "id": "w2", "text": "0" }, { "id": "w3", "text": "50" }
  ]
}
// answer_key
{ "blanks": { "1": "w1", "2": "w2" }, "scoring": "partial" }
```

#### (7) `hotspot` — chọn vùng đúng trên ảnh
```json
{
  "prompt": "Nhấn vào vị trí của tim trên sơ đồ:",
  "image_url": "https://.../body.png",
  "image_width": 800,
  "image_height": 600,
  "max_clicks": 1
}
// answer_key — toạ độ lưu theo % (0-1) để responsive
{
  "regions": [
    { "shape": "rect",    "x": 0.42, "y": 0.30, "w": 0.10, "h": 0.12 },
    { "shape": "circle",  "cx": 0.60, "cy": 0.55, "r": 0.05 },
    { "shape": "polygon", "points": [[0.1,0.1],[0.2,0.1],[0.15,0.25]] }
  ],
  "mode": "any_region"
}
```
**Chấm điểm:** kiểm tra điểm click `(x, y)` có nằm trong vùng nào không:
- Rect: `x0 <= x <= x0+w && y0 <= y <= y0+h`
- Circle: `(x-cx)² + (y-cy)² <= r²`
- Polygon: thuật toán **ray casting** (point-in-polygon).

**Công cụ cho giáo viên:** trình chỉnh sửa vẽ vùng trên ảnh (kéo để vẽ hình chữ nhật/tròn, click từng đỉnh để vẽ đa giác), có nút xóa/sửa vùng.

#### (8) `true_false_multi` — Bảng nhận định Đúng / Sai (Chuẩn IC3 GS6 & GDPT 2018)
Được thiết kế theo cấu trúc bảng trắc nghiệm Đúng/Sai chuẩn quốc tế IC3 GS6 và chương trình Giáo dục Phổ thông 2018 của Bộ Giáo dục & Đào tạo Việt Nam:
- **Tiêu đề bảng:** `Bảng Phát Biểu / Nhận Định (Chuẩn IC3 GS6): [X nhận định]` kèm nút `+ Thêm Nhận Định` (nền cyan `#0284c7`).
- **Gợi ý thao tác:** `💡 Nhập từng câu phát biểu và tích chọn đáp án Đúng (Yes) hoặc Sai (No) cho từng dòng.`
- **Cấu trúc 4 cột chuẩn:**
  1. `Câu phát biểu / Nhận định`: Ô nhập nội dung từng nhận định phát biểu (`#1`, `#2`, `#3`...).
  2. `Đúng (Yes)`: Header màu Cyan (`#0284c7`), radio button kích hoạt viền phát sáng cyan và chấm tròn trắng nổi bật.
  3. `Sai (No)`: Header màu Royal Blue (`#2563eb`), radio button kích hoạt viền phát sáng royal blue và chấm tròn trắng nổi bật.
  4. `Xóa`: Nút thùng rác tiện lợi cho phép thêm/bớt nhận định linh hoạt (tối đa 10 nhận định).

```json
{
  "prompt": "Đọc các phát biểu sau đây và cho biết phát biểu nào Đúng, phát biểu nào Sai:",
  "statements": [
    { "id": "s1", "text": "Hệ điều hành Windows là phần mềm ứng dụng." },
    { "id": "s2", "text": "CPU đóng vai trò là bộ não xử lý của máy tính." },
    { "id": "s3", "text": "RAM là bộ nhớ ngoài có khả năng lưu trữ vĩnh viễn dữ liệu khi mất điện." }
  ]
}
// answer_key (chỉ lưu trữ và chấm điểm ở Server)
{ "answers": { "s1": false, "s2": true, "s3": false } }
```
**Chấm điểm:** Tỷ lệ phần trăm theo số nhận định đúng (ví dụ đúng 2/3 câu = 0.67 điểm).

#### (9) `dropdown_list` — Lựa chọn theo dạng danh sách (Dropdown thả xuống)
Được thiết kế theo cấu trúc bài thi Tin học và chứng chỉ quốc tế (IC3 GS6, MOS, Azota):
- **Cú pháp soạn thảo tiện lợi:**
  - Thêm ký tự `{D}` để chèn vị trí danh sách lựa chọn thả xuống trực tiếp trong văn bản.
  - Thêm ký tự `<br>` để xuống dòng.
  - Phím tắt **Ctrl + Enter** để chèn nhanh `{D}`.
- **Tùy biến danh sách lựa chọn:**
  - Giáo viên có thể tự do định nghĩa các phương án trong menu thả xuống cho từng `{D}` (ví dụ: `["Có", "Không"]`, `["Nên", "Không nên"]`, `["Đúng", "Sai"]` hoặc các từ vựng/thuật ngữ chuyên môn).
  - Có các nút mẫu áp dụng nhanh (Preset) cho một vị trí hoặc cho toàn bộ các vị trí `{D}` chỉ với 1 click.
- **Giao diện làm bài (Player):**
  - Hiển thị nút bấm dropdown màu xanh dương `[ ▼ ]` với hiệu ứng mở menu thả xuống mượt mà.
  - Học sinh nhấp chọn phương án phù hợp cho từng vị trí `{D}`.

```json
// content (gửi cho người chơi)
{
  "prompt": "{D} Bạn nên tắt tính năng tự động chạy (Autorun)...<br>{D} Bạn nên lưu trữ các công việc...",
  "dropdowns": [
    { "id": "d1", "label": "Vị trí #1", "options": ["Có", "Không"] },
    { "id": "d2", "label": "Vị trí #2", "options": ["Có", "Không"] }
  ]
}
// answer_key (chỉ lưu trữ và chấm điểm ở Server)
{
  "answers": { "d1": "Có", "d2": "Có" }
}
```
**Chấm điểm:** Tỷ lệ số vị trí lựa chọn chính xác (ví dụ đúng 2/3 vị trí = 0.67 điểm).

### 4.4. Tính năng Sao lưu (Backup) & Nhập đề thi từ file Excel (.xlsx)
Hỗ trợ giáo viên nhập liệu hàng loạt và sao lưu dữ liệu an toàn, không phụ thuộc vào nhập thủ công từng câu:
1. **Tải file mẫu Excel (`downloadSampleTemplateExcel`):**
   - File `.xlsx` chuẩn gồm 2 sheet:
     - `De_Thi_Mau`: 8 câu hỏi mẫu đầy đủ các loại (`single_choice`, `true_false`, `true_false_multi`, `multi_select`), có cột câu hỏi, dạng câu, các lựa chọn A/B/C/D hoặc bảng nhận định, đáp án đúng, giải thích, thời gian và điểm số.
     - `Huong_Dan`: Hướng dẫn quy ước cú pháp, mẹo ra đề và bảng mã dạng câu hỏi.
2. **Nhập câu hỏi thông minh (`parseQuestionsFromExcel`):**
   - Tự động chuẩn hóa tiêu đề cột tiếng Việt (loại bỏ dấu tiếng Việt `đ -> d`, khoảng trắng thừa, không phân biệt hoa/thường).
   - Hỗ trợ nhập trực tiếp từ trang danh sách bộ câu hỏi (tạo bộ câu hỏi mới từ Excel) hoặc nhập nối tiếp vào bộ câu hỏi đang chỉnh sửa.
3. **Sao lưu trọn gói (`exportQuestionSetToExcel` & `exportQuestionSetToJson`):**
   - Xuất toàn bộ câu hỏi và đáp án ra file Excel định dạng bảng biểu đẹp mắt hoặc file JSON chuẩn cấu trúc Foggo để dễ dàng khôi phục trên bất kỳ hệ thống nào.

### 4.3. Thiết kế code: "Question Type Registry"
Để dễ thêm dạng câu hỏi mới sau này, mỗi dạng là một **module độc lập** gồm 4 phần:

```
question-types/
  multi-select/
    schema.ts        // Zod schema cho content + answer_key
    Editor.tsx       // Giao diện giáo viên tạo/sửa câu hỏi
    Player.tsx       // Giao diện người chơi trả lời
    grade.ts         // Hàm chấm điểm (chạy ở server)
    index.ts         // Đăng ký vào registry
```

```ts
// registry.ts
export const questionTypes = {
  single_choice: singleChoice,
  multi_select: multiSelect,
  drag_order: dragOrder,
  // ...
} as const;
```

Khi cần thêm dạng mới chỉ cần tạo thư mục mới + đăng ký, không phải sửa logic game.

### 4.4. Chấm điểm và tính điểm thưởng

```
điểm_cơ_bản     = question.points (mặc định 1000)
hệ_số_đúng      = grade() trả về 0..1  (1 = đúng hoàn toàn)
hệ_số_tốc_độ    = 1 - (thời_gian_trả_lời / thời_gian_giới_hạn) * 0.5
điểm_nhận_được  = điểm_cơ_bản * hệ_số_đúng * hệ_số_tốc_độ
```
> Lưu ý: công thức trên áp dụng cho chế độ Classic (nếu làm). Chế độ Sinh tồn dùng công thức sát thương/xu/đói riêng ở mục 5A.11.

Thời gian trả lời phải **đo ở server** (so thời điểm server gửi câu hỏi với thời điểm nhận đáp án), không tin giá trị client gửi lên.

---

## 5. Chế độ chơi (Game modes)

> Game của bạn **không bắt chước Blooket**. Chế độ chính là một game **sinh tồn + farm quái** tự thiết kế (mục 5A). Tự đặt tên, luật, hình ảnh riêng và **không sao chép tên/hình/tài nguyên của Blooket hay game nào khác** (xem mục 15).

| Giai đoạn | Chế độ | Mô tả ngắn | Độ khó làm |
|---|---|---|---|
| MVP | **Sinh tồn tri thức (Survival Quiz)** ⭐ chế độ chính | Trả lời đúng để đánh quái, hái lượm, chế tạo; nhận xu/vật phẩm; sống sót qua ngày đêm. **Chi tiết ở mục 5A** | ⭐⭐⭐⭐ |
| MVP | **Yên bình (ôn tập)** | Sinh tồn bản nhẹ: không đói, không đêm | ⭐ (chỉ là cờ cấu hình) |
| Tùy chọn | **Đấu nhanh (Classic)** | Cả lớp cùng 1 câu, ai nhiều điểm nhất thắng. Chỉ làm nếu giáo viên cần kiểm tra nhanh; **có thể bỏ qua nếu muốn tập trung vào Sinh tồn** | ⭐ |
| V2 | **Bộ tộc (Co-op)** | Cả đội chung trại, kho và trùm | ⭐⭐⭐ |
| V2 | **Khu vực mới theo mùa/chủ đề** | Đại dương, Vũ trụ, Sa mạc... mỗi khu có quái và nguyên liệu riêng | ⭐⭐⭐ |
| V3 | **Thương mại lớp / Đột kích (PvP tùy chọn)** | Trao đổi vật phẩm; cướp xu có kiểm soát (mặc định tắt) | ⭐⭐⭐ |
| V3 | **Giao bài về nhà (Homework)** | Chơi không đồng bộ, có hạn nộp | ⭐⭐ |

**Cách thiết kế để mở rộng:** mỗi game mode là một module với giao diện chung:
```ts
interface GameMode {
  id: string;
  onAnswer(state, playerId, result): State;   // cập nhật trạng thái khi có đáp án
  getLeaderboard(state): Entry[];
  Component: React.FC;                         // giao diện của mode
}
```

---

## 5A. Chế độ chính: SINH TỒN TRI THỨC (Survival Quiz)

> Chế độ chính của **Foggo**. Đây là game **sinh tồn + farm quái** thật sự: người chơi bị bỏ vào một hòn đảo, phải **trả lời đúng câu hỏi để đánh quái, thu thập, chế tạo**, nhận về **tiền (xu) hoặc vật phẩm**, dùng chúng để **sống sót qua các ngày đêm** và đánh bại trùm. Không bắt chước game nào của Blooket: toàn bộ luật, nhân vật, vật phẩm đều tự thiết kế.

### 5A.1. Ý tưởng cốt lõi

```
                ┌─────────────────── NGÀY ───────────────────┐
                │                                            │
   ┌────────┐   │  ĐI SĂN ──► QUÁI CHẾT ──► RỚT: xu / nguyên │
   │ TRẠI   │◄──┤  (trả lời)               liệu / thức ăn /  │
   │ (Camp) │   │                           vật phẩm hiếm    │
   └───┬────┘   │  HÁI LƯỢM ─► tài nguyên (gỗ, đá, thảo dược)│
       │        │  CHẾ TẠO ──► vũ khí, giáp, thuốc, thức ăn  │
       │        │  THƯƠNG NHÂN ► mua/bán bằng xu             │
       │        └────────────────────┬───────────────────────┘
       │                             ▼
       │        ┌─────────────────── ĐÊM ────────────────────┐
       └───────►│ QUÁI TẤN CÔNG TRẠI: trả lời để chống đỡ,   │
                │ giữ hàng rào + sống sót đến sáng           │
                └────────────────────┬───────────────────────┘
                                     ▼
                  Qua nhiều ngày → mở khu vực mới → đánh TRÙM
```

**Áp lực sinh tồn** (để chơi có "cảm giác sinh tồn" chứ không chỉ là đánh quái):
- **Đói:** thanh đói tụt dần theo thời gian, phải ăn (thức ăn từ quái rớt hoặc tự nấu).
- **Máu (HP):** trả lời sai hoặc hết giờ thì quái đánh trả.
- **Độ bền vũ khí/giáp:** mỗi đòn đánh làm hao độ bền, phải sửa hoặc chế mới, nên cần farm nguyên liệu liên tục.
- **Ban đêm:** quái tấn công trại theo từng đợt, mạnh dần qua các ngày.
- **Ba lô có hạn:** chỉ mang được số ô nhất định, phải chọn mang gì, bán gì.
- **Chết thì mất một phần đồ**, nhưng **không bị loại khỏi ván** (xem 5A.9).

**Mục tiêu một mùa (một Thế giới):** sống sót, phát triển nhân vật và hạ càng nhiều trùm càng tốt trong thời gian giáo viên mở thế giới (ví dụ 1–2 tuần, mỗi ngày chơi 15–30 phút), kết thúc với điểm cao nhất. Nhân vật và đảo của mỗi người được **lưu lại giữa các lần chơi** (xem mục 5B).

### 5A.2. Khác biệt kỹ thuật so với các chế độ khác

| | Classic (đua câu hỏi, tùy chọn) | Sinh tồn |
|---|---|---|
| Nhịp độ | Giáo viên điều khiển, cả lớp cùng 1 câu | **Mỗi người tự chơi theo tốc độ riêng, tiến trình được lưu giữa các lần chơi** |
| Câu hỏi | Giống nhau, đồng loạt | Chọn theo hành động + quái/khu vực, **xáo trộn riêng từng người** |
| Thời gian | Giới hạn từng câu | **Đồng hồ ngày/đêm riêng của mỗi người** (chỉ chạy khi đang chơi) + giới hạn từng câu |
| Trạng thái | Điểm | HP, đói, túi đồ, xu, trại, khu vực, đợt tấn công... (lưu ở server) |
| Realtime | Broadcast từng câu | Chỉ broadcast **bảng xếp hạng và sự kiện nổi bật** (3 giây/lần) |

**Nguyên tắc kỹ thuật quan trọng — "tính theo thời điểm" (lazy evaluation):**
Vercel chạy serverless, **không có vòng lặp game chạy liên tục** ở server để trừ đói mỗi giây hay đẩy quái đi. Thay vào đó mọi thứ phụ thuộc thời gian được **tính lại khi người chơi có hành động tiếp theo**, dựa trên mốc thời gian:
```
dt             = min(now - state.lastTickAt, 60s)    # quá 60s không thao tác = coi như đã rời, thời gian game đứng yên
state.playSec += dt                                  # "đồng hồ chơi" riêng của người này
ngày/đêm       = f(state.playSec)                    # hàm thuần
đói hiện tại   = đói_lần_cuối - dt / ĐỘ_DÀI_GIẢM_ĐÓI
đợt tấn công   = nếu playSec vượt mốc đêm mà chưa xử lý → tạo/kết toán đợt đó
```
Client chỉ hiển thị đồng hồ và thanh đói bằng cách tự tính cùng công thức; **server là nơi quyết định**. Cách này rẻ, không cần máy chủ chạy 24/7 và không bị lệch khi mất mạng. Nhờ đồng hồ chơi riêng, **tắt máy, hết tiết, mất mạng đều không bị phạt**: nhân vật không đói hay chết khi bạn không chơi.

### 5A.3. Các hành động và dạng câu hỏi tương ứng

Mỗi hành động trong game = **một câu hỏi**. Dạng câu hỏi quyết định cách "chơi":

| Hành động | Mô tả | Dạng câu hỏi phù hợp | Kết quả |
|---|---|---|---|
| ⚔️ **Đi săn (Hunt)** | Chọn một quái trong khu vực để đánh | `single_choice` (đòn thường), `true_false` (đòn nhanh), `multi_select` (combo: mỗi đáp án đúng = 1 đòn), `hotspot` (**đánh điểm yếu** trên ảnh quái → chí mạng x2) | Gây sát thương; quái chết thì rớt xu/vật phẩm |
| 🌲 **Hái lượm (Gather)** | Chặt cây, đào đá, hái thảo dược | `single_choice`, `true_false_multi` (phân biệt cây/quả an toàn hay độc), `hotspot` (nhấn vào đúng chỗ có tài nguyên trên ảnh) | Nhận nguyên liệu (số lượng theo độ đúng) |
| 🌫️ **Thám hiểm (Explore)** | Đi vào vùng sương mù để khám phá khu vực (mục 5A.21) | `hotspot`, `drag_match`, `true_false_multi`, `single_choice` | Sương giảm, lộ bãi tài nguyên giàu, rương, hang trùm |
| 🔨 **Chế tạo (Craft)** | Làm vũ khí, giáp, thức ăn, thuốc | `drag_order` (sắp xếp đúng các bước), `drag_match` (ghép nguyên liệu - sản phẩm), `drag_fill` (điền công thức) | Đúng: chế được (nhanh thì chất lượng "Tốt" +10%); sai: mất một phần nguyên liệu |
| 🌙 **Chống đỡ ban đêm (Defend)** | Đợt quái tấn công trại, câu hỏi dồn dập | Mọi dạng (hay dùng `true_false` cho nhanh) | Mỗi câu đúng hạ 1 quái; sai thì hàng rào hỏng |
| 🛒 **Giao dịch (Trade)** | Mua/bán với Thương nhân | Không cần câu hỏi | Đổi xu ↔ vật phẩm |
| 🍖 **Ăn / dùng thuốc** | Hồi đói, hồi máu | Không cần câu hỏi | Cập nhật chỉ số |

**Ghi chú:**
- Giáo viên **không cần chọn** hiệu ứng: game tự gán theo `type` của câu hỏi. Một bộ câu hỏi toàn trắc nghiệm vẫn chơi được trọn vẹn (chỉ là không có các cơ chế đặc biệt của kéo thả/hotspot).
- **Độ khó** của câu hỏi (cột `difficulty`, mục 5A.13) quyết định câu nào xuất hiện ở quái/khu vực nào: quái càng mạnh, câu càng khó. Nếu không đủ câu thì lấy câu gần nhất.
- Mỗi hành động có **thời gian giới hạn** riêng (săn 20s, hái 15s, chế tạo 30s, chống đỡ 12s/câu); thêm thời gian bằng vật phẩm.

### 5A.4. Chỉ số, đồng hồ ngày/đêm

| Chỉ số | Khởi đầu | Quy tắc |
|---|---|---|
| ❤️ HP | 100 | Mất khi quái đánh trả/bị đói; hồi bằng thuốc, ăn, nghỉ ở trại |
| 🍗 Đói | 100 | Giảm 1 điểm mỗi 6 giây (hết sạch sau ~10 phút nếu không ăn). Đói = 0: mất 1 HP mỗi 4 giây |
| 🪙 Xu | 30 | Tiền tệ chung |
| 🎒 Ba lô | 16 ô | Nguyên liệu/thức ăn xếp chồng tối đa 20/ô; vũ khí, giáp mỗi món 1 ô. Nâng cấp Kho tăng ô |
| 🏕️ Trại | Cấp 1 | Nâng cấp bằng nguyên liệu (5A.7) |
| ⭐ Điểm | 0 | Dùng xếp hạng (5A.10) |

**Đồng hồ ngày/đêm** (tính theo `playSec`, tức thời gian **đang chơi** của riêng mỗi người):
```
Độ dài 1 ngày  = 240 giây chơi:  Ban ngày 150s + Ban đêm 90s
20 phút chơi    ≈ 5 ngày trong game
Giới hạn/ngày   = giáo viên đặt (ví dụ 30 phút chơi mỗi ngày thật), hết thì nghỉ, mai chơi tiếp
Kết thúc        = thế giới đóng (hết `ends_at`), hoặc người chơi hạ trùm cuối
```
Ban đêm: quái ngoài khu vực **mạnh hơn 20%** (săn đêm = rủi ro cao, thưởng cao +30%), và có **Đợt tấn công trại** (5A.8).

### 5A.5. Khu vực và quái vật

| Khu vực | Mở khóa | Quái | Trùm |
|---|---|---|---|
| 🌲 **Rừng Xanh** | Có sẵn | Slime, Sói, Heo rừng | Heo Rừng Chúa |
| ⛰️ **Hang Đá** | Hạ trùm Rừng, hoặc có Kiếm đá + Áo da | Dơi, Bộ xương, Golem nhỏ | Golem Đá |
| ☠️ **Đầm Lầy Độc** | Hạ trùm Hang Đá, hoặc Kiếm sắt + Giáp sắt | Cóc độc, Nấm quái, Rắn hổ | Phù Thủy Đầm Lầy |
| 🌋 **Núi Lửa** *(V2)* | Hạ trùm Đầm Lầy | Quỷ lửa, Golem dung nham | Rồng Lửa |

Di chuyển giữa khu vực/trại mất **5 giây** (để không dịch chuyển liên tục để né rủi ro).

**Bảng quái (điểm khởi đầu để cân bằng):**

| Quái | HP | ATK* | Xu rớt | Rớt vật phẩm (xác suất) | Ghi chú |
|---|---|---|---|---|---|
| Slime | 40 | 8 | 5–10 | Chất nhầy 60%, Thảo dược 15% | Dễ, cho người mới |
| Sói | 70 | 12 | 10–18 | Thịt sống 70%, Da sói 40% | Nguồn thức ăn |
| Heo rừng | 90 | 14 | 12–20 | Thịt sống 90%, Ngà 25%, Táo 20% | |
| **Heo Rừng Chúa (trùm)** | 400 | 25 | 150 | Ngà vàng 100%, Rương hiếm 60%, Bản vẽ 30% | 2 giai đoạn |
| Dơi | 60 | 12 | 12–20 | Cánh dơi 50%, Đá 30% | Hay bay "né": 20% câu hỏi giới hạn 10s |
| Bộ xương | 110 | 18 | 20–30 | Xương 80%, Quặng sắt 35% | |
| Golem nhỏ | 160 | 22 | 30–45 | Đá 100%, Quặng sắt 60%, Pha lê 10% | Có giáp 20 (phải đòn mạnh) |
| **Golem Đá (trùm)** | 700 | 32 | 250 | Pha lê 100%, Rương hiếm 70%, Bản vẽ giáp 50% | 3 giai đoạn |
| Cóc độc | 120 | 20 | 25–35 | Nọc độc 60%, Thảo dược 40% | Gây **độc**: mất 2 HP/5s trong 20s nếu đánh sai |
| Nấm quái | 150 | 22 | 30–40 | Bào tử 70%, Pha lê 12% | |
| Rắn hổ | 130 | 26 | 35–50 | Da rắn 50%, Nọc độc 50% | Đánh nhanh: giới hạn 10s |
| **Phù Thủy Đầm Lầy (trùm)** | 1100 | 40 | 400 | Pha lê 100%, Rương sử thi 50%, Bản vẽ sử thi 40% | 3 giai đoạn |

\* ATK = sát thương quái gây ra khi người chơi trả lời sai/hết giờ (trước khi trừ giáp).

**Trùm có nhiều giai đoạn** và đổi dạng câu hỏi theo giai đoạn. Ví dụ Golem Đá: GĐ1 trắc nghiệm, GĐ2 kéo thả/ghép cặp (**phá lớp giáp đá**), GĐ3 hotspot (nhấn vào **lõi pha lê** để gây chí mạng).

**Quái mạnh dần theo ngày:** `HP × (1 + 0.10×(ngày-1))`, `ATK × (1 + 0.08×(ngày-1))`. Quái hồi sinh trong khu vực sau 20 giây (để farm liên tục).

### 5A.6. Vật phẩm, tiền và phần thưởng

**Xu (tiền):** rớt từ quái, bán nguyên liệu, thưởng đêm, thưởng streak. Dùng mua đồ ở Thương nhân.

**Nhóm vật phẩm:**

| Nhóm | Ví dụ | Dùng để |
|---|---|---|
| 🪵 **Nguyên liệu** | Gỗ, Đá, Quặng sắt, Da, Xương, Chất nhầy, Nọc độc, Pha lê, Thảo dược | Chế tạo, nâng cấp trại, bán lấy xu |
| 🍖 **Thức ăn** | Táo (+15 đói), Thịt sống (+10 đói, 25% mất 5 HP), Thịt nướng (+40), Súp thịt (+60 và +10 HP) | Chống đói |
| ⚔️ **Vũ khí** | Gậy gỗ (ATK 12, bền 40), Kiếm đá (22, 60), Kiếm sắt (38, 80), Kiếm pha lê (60, 100) | Tăng sát thương |
| 🛡️ **Giáp** | Áo da (giảm 15%, bền 50), Giáp sắt (30%, 80), Giáp pha lê (45%, 120) | Giảm sát thương nhận |
| 🧪 **Tiêu hao** | Băng gạc (+30 HP), Thuốc mạnh (+70 HP), Giải độc, Bình thêm giờ (+5s), **Loại 1 đáp án sai**, Bom khói (bỏ qua 1 quái) | Hỗ trợ |
| 🏕️ **Trại** | Rào gỗ/đá, Tháp pháo, Lửa trại, Kho | Phòng thủ, nấu ăn, mở rộng ba lô |
| 📜 **Bản vẽ** | Mở công thức hiếm (Kiếm pha lê, Tháp pháo...) | Chỉ rớt từ trùm/rương |
| 🎁 **Rương** | Rương thường/hiếm/sử thi | Mở ra nhận ngẫu nhiên nhiều món |

**Độ hiếm:** Thường (xám) → Hiếm (xanh) → Sử thi (tím) → Huyền thoại (vàng, chỉ trùm cuối). Chỉ số và hiệu ứng tăng theo độ hiếm.

**Cách nhận vật phẩm (mọi cách đều qua câu hỏi hoặc giao dịch):**
1. Quái chết → bảng rớt đồ (loot table) theo xác suất.
2. Hái lượm → nguyên liệu.
3. Chế tạo → vũ khí/giáp/thuốc (cần nguyên liệu + trả lời đúng).
4. Thương nhân / **Thợ rèn** → mua bằng xu (đồ cơ bản và trang bị đến cấp Sắt, kho đổi mới mỗi ngày).
5. Thưởng sống sót qua đêm, thưởng streak (đúng liên tiếp), thưởng hạ trùm.

**Thương nhân (ở trại):**
- Bán: thức ăn cơ bản, băng gạc, vài nguyên liệu cơ bản, 3 món ngẫu nhiên mỗi ngày. **Trang bị mua ở Thợ rèn** (mục 5A.6A).
- Mua lại nguyên liệu/đồ thừa với **50% giá gốc**.
- Giá tăng nhẹ nếu mua liên tục: `giá = giá_gốc × (1 + 0.10 × số_lần_đã_mua_hôm_nay)`.
- Đồ hiếm/sử thi **không bán**, chỉ rớt hoặc chế tạo → người chơi phải "farm" để mạnh, không thể chỉ cày xu.

### 5A.6A. Dùng xu mua trang bị (Thợ rèn) và các cách tiêu xu

Ngoài tự **chế tạo** (cần nguyên liệu + trả lời đúng), người chơi có thể **dùng xu kiếm được để mua trang bị** ở **Thợ rèn** tại trại. Hai cách này song song để người chơi tự chọn chiến lược:

| | Chế tạo | Mua bằng xu |
|---|---|---|
| Cần | Nguyên liệu + trả lời đúng câu hỏi | Chỉ cần đủ xu (và đủ điều kiện) |
| Chi phí | Rẻ hơn (nguyên liệu) | Đắt hơn (≈ 2,5–3 lần giá trị nguyên liệu bán lại) |
| Phù hợp | Người chơi có nhiều nguyên liệu, muốn tiết kiệm | Người đang dư xu, thiếu nguyên liệu, cần đồ gấp trước đêm |

**Danh mục Thợ rèn (điểm khởi đầu để cân bằng):**

| Trang bị | Ô | Giá (xu) | Điều kiện | Chỉ số |
|---|---|---|---|---|
| Gậy gỗ | Vũ khí | 40 | – | ATK 12, bền 40 |
| Kiếm đá | Vũ khí | 120 | – | ATK 22, bền 60 |
| Kiếm sắt | Vũ khí | 350 | Trại cấp 2 | ATK 38, bền 80 |
| Áo da | Giáp | 90 | – | Giảm 15%, bền 50 |
| Giáp sắt | Giáp | 300 | Trại cấp 2 | Giảm 30%, bền 80 |
| Ủng đi rừng | Phụ kiện | 180 | – | Di chuyển giữa khu vực 5s → 2s |
| Nhẫn may mắn | Phụ kiện | 250 | Trại cấp 2 | +10% tỉ lệ rớt đồ (tối đa 100%) |
| Bùa no bụng | Phụ kiện | 300 | Trại cấp 2 | Đói giảm chậm hơn 20% |

- Nhân vật có **3 ô trang bị**: Vũ khí, Giáp, Phụ kiện (1 món).
- **Trang bị cấp Pha lê, Sử thi, Huyền thoại không bán**, chỉ rớt từ trùm/rương hoặc chế tạo bằng bản vẽ. Nhờ vậy xu không "mua tất cả" và farm vẫn có giá trị.
- **Giới hạn chống "lăn cầu tuyết":** mỗi loại trang bị mua tối đa **1 lần/ngày game**; mua nhiều lần cùng loại giá tăng 10%/lần.
- **Bán lại:** 40% giá gốc × tỉ lệ độ bền còn lại.

**Các cách tiêu xu khác** (để xu luôn có chỗ dùng, không dư thừa vô nghĩa):

| Dịch vụ | Cách tính | Ghi chú |
|---|---|---|
| **Sửa đồ bằng xu** | `phí = 0.5 × giá_gốc × (1 − độ_bền_hiện_tại / độ_bền_tối_đa)` | Thay cho Bộ sửa đồ (chế bằng nguyên liệu) |
| **Cường hóa +1 / +2 / +3** | +1: 80 xu + 3 Đá · +2: 160 xu + 5 Đá + 2 Quặng sắt · +3: 300 xu + 8 Quặng sắt | Mỗi cấp tăng 10% chỉ số chính. **Luôn thành công, không có rủi ro mất đồ** |
| **Mua đồ tiêu hao** | Băng gạc, thức ăn, Bình thêm giờ... ở Thương nhân | Hồi phục nhanh khi sắp vào đêm |
| **Nâng cấp trại bằng xu + nguyên liệu** | Một phần chi phí nâng cấp trại có thể trả bằng xu (1 xu = 1 điểm giá trị nguyên liệu, tối đa 50% chi phí) | Chuyển xu dư thành tiến bộ trại |

**Nguyên tắc thiết kế (quan trọng với sản phẩm cho trẻ em):**
- **Không có cơ chế may rủi để mua bằng tiền**: không "gacha", không mở hộp ngẫu nhiên trả phí. Rương chỉ rớt từ quái/trùm (không bán), và xu **chỉ kiếm được trong game**.
- **Xu không bao giờ bán bằng tiền thật**, gói Plus cũng không tặng xu (xem 5A.17).
- Trần xu mang theo: 9.999.
- Mọi giá, điều kiện, giới hạn được **server đọc từ cấu hình** (`items.ts`), không nhận giá từ client.

**API:** `POST /api/survival/forge/buy {itemId}`, `/forge/sell {itemId}`, `/forge/repair {slot}`, `/forge/enhance {slot}`. Mỗi API kiểm tra: người chơi đang ở **trại**, không đang trong hành động khác, đủ xu, đủ ô, đạt điều kiện trại/khu vực, chưa vượt giới hạn mua hôm nay; ghi `survival_events` (`buy`, `sell`, `repair`, `enhance`).

### 5A.7. Chế tạo và trại

**Công thức mẫu (điểm khởi đầu):**

| Sản phẩm | Nguyên liệu | Yêu cầu |
|---|---|---|
| Gậy gỗ | 5 Gỗ | – |
| Kiếm đá | 3 Gỗ, 5 Đá | – |
| Kiếm sắt | 3 Gỗ, 6 Quặng sắt | Trại cấp 2 |
| Kiếm pha lê | 4 Gỗ, 8 Quặng sắt, 3 Pha lê | Bản vẽ + Trại cấp 3 |
| Áo da | 6 Da | – |
| Giáp sắt | 10 Quặng sắt, 3 Da | Trại cấp 2 |
| Thịt nướng | 1 Thịt sống, 1 Gỗ | Lửa trại |
| Băng gạc | 2 Thảo dược | – |
| Giải độc | 2 Thảo dược, 1 Nọc độc | – |
| Bộ sửa đồ | 3 Đá, 2 Gỗ | Hồi 50% độ bền |

**Nâng cấp trại:**

| Cấp | Nguyên liệu | Nhận được |
|---|---|---|
| 1 | Miễn phí | Lửa trại (nấu ăn), hàng rào gỗ (HP 100) |
| 2 | 30 Gỗ, 20 Đá | Hàng rào chắc (HP 200), Kho +4 ô, mở công thức cấp 2 |
| 3 | 40 Đá, 15 Quặng sắt, 5 Pha lê | Hàng rào đá (HP 350), **Tháp pháo** (tự hạ 2 quái/đợt), Kho +4 ô |

Nghỉ ở trại (không làm gì 10 giây) hồi một ít HP; **ngủ qua đêm không được** (đêm quái tấn công).

### 5A.8. Ban đêm: đợt quái tấn công trại

Mỗi khi trời tối, trại bị tấn công một **đợt**:

```
số quái trong đợt = 3 + 2 × (ngày - 1)           # ngày 1: 3 quái, ngày 5: 11 quái
Tháp pháo (cấp 3) tự hạ trước: 2 quái
Người chơi: trả lời tối đa (số quái) câu hỏi, mỗi câu 12 giây
   đúng  → hạ 1 quái, rớt ít xu/nguyên liệu
   sai / hết giờ → 1 quái "chạm" hàng rào: mất (ATK quái) HP của hàng rào
Hết đêm → quái còn sống tấn công lần cuối
Hàng rào hết HP → mất 25% xu và 25% nguyên liệu trong ba lô; hàng rào hồng một phần sửa bằng Gỗ/Đá
Sống sót với rào còn nguyên → thưởng: Rương + xu
Người chơi không muốn chống đỡ (đi săn đêm / AFK) → mọi quái coi là "chạm" rào
```
Đợt tấn công là lúc **kiến thức được kiểm tra dồn dập**, và là "nhịp" tạo kịch tính. Mỗi người có đêm riêng theo đồng hồ chơi của mình; muốn cả lớp cùng chiến đấu một lúc, giáo viên mở **Sự kiện lớp** (mục 5B.4).

### 5A.9. Chết, hồi sinh và thắng/thua

- **HP về 0:** nhân vật "ngất", hồi sinh tại trại sau 10 giây, HP 50%, đói 50%.
- **Mất:** 30% xu và 30% mỗi chồng nguyên liệu (làm tròn xuống). **Giữ nguyên** vũ khí, giáp (hao thêm 10% độ bền) và thức ăn.
- Không bị loại khỏi ván, học sinh yếu vẫn có thể tiếp tục.
- Tùy chọn giáo viên: **chế độ khó** (mất 50%, đói giảm nhanh hơn) hoặc **chế độ yên bình** (không đói, không đêm, để ôn tập, vẫn kiếm đồ và đánh quái).

**Cách tính điểm:**
```
điểm = số_quái_hạ × 10
     + số_trùm_hạ × 300
     + số_ngày_sống_sót × 100
     + số_đêm_giữ_nguyên_rào × 50
     + xu_hiện_có × 0.2
     + điểm_trang_bị (tổng độ hiếm vũ khí/giáp × 20)
     + độ_chính_xác(%) × 2
     − số_lần_chết × 50
```
**Danh hiệu cuối ván** để ai cũng có điều tự hào: "Thợ săn trùm" (hạ nhiều trùm nhất), "Thần chính xác" (đúng nhiều nhất), "Người sống sót" (không chết lần nào), "Thợ rèn" (chế nhiều nhất), "Nhà giàu" (nhiều xu nhất), "Lính gác đêm" (giữ rào lâu nhất).

### 5A.10. Chế độ chơi con

| Chế độ | Mô tả | Giai đoạn |
|---|---|---|
| **Solo sinh tồn** | Mỗi người một đảo/trại riêng, lưu lâu dài, so điểm khi thế giới đóng | **MVP** |
| **Yên bình (ôn tập)** | Không đói, không đêm, không mất đồ khi chết; phù hợp học sinh nhỏ hoặc giờ ôn tập | MVP (chỉ là tùy chọn cờ cấu hình) |
| **Bộ tộc (Co-op)** | Cả đội chung 1 trại, kho chung, chung 1 trùm khổng lồ, có thể chuyển đồ cho nhau; đêm cả đội cùng chống đỡ | V2 |
| **Thương mại lớp** | Học sinh trao đổi/mua bán vật phẩm (có kiểm duyệt) | V3 |
| **Đột kích (PvP tùy chọn, mặc định TẮT)** | Cướp xu của trại khác khi người đó đang offline | V3 (cân nhắc kỹ vì dễ gây mâu thuẫn trong lớp) |

### 5A.11. Công thức tính toán (tất cả chạy ở SERVER)

```
# Sát thương người chơi gây ra
tốc_độ_thưởng = 1 + 0.3 * (1 - thời_gian_dùng / thời_gian_giới_hạn)         # 1.0 .. 1.3
sát_thương    = vũ_khí.atk × (1 + buff) × hệ_số_đúng × hệ_số_dạng × tốc_độ_thưởng × (chí_mạng ? 2 : 1)
              # hệ_số_đúng = kết quả grade() 0..1
              # hệ_số_dạng: single=1.0, true_false=0.6, multi_select=mỗi đáp án đúng 1 đòn, ...
sát_thương_thực = max(1, sát_thương - giáp_quái)

# Quái đánh trả khi sai/hết giờ
sát_thương_nhận = quái.atk × (1 + 0.08×(ngày-1)) × (đêm ? 1.2 : 1) × (1 - giảm_giáp_người_chơi)

# Xu và đồ rớt
xu_rớt   = random(min, max) × (1 + min(streak, 5) × 0.05) × (đêm ? 1.3 : 1)
đồ_rớt   = với mỗi mục trong loot table: roll ≤ xác_suất (dùng crypto.randomInt ở server, ghi log)

# Đói
đói = max(0, đói_lần_cuối - (now - lastUpdate) / 6)

# Độ bền
mỗi lần đánh đúng: vũ_khí.độ_bền -= 1;  mỗi lần nhận sát thương: giáp.độ_bền -= 1
độ_bền = 0 → vũ khí/giáp "hỏng", sát thương/giảm giáp = 0 cho đến khi sửa
```
Mọi hằng số nằm trong `config.ts` (5A.12) để cân bằng mà không phải sửa logic.

### 5A.12. Cấu hình, trạng thái người chơi, cấu trúc code

```
src/game-modes/survival/
  config.ts          // hằng số: độ dài ngày/đêm, tốc độ đói, hệ số, thời gian từng hành động
  zones.ts           // khu vực, điều kiện mở khóa, bảng quái theo khu
  monsters.ts        // định nghĩa quái + loot table
  items.ts           // định nghĩa vật phẩm (nhóm, độ hiếm, giá, hiệu ứng)
  recipes.ts         // công thức chế tạo + yêu cầu trại
  camp.ts            // nâng cấp trại, hàng rào, tháp pháo
  clock.ts           // hàm thuần tính ngày/đêm, mốc đợt tấn công
  engine.ts          // hàm thuần: applyHunt, applyGather, applyCraft, resolveWave, tick(now)
  loot.ts            // roll loot (RNG phía server)
  shop.ts            // kho Thương nhân mỗi ngày (sinh theo seed ngày + session)
  selectQuestion.ts  // chọn câu hỏi theo hành động + độ khó + dạng câu hỏi ưu tiên
  TeacherBoard.tsx   // bảng điều khiển giáo viên: tiến độ, xếp hạng, sự kiện nổi bật
  Player.tsx         // màn chơi
  index.ts           // đăng ký vào game-modes registry
```
> Tách `engine.ts` thành **hàm thuần** (nhận state + hành động + `now`, trả state mới) để vừa test dễ, vừa chạy giống nhau ở API route lẫn khi mô phỏng cân bằng (5A.19).

```ts
// monsters.ts
export type LootEntry = { itemId: string; chance: number; min?: number; max?: number };
export type MonsterDef = {
  id: string; name: string; zone: string; kind: "normal" | "boss";
  hp: number; atk: number; armor?: number;
  coins: [number, number];
  loot: LootEntry[];
  tier: 1 | 2 | 3;                         // → độ khó câu hỏi
  preferTypes?: string[];                  // dạng câu hỏi ưu tiên
  timeFactor?: number;                     // 0.5 = chỉ còn 50% thời gian
  onWrong?: { status: "poison"; seconds: number; dps: number };
  phases?: { hpBelowPct: number; types: string[]; note?: string }[];   // dành cho trùm
  sprite: string;
};

// items.ts
export type ItemDef = {
  id: string; name: string; group: "material"|"food"|"weapon"|"armor"|"consumable"|"camp"|"blueprint"|"chest";
  rarity: "common"|"rare"|"epic"|"legendary";
  stack: number;
  sellValue: number; buyPrice?: number;           // không có buyPrice = không bán
  slot?: "weapon" | "armor" | "accessory";
  requires?: { campLevel?: number; zone?: string };   // điều kiện mua ở Thợ rèn
  dailyLimit?: number;                            // giới hạn mua mỗi ngày game
  stats?: { atk?: number; defPct?: number; durability?: number };
  effect?: { hp?: number; hunger?: number; cure?: "poison"; extraSeconds?: number; fiftyFifty?: boolean };
};
```

**Trạng thái người chơi** (`session_players.state`, JSONB, **chỉ server được ghi**):
```json
{
  "v": 1,
  "hp": 82, "hunger": 64, "coins": 120, "streak": 3,
  "lastTickAt": "2026-01-01T10:03:21.000Z",
  "playSec": 412, "dailyPlay": { "date": "2026-01-01", "sec": 412 },
  "zone": "forest", "movingUntil": null,
  "fog": { "forest": 62, "cave": 100 }, "revealed": ["rich_wood_1"],
  "inventory": { "wood": 8, "stone": 3, "meat_raw": 2, "bandage": 1 },
  "equipment": { "weapon": { "id": "sword_stone", "dur": 41, "plus": 1 }, "armor": { "id": "armor_leather", "dur": 33, "plus": 0 }, "accessory": { "id": "boots_forest", "dur": 60 } },
  "slots": 16,
  "camp": { "level": 2, "fenceHp": 160, "fenceMax": 200, "turret": false },
  "action": { "kind": "hunt", "monsterId": "wolf", "monsterHp": 38, "monsterMaxHp": 77,
              "question": { "id": "uuid", "servedAt": "2026-01-01T10:03:10.000Z", "round": 0 } },
  "status": [{ "type": "poison", "until": "2026-01-01T10:03:30.000Z", "dps": 2 }],
  "wave": { "day": 2, "total": 5, "remaining": 3, "endsAtPlaySec": 540, "resolved": false },
  "shop": { "day": 2, "stock": ["bandage", "apple", "wood"], "bought": { "bandage": 1 } },
  "recipesUnlocked": ["wood_staff", "sword_stone", "bandage"],
  "bossesDefeated": ["forest"],
  "stats": { "kills": 12, "correct": 30, "wrong": 9, "deaths": 1, "crafted": 4, "nightsHeld": 1 }
}
```
Mỗi lần cập nhật dùng khóa lạc quan (cột `state_version` hoặc so sánh `updated_at`) để hai request đồng thời của cùng một người **không ghi đè lẫn nhau** (xem 5A.13).

### 5A.13. API, luồng chơi và thay đổi database

**API (Route Handlers hoặc Server Actions, đều xác thực + kiểm tra người chơi thuộc phòng đang `playing`):**

| Endpoint | Việc làm |
|---|---|
| `POST /api/world/join` | Vào thế giới (từ trang lớp hoặc link/QR), tạo hoặc khôi phục nhân vật (mục 5B.3) |
| `GET /api/survival/state` | Khôi phục trạng thái (khi F5/mất mạng): chạy `tick(now)` rồi trả state + đồng hồ ngày/đêm |
| `POST /api/survival/action/start` | Bắt đầu hành động `{kind: hunt\|gather\|explore\|craft\|defend, targetId}` → chọn câu hỏi, lưu `action.question`, trả **nội dung câu hỏi đã xáo trộn, không có `answer_key`** |
| `POST /api/survival/action/answer` | `{questionId, answer}` → kiểm tra đúng câu đang phục vụ, chưa quá giờ (+dung sai ~1s) → `grade()` → `engine.apply...()` → lưu |
| `POST /api/survival/move` | Chuyển khu vực (kiểm tra mở khóa, đặt `movingUntil`) |
| `POST /api/survival/use-item` | Ăn, dùng thuốc, dùng vật phẩm hỗ trợ |
| `POST /api/survival/shop/buy` / `sell` | Mua/bán với Thương nhân (kiểm tra xu, ô trống, kho hôm nay) |
| `POST /api/survival/camp/upgrade` | Nâng cấp trại (kiểm tra đủ nguyên liệu) |
| `POST /api/survival/equip` | Trang bị, tháo đồ |
| `POST /api/survival/forge/buy` / `sell` / `repair` / `enhance` | Thợ rèn: mua trang bị bằng xu, bán lại, sửa đồ, cường hóa (mục 5A.6A) |

Mỗi endpoint đều bắt đầu bằng `state = tick(state, now)` (trừ đói, độc, kết toán đợt tấn công đã hết hạn, hồi quái...) rồi mới xử lý hành động.

**Thay đổi database:**
```sql
-- Câu hỏi có độ khó và nhãn chủ đề (để ghép với quái/khu vực)
alter table public.questions
  add column if not exists difficulty smallint not null default 1 check (difficulty between 1 and 3),
  add column if not exists tags text[] not null default '{}';
create index if not exists questions_set_diff on public.questions (set_id, difficulty);

-- Cho phép một người gặp lại cùng câu hỏi ở vòng sau (xoay vòng khi hết câu)
alter table public.session_answers add column if not exists round integer not null default 0;
alter table public.session_answers drop constraint if exists session_answers_player_id_question_id_key;
alter table public.session_answers add constraint session_answers_unique unique (player_id, question_id, round);

-- Khóa lạc quan cho state người chơi
alter table public.session_players add column if not exists state_version integer not null default 0;

-- Nhật ký sự kiện (phục vụ báo cáo, phát hiện gian lận, gỡ lỗi cân bằng)
create table if not exists public.survival_events (
  id bigserial primary key,
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid not null references public.session_players(id) on delete cascade,
  type text not null,            -- 'kill','loot','craft','death','wave_result','boss_down','buy','sell'
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index on public.survival_events (session_id, created_at);
alter table public.survival_events enable row level security;   -- chỉ server/giáo viên đọc

-- Tiến trình lâu dài của tài khoản (sau mỗi ván)
alter table public.profiles
  add column if not exists xp integer not null default 0,
  add column if not exists level integer not null default 1;
```

Ghi state an toàn khi có 2 request cùng lúc:
```sql
update public.session_players
set state = $new_state, state_version = state_version + 1, score = $score
where id = $player_id and state_version = $expected_version;
-- 0 dòng bị ảnh hưởng → có request khác vừa ghi: đọc lại state, tính lại, thử lại
```

**Realtime:** server tổng hợp bảng xếp hạng và **sự kiện nổi bật** ("Minh vừa hạ Heo Rừng Chúa!", "Lớp 8A1 sắp hết đêm 2!") rồi broadcast **mỗi 3 giây** qua kênh riêng tư `world:{id}` (mục 5B.4) tới giáo viên và người chơi. Không broadcast từng đòn đánh. Để không nghẽn khi 100+ người chơi, gộp ghi DB và cân nhắc cache ngắn hạn (Upstash Redis) cho bảng xếp hạng.

### 5A.14. Chống gian lận riêng cho chế độ này

- Client **không bao giờ** gửi HP, xu, độ bền, kết quả rớt đồ. Client chỉ gửi **ý định** (hành động, câu trả lời, `itemId`).
- RNG rớt đồ chạy ở server (`crypto.randomInt`), ghi vào `survival_events`.
- **Máy trạng thái hành động:** mỗi người chỉ có 1 `action` tại một thời điểm; `answer` chỉ hợp lệ khi `action.question.id` trùng; không gửi lại câu cũ.
- Thời gian đo ở server (`servedAt` → lúc nhận). Đồng hồ chơi (`playSec`) do server cộng dồn, client không tự chỉnh được; mỗi lần tick tối đa 60 giây để không ai "treo máy" kiếm lợi.
- Rate limit mỗi người (không quá ~2 request/giây) + giới hạn kích thước payload.
- Kiểm tra **tính hợp lý** khi tick: tốc độ nhận xu/vật phẩm quá cao so với số câu trả lời → ghi cờ cho giáo viên.
- Hotspot: kiểm tra toạ độ click nằm trong [0,1], lưu toạ độ gốc.
- Chặn nhiều phiên cùng một tài khoản trong cùng một phòng (hoặc đồng bộ chung state).
- Việc đổi/chuyển đồ giữa người chơi (V3) phải qua server, có giới hạn và log.

### 5A.15. Màn hình cần thiết kế

| Màn hình | Thành phần chính |
|---|---|
| **Tạo Thế giới (giáo viên)** | Chọn lớp hoặc tạo link/QR, thời gian mở–đóng, giới hạn phút chơi mỗi ngày, độ khó, chế độ yên bình/khó, gán bộ câu hỏi/nhãn cho từng khu vực, bật/tắt vật phẩm hỗ trợ trả lời |
| **Danh sách thế giới / Vào đảo** | Trang chủ học sinh: thế giới của lớp, thế giới chơi một mình, nút "Tiếp tục"; lần đầu thì chọn nhân vật (skin) |
| **Màn chính (bản đồ/khu vực)** | Thanh HP, đói, xu, đồng hồ ngày/đêm, danh sách quái/tài nguyên trong khu, nút sang Trại/di chuyển |
| **Màn chiến đấu/hái lượm** | Ảnh quái hoặc tài nguyên, thanh máu quái, câu hỏi bên dưới, đếm ngược, hiệu ứng đánh/trúng |
| **Màn chế tạo** | Công thức, nguyên liệu đang có, câu hỏi kéo thả |
| **Trại** | Hàng rào, tháp pháo, lửa trại, nâng cấp, Thương nhân |
| **Ba lô** | Lưới ô, trang bị, ăn/dùng, bán, sửa đồ |
| **Đợt tấn công đêm** | Đếm số quái còn lại, hàng rào, câu hỏi dồn dập |
| **Màn hồi sinh** | Đếm ngược 10s, thông báo mất gì |
| **Kết thúc** | Podium, danh hiệu, thống kê, XP/Đom Đóm nhận được |
| **Bảng điều khiển giáo viên** | Bảng xếp hạng, người đang online, tiến độ từng học sinh, sự kiện nổi bật, người đang gặp khó; nút tạm dừng/đóng thế giới, đổi link, khóa người chơi, mở sự kiện lớp |

**Ưu tiên điện thoại:** nút lớn, thao tác bằng ngón cái, kéo thả/hotspot dùng thoải mái, tải nhanh trên máy yếu. **Không dùng kéo-thả bản đồ phức tạp**; di chuyển bằng nút chọn khu vực.

### 5A.16. Hình ảnh, âm thanh

- Dùng bộ ảnh **tự vẽ**, mua (itch.io, Craftpix...), hoặc **miễn phí có giấy phép rõ ràng** (kenney.nl là CC0; OpenGameArt có nhiều loại giấy phép). Đọc kỹ điều khoản dùng thương mại, ghi nguồn nếu cần.
- **Không dùng** nhân vật/quái/vật phẩm từ game có bản quyền (Minecraft, Pokémon, Terraria, Blooket...). Tên, hình, công thức đều tự đặt.
- Hoạt ảnh: sprite sheet + CSS/Framer Motion hoặc Lottie; hiệu ứng nhẹ (số sát thương bay lên, rớt đồ, rung màn hình).
- Âm thanh: nhạc nền ngày/đêm khác nhau, tiếng đánh, rớt đồ, chế tạo; có nút tắt và nhớ lựa chọn.
- Tối ưu: `webp`, nén sprite, lazy-load trùm và khu vực chưa mở, vì lớp học thường dùng thiết bị yếu, mạng chậm.

### 5A.17. Phân chia Free / Plus cho chế độ này

| Nội dung | Free | Plus |
|---|---|---|
| Solo sinh tồn, chế độ yên bình | ✅ | ✅ |
| Khu vực | Rừng Xanh, Hang Đá | + Đầm Lầy, Núi Lửa |
| Bộ tộc (Co-op) | ❌ | ✅ |
| Skin nhân vật, thú cưng thẩm mỹ | Cơ bản | Độc quyền |
| Tùy chỉnh phòng (độ khó, gán bộ câu hỏi theo khu vực, bật/tắt hỗ trợ) | Cơ bản | Đầy đủ |
| Báo cáo học tập chi tiết theo khu vực/chủ đề | Cơ bản | Đầy đủ |
| Dạng câu hỏi trong game | Theo gói câu hỏi (mục 10) | Tất cả |

**Nguyên tắc:** Plus chỉ bán **nội dung, tiện ích cho giáo viên và thẩm mỹ**. **Không bán** xu, vật phẩm mạnh hoặc lợi thế trong ván (pay-to-win), để học sinh không thấy bất công.

### 5A.18. Công cụ cho giáo viên (điểm mạnh về giáo dục)

- **Gán bộ câu hỏi/nhãn theo khu vực:** ví dụ Rừng = Chương 1, Hang Đá = Chương 2, Đầm Lầy = Chương 3 → học sinh "đi qua" từng phần kiến thức. Nếu chỉ dùng 1 bộ câu hỏi thì lấy chung.
- **Độ khó:** mỗi câu có `difficulty` 1–3 (giáo viên đặt, hoặc để mặc định); quái càng mạnh, câu càng khó.
- **Điều chỉnh luật:** thời lượng ván, chế độ yên bình/khó, tắt đói, tắt đợt tấn công đêm, bật/tắt vật phẩm hỗ trợ trả lời (50/50, gợi ý), số lần chết cho phép.
- **Báo cáo:** tỉ lệ đúng theo **khu vực/nhãn chủ đề** (thấy ngay chương nào cả lớp yếu), theo **dạng câu hỏi**, thời gian trung bình mỗi câu, học sinh bị "kẹt" ở khu vực nào, câu hỏi nào bị sai nhiều nhất.
- **Chọn nhóm kỹ năng:** giáo viên có thể cho một ván chỉ gồm "chế tạo" (toàn câu kéo thả) để luyện dạng đó.

### 5A.19. Kiểm thử và cân bằng

**Mô phỏng tự động (rất nên làm):** vì `engine.ts` là hàm thuần nên có thể viết script chạy **"bot người chơi"** với độ chính xác khác nhau (40%, 60%, 80%, 95%) chơi hết một ván 20 phút giả lập, in kết quả. Mục tiêu cân bằng tham khảo:

| Độ chính xác bot | Kết quả mong muốn |
|---|---|
| 40% | Sống qua ~2–3 ngày, chết vài lần, vẫn chơi hết ván được |
| 60% | Sống hết 5 ngày, hạ trùm Rừng, có thể sang Hang Đá |
| 80% | Hạ 2 trùm, trang bị khá |
| 95% | Hạ 3 trùm, điểm cao nhất, nhưng **không "phá đảo" quá dễ** |

**Danh sách kiểm thử:**
- [ ] Unit test `engine.ts` + `clock.ts` + `loot.ts` (cố định seed RNG): sát thương, đói, độc, độ bền, quái chết, rớt đồ, chết/hồi sinh, đợt tấn công, thắng/thua.
- [ ] Test "tick" sau thời gian gián đoạn (mất mạng 3 phút): đói/độc/đợt tấn công tính đúng.
- [ ] Hai request đồng thời cùng người → không mất/nhân đôi vật phẩm (khóa lạc quan).
- [ ] Gọi `buy` khi không đủ xu/ô trống, `craft` thiếu nguyên liệu, `answer` câu cũ hoặc muộn → bị từ chối.
- [ ] Không có chỗ nào để client "đặt" HP/xu/vật phẩm.
- [ ] Mô phỏng 100–300 người chơi gửi `answer` đồng thời (k6/Artillery), theo dõi độ trễ và lỗi.
- [ ] **Playtest thật** với 2–3 lớp: học sinh có hiểu luật sau 2 phút? Có chán/nản lúc nào? Đồ nào quá mạnh/yếu? Đêm có quá khó?
- [ ] Thử trên điện thoại cấu hình thấp, mạng 3G chậm.

### 5A.20. Phạm vi MVP và thứ tự làm

**MVP sinh tồn (làm gọn để kịp ra mắt):**
- 1 khu vực **Rừng Xanh** + **Trại cấp 1–2**, 4 quái (Slime, Sói, Heo rừng, Dơi/…) + **1 trùm** (Heo Rừng Chúa)
- Hành động: **Đi săn, Hái lượm, Chế tạo (6 công thức), Thương nhân**
- Chỉ số: HP, đói, xu, ba lô; ngày/đêm + **đợt tấn công đêm đơn giản**
- Dạng câu hỏi trong game: `single_choice`, `true_false`, `hotspot` (điểm yếu); sau đó thêm kéo thả (chế tạo) và `multi_select` (combo)
- Chết/hồi sinh, bảng xếp hạng, màn kết thúc, báo cáo cơ bản

**Thứ tự làm đề xuất:**
1. `clock.ts` + `engine.ts` + `config` + unit test (chưa cần giao diện).
2. API `state`, `action/start`, `action/answer` cho **Đi săn** (1 quái), giao diện chiến đấu cơ bản.
3. Túi đồ, loot table, đói, hồi sinh.
4. Hái lượm + Thương nhân + công thức chế tạo.
5. Đợt tấn công đêm + hàng rào + nâng cấp trại.
6. Trùm nhiều giai đoạn, khu vực thứ 2.
7. Gắn thêm dạng câu hỏi mới vào hành động (hotspot điểm yếu trước, kéo thả cho chế tạo, multi-select cho combo).
8. Bảng xếp hạng + sự kiện nổi bật, danh hiệu, thống kê giáo viên.
9. Script mô phỏng cân bằng + playtest.

**Làm sau:** Bộ tộc (Co-op), Đầm Lầy/Núi Lửa, thú cưng, thương mại trong lớp, Đột kích (PvP tùy chọn), chế độ "mùa" theo chủ đề (Đại dương, Vũ trụ...).

### 5A.21. Cơ chế Sương mù (đặc trưng của Foggo)

> Cơ chế gắn với tên và câu chuyện của sản phẩm: **mỗi khu vực của đảo bị sương mù bao phủ, mỗi câu trả lời đúng làm tan sương để khám phá thêm.** Tiến độ tan sương cũng chính là **tiến độ nắm kiến thức** của học sinh trong từng chương.

**Cách hoạt động:**
- Mỗi khu vực bắt đầu với **100% sương**. Khi sương còn dày chỉ thấy quái cơ bản và nguyên liệu thường.
- Hành động mới **🌫️ Thám hiểm (Explore):** chọn một hướng đi → trả lời **một câu hỏi** (ưu tiên `hotspot`, `drag_match`, `true_false_multi`; có thể dùng chính ảnh bản đồ làm đề bài). Đúng thì sương giảm và có thể lộ ra điểm đặc biệt; sai thì sương **tăng nhẹ** (+2%) và bạn "lạc đường", gặp một quái thường.
- **Các mốc khám phá:**

| Sương còn lại | Lộ ra |
|---|---|
| ≤ 70% | **Bãi tài nguyên giàu** (hái lượm cho gấp đôi sản lượng) |
| ≤ 50% | **Rương khám phá** (nguyên liệu, thức ăn, có thể có bản vẽ thường) |
| ≤ 30% | **Hang trùm** lộ ra, chỉ khi đó mới thách đấu được trùm khu vực |
| 0% | **Tan sương hoàn toàn**: thưởng rương hiếm + "Bản đồ khu vực" (+10% xu rớt trong khu) + điểm khám phá |

- **Ban đêm sương dày trở lại** thêm 10% ở khu vực đang ở, nhưng các điểm **đã lộ vẫn giữ nguyên**, nên không mất tiến độ; sương dày chỉ làm quái đêm khó thấy và nguy hiểm hơn.
- **Điều kiện đánh trùm** vì thế là: sương ≤ 30% **và** đủ trang bị gợi ý, buộc người chơi phải khám phá trước khi lao vào trùm.

**Công thức (chạy ở server):**
```
sương_giảm = 5% × hệ_số_đúng × tốc_độ_thưởng × (0.5 + 0.5 × sương_hiện_tại/100)
             # càng gần hết sương càng khó giảm, tránh "cày sương" quá dễ
sai / hết giờ:  sương += 2%  và gặp 1 quái thường của khu vực
thời gian một câu Thám hiểm: 20 giây
```

**Dữ liệu trạng thái:** thêm vào `state` của người chơi:
```json
"fog": { "forest": 62, "cave": 100 },
"revealed": ["rich_wood_1", "chest_forest_1"]
```
Sự kiện ghi vào `survival_events`: `explore`, `fog_milestone`, `fog_cleared`.

**Giá trị cho giáo viên:** mỗi khu vực = một chương, nên **"bản đồ sương" của lớp** (tỉ lệ sương còn lại của từng khu vực, trung bình cả lớp) cho thấy ngay chương nào học sinh **chưa khám phá hoặc đang yếu**. Đây là báo cáo trực quan và dễ hiểu hơn bảng điểm thông thường.

**Giao diện:** bản đồ khu vực phủ một lớp mờ, mỗi câu đúng làm lớp mờ tan dần theo hướng đã chọn; điểm đặc biệt hiện ra với hiệu ứng nhỏ. Linh vật **Gô** (chú cáo cầm đèn lồng) soi đường, đèn sáng dần khi sương tan.

**MVP:** chỉ làm cơ chế này cho **Rừng Xanh** (mốc 70% / 30% / 0%), các khu sau tái sử dụng cùng code.

### 5A.22. Chế Độ Hầm Ngục Lớp Học vs Bãi Farm Quái Tại Nhà (Class Dungeon & Home Solo Farm)

> Cơ chế phân tách trải nghiệm học tập và chơi game linh hoạt theo bối cảnh: **Hầm Ngục Trên Lớp** và **Bãi Farm Quái Tại Nhà**.

1. **Hầm ngục trên lớp (Class Dungeon Mode):**
   - **Thời điểm kích hoạt:** Khi giáo viên mở phòng trên lớp (`kind = 'class'` hoặc link trực tiếp không cần PIN).
   - **Cấu hình rớt đồ hiếm & tỉ lệ rớt:** Giáo viên khi khởi tạo hầm ngục được chọn danh sách trang bị hiếm đặc biệt (`DUNGEON_RARE_ITEMS` như *Thanh Kiếm Hoàng Kim, Đèn Lồng Cổ Ma Thuật, Long Giáp Thần Long, Thần Dược Phục Sinh, Khiên Băng Vĩnh Cửu, Nhẫn Bóng Đêm*) và tùy chỉnh tỉ lệ rơi đồ hiếm (10%, 25%, 50%, 100%).
   - **Cơ chế rớt đồ:** Khi học sinh trả lời đúng câu hỏi và hạ gục quái vật hoặc trùm, hệ thống ở server (`applyHunt` trong `engine.ts`) sẽ tung xúc xắc theo tỉ lệ rơi đồ do giáo viên đặt. Rơi đồ thành công sẽ phát sự kiện feed realtime và đưa vật phẩm vào hành trang của học sinh.
   - **Tương tác nhóm:** Cả lớp cùng nhìn thấy bảng xếp hạng realtime, thông báo đồng đội hạ quái và cùng bảo vệ khu trại về đêm.

2. **Bãi farm quái tại nhà (Home Solo Farming Mode):**
   - **Thời điểm kích hoạt:** Khi ở nhà hoặc khi giáo viên chưa mở hầm ngục trên lớp, học sinh đăng nhập vào hệ thống sẽ được tự động điều hướng / hiển thị bãi luyện solo (`kind = 'solo'`, khởi tạo qua Server Action `startHomeFarmSession`).
   - **Vòng lặp chơi (Gameplay Loop):** Học sinh vào bãi luyện cá nhân, trả lời câu hỏi ôn bài để đi săn quái vật bóng tối, tích lũy Vàng và Đom Đóm.
   - **Tiệm Cô Túi & Thợ Rèn Bác Búa:** Học sinh dùng số Vàng cày được để mua vũ khí (Kiếm Gỗ, Kiếm Sắt, Dao Găm), áo giáp và thuốc hồi phục.
   - **Tính kế thừa liên tục (Persistence):** Toàn bộ số Vàng tích lũy và trang bị cày được từ bãi farm tại nhà được lưu trữ vĩnh viễn trên tài khoản học sinh. Khi giáo viên mở hầm ngục trên lớp, học sinh đem nguyên vẹn trang bị mạnh mẽ vào hầm ngục lớp để sẵn sàng nghênh chiến quái vật và trùm lớn.

### 5A.23. Đấu Trường Săn Quái Bất Tận & Hoạt Họa Đối Kháng Theo Lượt (Gauntlet Arena & Combat Animation)

> Đấu trường săn quái RPG trực quan, nơi câu trả lời biến thành đòn đánh vật lý thực tế giữa **Nhà Thám Hiểm** và **Quái Vật**.

1. **Xuất hiện quái vật ngẫu nhiên liên hoàn (Continuous Monster Gauntlet):**
   - Thay vì phải chọn từng con quái thủ công, học sinh bước vào đấu trường liên hoàn (`MonsterBattleArena`).
   - Khi một con quái bị tiêu diệt ($HP \le 0$), quái sẽ gục ngã (mắt `x x`, nát tan), bắn ra Vàng và Điểm số.
   - Ngay sau 1.2s ăn mừng, hệ thống **tự động bốc ngẫu nhiên quái vật tiếp theo** (`getRandomFarmMonster`: Slime, Sói con, Sói xám, Nhện sương mù, Heo rừng, Goblin...) xuất hiện với hiệu ứng rơi xuống đất. Trận đấu diễn ra liên tục không bị đứt đoạn.

2. **Hoạt họa tương tác thật theo lượt (Turn-based RPG Combat):**
   - **Khi học sinh trả lời đúng:** Nhân vật lao vút về phía trước (`dash forward`), vung kiếm chém đường kiếm khí hình bán nguyệt (`sword slash`), quái vật bị giật lùi và nhấp nháy đỏ rực (`hit`), số sát thương nổi lên màn hình (`💥 -X HP!`).
   - **Khi quái vật phản công (hoặc khi trả lời sai):** Quái vật nhún người bật nhảy lao tới tấn công nhân vật, nhân vật bị giật lùi, nhấp nháy đỏ, hiển thị hào quang khiên chắn (`🛡️ Giảm -X%`) và số sát thương nhận vào (`💔 -Y HP`).
   - **Bộ Sprite Slime 8 frames:** Khối Slime xanh có nhịp thở nhấp nhô `idle 1-2`, co dãn chuẩn bị `prep`, bật nhảy lao tới cắn `jump attack`, tiếp đất `land`, trúng đòn méo người `hit > <`, và gục ngã dẹp lép `dead x x`.

3. **Quyền Rút lui (Flee / Run away) có chế tài phạt:**
   - Nút **"🏃 Rút Lui"** cho phép học sinh rời khỏi sàn đấu khi hết máu hoặc quái quá mạnh.
   - **Hình phạt tháo chạy (`applyFlee`):** Trong lúc quay lưng bỏ chạy, quái vật đuổi theo cào trúng lưng gây mất 15-20 HP (được giảm trừ nhờ giáp/mũ/khiên) và bị **trừ 50 Điểm Rank**, đồng thời ngắt chuỗi combo Streak.

### 5A.24. Cơ Chế Cấp Cứu Khi Hết Máu & Bảo Lưu 100% Xu Cho Tân Thủ

1. **Chỉ số cân bằng thân thiện cho tân thủ:**
   - Quái vật giai đoạn đầu được điều chỉnh ở mức độ vừa phải (Slime 20 HP, 3 ATK; Sói con 30 HP, 4 ATK), sát thương cơ bản người chơi 12 ATK. Tân thủ chỉ cần trả lời 1-2 câu hỏi là hạ gục quái.
   - Tốc độ giảm đói giảm nhẹ (12s/điểm) giúp học sinh tập trung suy nghĩ câu hỏi học tập mà không bị áp lực đói quá nhanh.
2. **Cấp cứu & Mua item máu khi hết máu (`emergencyHealOrRevive`):**
   - Khi nhân vật kiệt sức ($HP \le 0$): Thay vì bị văng khỏi ván hoặc trừng phạt nặng nề, hệ thống mở popup Cấp Cứu Sinh Lực với 3 lựa chọn:
     - **Dùng bình máu / thức ăn có sẵn trong túi:** Hồi phục sinh lực tức thì mà không tốn xu.
     - **Mua Bình Máu Cấp Cứu tại trận:** Giá ưu đãi tân thủ chỉ 10 Xu, hồi ngay +50 HP và tiếp tục vung kiếm chiến đấu tiếp.
     - **Hồi sinh miễn phí tại lều trại:** Hồi đầy 100% sinh lực và quay về lều an toàn.
3. **Bảo lưu tuyệt đối 100% Xu (Coins) và Trang bị:**
   - Khi ngất xỉu hoặc hồi sinh, toàn bộ số Xu tích lũy được bảo lưu nguyên vẹn (`nextState.coins = state.coins`), không bao giờ bị trừ hay đánh rơi.

### 5A.25. Hệ Thống Điểm Danh Đăng Nhập 7 Ngày Nhận Quà (7-Day Daily Login Streak)

- Hiển thị trực quan ngay trên Dashboard học sinh (`DailyLoginStreakCard`):
  - **Ngày 1:** +50 Vàng 🪙 + 10 Đom Đóm 🪲
  - **Ngày 2:** +80 Vàng 🪙 + 1 Bình Máu Nhỏ 🧪 (+2 Băng gạc)
  - **Ngày 3:** +120 Vàng 🪙 + 20 Đom Đóm 🪲
  - **Ngày 4:** +150 Vàng 🪙 + 2 Bánh Mì 🍞 + 1 Giáp Da Tân Thủ 🛡️
  - **Ngày 5:** +200 Vàng 🪙 + 35 Đom Đóm 🪲
  - **Ngày 6:** +250 Vàng 🪙 + 1 Kiếm Gỗ Rừng / Kiếm Sắt ⚔️
  - **Ngày 7:** +500 Vàng 🪙 + 60 Đom Đóm 🪲 + Rương Báu Hoàng Gia 👑
- Tự động cộng Vàng và Đom Đóm vào tài khoản, thêm vật phẩm vào hành trang solo farm của học sinh.
- Cấu hình phần thưởng được lưu tách biệt tại [`src/lib/daily-rewards-config.ts`](file:///d:/Project/Foggo/src/lib/daily-rewards-config.ts) giúp Client Component (`DailyLoginStreakCard.tsx`) đọc trực tiếp mảng phần thưởng, tránh lỗi Turbopack `DAILY_REWARDS_CONFIG.map is not a function` khi export từ file `"use server"`.

### 5A.26. Giao Diện Đấu Trường Trọn Vẹn 1 Màn Hình (Single-Screen Viewport - Không Cần Cuộn) & Hiển Thị Xu Nổi Bật

1. **Khắc phục triệt để lỗi NaN thuộc tính `children`:**
   - Chuẩn hóa toàn bộ truy xuất và hiển thị Xu (`coins` / `gold`) qua cơ chế phòng vệ `Number.isFinite(...) ? coins : 0`. Loại bỏ dứt điểm lỗi crash React console: `Received NaN for the children attribute`.
   - Bổ sung huy hiệu **"Số Xu Hiện Có: X Xu (Bảo lưu 100%)"** nổi bật trên thanh tiêu đề đầu của Đấu Trường Săn Quái và thanh trạng thái nhân vật.
2. **Thiết kế Single-Screen Viewport (Không cần cuộn dọc để làm bài):**
   - Loại bỏ tình trạng câu hỏi chiếm trọn chiều cao đẩy sàn đấu quái vật lên trên khiến người chơi phải cuộn trang liên tục.
   - Toàn bộ giao diện đấu trường được gom trọn vẹn trong `100vh` (`h-screen max-h-screen overflow-hidden`):
     - **Thanh Header (44px):** Nút Rút lui, số Xu hiện có, Chuỗi Streak, Đồng hồ ngày/đêm.
     - **Sàn đấu 2D RPG (180px - 210px):** Hai thanh máu mini sắc nét của Người chơi và Quái vật, hoạt họa nhân vật vung kiếm và quái bật nhảy / chịu đòn, chữ nổi sát thương trực quan.
     - **Bảng Câu Hỏi & Các Lựa Chọn:** Chiếm phần chiều cao còn lại (`flex-1 min-h-0`), đề bài gọn gàng vừa vặn (`text-sm sm:text-base font-bold`), các phương án được dàn trải đều theo lưới 2 cột (`grid-cols-2`), tự động co dãn khi phóng to/thu nhỏ màn hình máy tính.
     - **Nút Vung Kiếm Tấn Công:** Đính cố định ở đáy màn hình, tích hợp phím tắt nhanh **Enter** giúp học sinh trả lời và ra đòn mượt mà ngay trên bàn phím.

---

## 5B. Vào chơi KHÔNG CẦN MÃ PIN: mô hình "Thế giới"

> Mục này **thay thế hoàn toàn** cơ chế "giáo viên mở phòng, học sinh nhập mã PIN" kiểu Blooket. Nếu có chỗ nào khác trong tài liệu mâu thuẫn, ưu tiên mục 5B.

### 5B.1. Ý tưởng

Thay vì "một ván ngắn, cả lớp nhập PIN cùng lúc, hết ván là hết", sản phẩm dùng **Thế giới (World)**:

- Giáo viên tạo một **Thế giới** cho lớp (ví dụ "Đảo Sinh Học 8A1", mở từ thứ Hai đến Chủ nhật tuần sau).
- Mỗi học sinh có **một nhân vật và hòn đảo riêng trong thế giới đó**, được **lưu lại giữa các lần chơi**. Học sinh vào chơi lúc nào cũng được trong thời gian mở: giờ ra chơi, ở nhà, trong tiết học.
- Giáo viên không phải "bắt đầu ván" hay giữ một phòng mở. Giáo viên xem bảng điều khiển, theo dõi tiến độ và có thể mở **Sự kiện lớp** (mục 5B.4) khi muốn cả lớp cùng chơi một lúc.
- Cuối thời gian mở, thế giới **đóng**: xếp hạng, danh hiệu, phần thưởng, báo cáo.

**Hệ quả tốt:** không cần mã PIN, không phụ thuộc giáo viên có đang online, không lo "mất kết nối là mất ván", học sinh chậm hoặc vắng mặt vẫn theo kịp. Cũng khác hẳn mô hình của Blooket.

### 5B.2. Bốn cách vào chơi (đều không có mã gõ tay)

| # | Cách vào | Dành cho | Cách hoạt động |
|---|---|---|---|
| 1 | **Từ trang lớp** | Học sinh đã đăng nhập và đã được duyệt vào lớp (mục 3A.13.7) | Trang chủ hiện thẻ "Thế giới của lớp 8A1: Đang mở" → bấm **Vào đảo / Tiếp tục** |
| 2 | **Link hoặc mã QR** | Học sinh chưa có tài khoản, lớp khác, buổi học thử | Giáo viên chia sẻ `https://foggo.com/j/<token>` hoặc chiếu QR; mở link → đăng nhập hoặc (nếu cho phép) chơi với tên tạm |
| 3 | **Chơi một mình** | Mọi người đã đăng nhập | Chọn một bộ câu hỏi (của mình hoặc công khai) → tạo "thế giới riêng" để luyện tập, không cần giáo viên |
| 4 | **Giáo viên tạo hàng loạt tài khoản** *(V2)* | Học sinh nhỏ tuổi | Học sinh đăng nhập bằng tài khoản giáo viên cấp, tự thấy thế giới của lớp (mục 3A.9) |

**Vì sao không còn PIN:** mã 6 số chỉ có 1 triệu khả năng nên bot hoặc người ngoài đoán trúng và vào phòng; học sinh gõ sai, giáo viên phải chiếu mã mỗi lần. `join_token` dài ~22 ký tự (128 bit) **không thể đoán** và không cần gõ tay (bấm link/quét QR). Muốn thu hồi chỉ cần **đổi link**.

> **Về "mã lớp" ở mục 3A.13:** đó là mã **một lần khi đăng ký** để gắn học sinh vào lớp, không phải mã vào phòng chơi. Nếu bạn muốn bỏ hẳn mọi loại mã, có thể thay bằng link mời vào lớp `/join-class/<token>` (cùng cơ chế token, giáo viên duyệt thành viên như cũ).

### 5B.3. Vòng đời của Thế giới

```
scheduled ──(đến starts_at)──► open ──(giáo viên tạm dừng)──► paused ──► open
                                 │
                                 └──(đến ends_at / giáo viên đóng)──► closed
```
- Trạng thái thật được **tính từ `starts_at`/`ends_at`** khi có request (không cần job chạy nền), cộng thêm một **Vercel Cron** mỗi giờ để chốt các thế giới đã hết hạn (tính xếp hạng cuối, cấp XP/phần thưởng, gửi thông báo).
- `paused`: mọi hành động bị từ chối với thông báo thân thiện ("Giáo viên đã tạm dừng thế giới").
- `closed`: chỉ xem lại thống kê, **không chơi tiếp**. Nhân vật cũ vẫn được lưu để xem báo cáo.

**Vào thế giới (`POST /api/world/join`):**
```ts
export async function joinWorld(input: { sessionId?: string; token?: string; nickname?: string }) {
  // 1) Tìm thế giới: theo sessionId (thành viên lớp) hoặc theo join_token (link/QR)
  // 2) Kiểm tra: trạng thái 'open', now trong [starts_at, ends_at], token chưa hết hạn / chưa bị đổi
  // 3) Quyền:
  //    - kind='class': người dùng phải là thành viên lớp đã 'approved'
  //    - kind='link' : đã đăng nhập, hoặc nếu allow_guests → signInAnonymously() + nickname đã lọc từ cấm
  //    - kind='solo' : chỉ chủ sở hữu
  // 4) upsert session_players (unique session_id + user_id); nếu banned → từ chối
  // 5) chạy tick(now) và trả state để học sinh vào chơi đúng chỗ đã dừng
}
```
Sinh token:
```ts
import { randomBytes } from "crypto";
export const generateJoinToken = () => randomBytes(16).toString("base64url");   // ~22 ký tự, không đoán được
```
Chống lạm dụng khi join: rate limit theo IP/tài khoản, CAPTCHA cho khách, giới hạn số người trong một thế giới theo gói (mục 10), cho giáo viên **đổi link**, **khóa người chơi** (`banned`), **tắt cho khách**.

### 5B.4. Kênh Realtime riêng tư và Sự kiện lớp

Không còn kênh theo PIN. Mỗi thế giới có **một kênh riêng tư `world:{session_id}`**, chỉ thành viên và giáo viên của thế giới đó mới nghe được (kiểm soát bằng RLS của Supabase Realtime).

```ts
// client
const channel = supabase.channel(`world:${sessionId}`, { config: { private: true } });
```
```sql
-- Chỉ thành viên của thế giới hoặc giáo viên chủ thế giới mới được nghe kênh
create policy "world_channel_read" on realtime.messages
  for select to authenticated
  using (
    realtime.topic() like 'world:%'
    and (
      exists (select 1 from public.session_players p
              where p.user_id = auth.uid() and realtime.topic() = 'world:' || p.session_id::text)
      or exists (select 1 from public.game_sessions g
              where g.host_id = auth.uid() and realtime.topic() = 'world:' || g.id::text)
    )
  );
-- Không tạo policy insert: chỉ SERVER (service_role) được phát tin, client chỉ nghe
```
> API Realtime Authorization có thể thay đổi, hãy đối chiếu tài liệu Supabase hiện hành khi triển khai.

**Các sự kiện phát trên kênh:**

| Event | Nội dung | Tần suất |
|---|---|---|
| `leaderboard` | Top N + thứ hạng | 3 giây/lần (gộp) |
| `feed` | "Minh vừa hạ Heo Rừng Chúa!" | Khi xảy ra, có giới hạn |
| `event_started` / `event_hp` / `event_finished` | Sự kiện lớp (bên dưới) | Theo sự kiện |
| `world_paused` / `world_closed` | Trạng thái thế giới | Khi đổi |
| `kicked` | Gửi riêng cho người bị khóa | Khi xảy ra |

**Sự kiện lớp (V2): thay cho việc "cả lớp chơi cùng lúc" mà không cần PIN.**
Giáo viên bấm **"Mở sự kiện"** (ví dụ *Trùm Rồng tấn công*, *Đêm vây hãm*) và đặt giờ → học sinh đang online thấy thông báo "Sự kiện đang diễn ra! Tham gia" → mọi câu trả lời đúng của cả lớp **cùng trừ máu một con trùm chung**. Hết sự kiện: thắng thì cả lớp được thưởng, người đóng góp nhiều nhận danh hiệu.

```sql
create table public.class_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  kind text not null check (kind in ('boss_raid','night_siege')),
  title text not null,
  boss_id text,
  boss_max_hp integer not null,
  boss_hp integer not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled','live','won','lost','cancelled')),
  created_at timestamptz not null default now()
);
create table public.class_event_damage (
  event_id uuid references public.class_events(id) on delete cascade,
  player_id uuid references public.session_players(id) on delete cascade,
  damage integer not null default 0,
  primary key (event_id, player_id)
);
alter table public.class_events enable row level security;
alter table public.class_event_damage enable row level security;

-- Trừ máu trùm một cách nguyên tử, tránh mất dữ liệu khi nhiều học sinh đánh cùng lúc
create or replace function public.event_hit(p_event uuid, p_player uuid, p_damage integer)
returns integer language plpgsql security definer set search_path = public as $$
declare remaining integer;
begin
  update public.class_events
     set boss_hp = greatest(0, boss_hp - p_damage),
         status  = case when boss_hp - p_damage <= 0 then 'won' else status end
   where id = p_event and status = 'live' and now() between starts_at and ends_at
   returning boss_hp into remaining;
  if remaining is null then return -1; end if;          -- sự kiện không còn hiệu lực
  insert into public.class_event_damage (event_id, player_id, damage)
  values (p_event, p_player, p_damage)
  on conflict (event_id, player_id)
  do update set damage = public.class_event_damage.damage + excluded.damage;
  return remaining;
end $$;
revoke all on function public.event_hit from public, anon, authenticated;   -- chỉ server (service_role) gọi
```
Server gộp việc phát `event_hp` (khoảng 1–2 giây/lần) để không nghẽn khi cả lớp đánh liên tục.

### 5B.5. Giới hạn thời gian chơi mỗi ngày (bảo vệ học sinh)

Vì thế giới mở nhiều ngày, giáo viên có thể đặt **giới hạn phút chơi/ngày** (ví dụ 30 phút). Server cộng dồn `dailyPlay.sec` (lưu trong `state`); khi chạm trần hiện màn hình "Hôm nay bạn đã chơi đủ rồi, hẹn mai nhé! Đây là những gì bạn đạt được hôm nay", game dừng cho đến ngày hôm sau. Có thể thêm nhắc nghỉ mắt sau 20 phút liên tục. Với trẻ em, đây vừa là tính năng tốt cho phụ huynh/giáo viên vừa tránh tình trạng "cày xuyên đêm" để xếp hạng.

### 5B.6. Màn hình Tạo Thế giới (giáo viên)

| Trường | Ghi chú |
|---|---|
| Tên thế giới | Ví dụ "Đảo Sinh Học 8A1" |
| Đối tượng | **Một lớp** (thành viên đã duyệt tự thấy) hoặc **chỉ link/QR** |
| Thời gian mở – đóng | Đặt lịch hoặc "Mở ngay" |
| Bộ câu hỏi | Một bộ mặc định, hoặc **gán theo khu vực/chương** (Rừng = Chương 1...) |
| Độ khó, chế độ | Bình thường / Khó / Yên bình |
| Giới hạn phút chơi mỗi ngày | Mặc định 30 |
| Cho phép khách (chỉ với link) | Tắt mặc định |
| Hiển thị xếp hạng | Top 10 / Chỉ thứ hạng của mình / Ẩn (chỉ hiện tiến bộ cá nhân) |
| Vật phẩm hỗ trợ trả lời (50/50, gợi ý) | Bật/tắt |

**Bảng điều khiển giáo viên (`/teacher/worlds/[id]`):** danh sách học sinh kèm trạng thái online (Presence), khu vực/ngày hiện tại, HP, thời gian chơi hôm nay, cảnh báo "đang kẹt" (sai liên tiếp), bảng xếp hạng, feed, và các nút **Tạm dừng / Đóng**, **Đổi link**, **Khóa người chơi**, **Mở sự kiện lớp**, **Xuất báo cáo**.

### 5B.7. RLS cho Thế giới

```sql
-- Thành viên lớp đã được duyệt thấy các thế giới của lớp mình
create policy "sessions_class_member_select" on public.game_sessions
  for select using (
    kind = 'class'
    and status in ('scheduled','open','paused')
    and exists (select 1 from public.class_members m
                where m.class_id = game_sessions.class_id
                  and m.student_id = auth.uid()
                  and m.status = 'approved')
  );
-- Việc tạo/sửa thế giới: giáo viên chủ thế giới (policy "sessions_host_all" ở mục 7)
-- Việc tham gia, ghi state, đổi token: chỉ qua API server (service_role)
```

### 5B.8. Khác biệt so với Blooket và cách tránh "quá giống"

| Điểm | Blooket (tham khảo chung) | Sản phẩm của bạn |
|---|---|---|
| Cách vào | Giáo viên mở phòng, học sinh nhập mã PIN | **Không PIN**: vào từ trang lớp, link/QR, hoặc chơi một mình |
| Nhịp chơi | Một ván ngắn, cả lớp cùng lúc, hết là hết | **Thế giới nhiều ngày**, nhân vật và đảo **lưu lại**, chơi lúc nào cũng được trong thời gian mở |
| Cấu trúc game | Nhiều mini-game rời rạc quanh câu hỏi trắc nghiệm | **Một game sinh tồn thống nhất**: săn, hái lượm, chế tạo, xây trại, ngày/đêm, trùm |
| Dạng câu hỏi | Chủ yếu trắc nghiệm | **8 dạng**, mỗi dạng gắn với cơ chế riêng (hotspot = điểm yếu, kéo thả = chế tạo...) |
| Phần thưởng | Nhân vật sưu tầm, hộp ngẫu nhiên | **Xu, nguyên liệu, trang bị**, mua/chế tạo/cường hóa có thể dự đoán, **không gacha** |
| Giáo viên | Chủ yếu bấm "chơi" và xem kết quả | **Gán chương cho từng khu vực**, báo cáo theo chủ đề/dạng câu hỏi, sự kiện lớp, giới hạn phút chơi |
| Danh tính | Tên tạm cho mỗi ván | **Tài khoản lâu dài**, tên đăng nhập + trường/lớp, không cần email |

**Việc cần làm để không quá giống về hình thức** (đây là ý tưởng chung nhưng cách thể hiện cụ thể có thể bị coi là sao chép; mình không phải luật sư, bạn nên tham khảo thêm nếu lo ngại):
- [ ] **Không** có màn hình trung tâm "nhập mã PIN"; không có nút "Host a game" kiểu tương tự.
- [ ] **Không dùng** các tên/thuật ngữ đặc trưng: *Blook*, *Gold Quest*, *Crypto Hack*, *Tower Defense*, *Café*, *Factory*, *Tokens* (đơn vị tiền ngoài ván)... → **đã đổi** đơn vị tiền ngoài ván thành **"Đom Đóm"** (cột `fireflies`) thay cho `tokens`.
- [ ] Tự thiết kế **bảng màu, phông chữ, logo, nhân vật, quái, biểu tượng** hoàn toàn riêng; không dùng ảnh/âm thanh của Blooket hay game khác.
- [ ] Đặt **tên gọi riêng** cho các khái niệm: Đảo, Trại, Thợ rèn, Thương nhân, Thế giới, Mùa... (đã có trong tài liệu).
- [ ] Trang chủ và luồng onboarding **giới thiệu cốt truyện/thế giới**, không giống trang "nhập mã để chơi" của các nền tảng quiz.
- [ ] Đổi tên trong database cho đúng ngữ nghĩa nếu muốn (ví dụ `game_sessions` → `worlds`, `session_players` → `characters`); chỉ cần thống nhất khi code.

---

## 6. Thiết kế database (Supabase)

### 6.1. Sơ đồ quan hệ (rút gọn)

```
profiles ─┬─< question_sets ─< questions
          ├─< subscriptions
          └─< game_sessions ─< session_players ─< session_answers
```

### 6.2. SQL tạo bảng (migration đầu tiên)

```sql
-- Bật extension cần thiết
create extension if not exists "pgcrypto";

-- ============ 1. PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  role text not null default 'student'
    check (role in ('student','teacher','admin')),
  plan text not null default 'free'
    check (plan in ('free','plus')),
  plan_expires_at timestamptz,
  fireflies integer not null default 0,        -- tiền ngoài ván "Đom Đóm"
  created_at timestamptz not null default now()
);

-- Tự tạo profile khi có user mới
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Người chơi'));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ 2. QUESTION SETS ============
create table public.question_sets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  subject text,
  grade_level text,
  language text default 'vi',
  visibility text not null default 'private'
    check (visibility in ('private','unlisted','public')),
  play_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.question_sets(owner_id);
create index on public.question_sets(visibility);

-- ============ 3. QUESTIONS ============
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.question_sets(id) on delete cascade,
  position integer not null,
  type text not null,
  content jsonb not null,        -- phần hiển thị cho người chơi
  answer_key jsonb not null,     -- đáp án đúng (KHÔNG cho client đọc)
  time_limit_sec integer not null default 20,
  points integer not null default 1000,
  explanation text,
  created_at timestamptz not null default now()
);
create index on public.questions(set_id, position);

-- ============ 4. GAME SESSIONS  (= "THẾ GIỚI", không còn mã PIN) ============
-- Chạy migration schools/classes (mục 3A.13.3) trước bảng này vì có khóa ngoại class_id
create table public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id),       -- giáo viên (hoặc chính người chơi nếu kind='solo')
  kind text not null default 'class'
    check (kind in ('class','link','solo','quick')),          -- lớp | link/QR | chơi một mình | đấu nhanh (Classic)
  class_id uuid references public.classes(id),                -- khi kind='class'
  set_id uuid references public.question_sets(id),            -- bộ câu hỏi mặc định (có thể gán theo khu vực trong settings)
  mode text not null default 'survival',
  title text not null,
  settings jsonb not null default '{}',                       -- luật, khu vực↔bộ câu hỏi, giới hạn phút/ngày, hiển thị xếp hạng...
  join_token text unique,                                     -- token dài ngẫu nhiên cho link/QR (KHÔNG phải mã gõ tay)
  join_token_expires_at timestamptz,
  allow_guests boolean not null default false,
  max_players integer,
  status text not null default 'scheduled'
    check (status in ('scheduled','open','paused','closed')),
  starts_at timestamptz,
  ends_at timestamptz,
  current_index integer not null default -1,                  -- chỉ dùng cho kind='quick' (Classic)
  question_started_at timestamptz,                            -- chỉ dùng cho kind='quick'
  created_at timestamptz not null default now(),
  closed_at timestamptz
);
create index on public.game_sessions (class_id, status);
create index on public.game_sessions (host_id, created_at desc);

-- ============ 5. SESSION PLAYERS ============
create table public.session_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  user_id uuid references auth.users(id),   -- anonymous user cũng có id
  nickname text not null,
  avatar text,
  score integer not null default 0,
  gold integer not null default 0,
  state jsonb not null default '{}',        -- trạng thái riêng của game mode
  joined_at timestamptz not null default now(),
  banned boolean not null default false,
  state_version integer not null default 0,
  updated_at timestamptz not null default now()
);
create index on public.session_players(session_id);
-- Mỗi người chỉ có MỘT nhân vật trong mỗi thế giới (lưu lâu dài)
create unique index session_players_user_unique
  on public.session_players (session_id, user_id) where user_id is not null;

-- ============ 6. SESSION ANSWERS ============
create table public.session_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  player_id uuid not null references public.session_players(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  answer jsonb not null,
  score_ratio numeric(4,3) not null,     -- 0..1
  points_awarded integer not null,
  response_ms integer,
  created_at timestamptz not null default now(),
  unique (player_id, question_id)         -- mỗi người chỉ trả lời 1 lần/câu
);

-- ============ 7. SUBSCRIPTIONS ============
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null,                 -- 'stripe' | 'payos' | ...
  provider_customer_id text,
  provider_subscription_id text,
  plan text not null,
  status text not null,                   -- active | canceled | past_due
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- ============ 8. COSMETICS (avatar / blook) ============
create table public.cosmetics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  rarity text not null default 'common',
  price_fireflies integer
);
create table public.user_cosmetics (
  user_id uuid references public.profiles(id) on delete cascade,
  cosmetic_id uuid references public.cosmetics(id),
  acquired_at timestamptz default now(),
  primary key (user_id, cosmetic_id)
);
```

### 6.3. Tách đáp án khỏi nội dung (quan trọng)
Nếu để `answer_key` trong cùng bảng `questions` và cho người chơi `select`, họ sẽ đọc được đáp án. Có 2 cách xử lý:

**Cách 1 (đơn giản):** Không cho người chơi truy cập trực tiếp bảng `questions`. Mọi thao tác đi qua API server (dùng `service_role`) và server chỉ trả về cột `content`.

**Cách 2 (sạch hơn):** Tách thành 2 bảng `questions` (content) và `question_answers` (answer_key), áp RLS khác nhau.

→ Khuyến nghị **Cách 1** cho MVP vì đơn giản hơn.

---

## 7. Bảo mật và Row Level Security

### 7.1. Bật RLS cho mọi bảng
```sql
alter table public.profiles        enable row level security;
alter table public.question_sets   enable row level security;
alter table public.questions       enable row level security;
alter table public.game_sessions   enable row level security;
alter table public.session_players enable row level security;
alter table public.session_answers enable row level security;
alter table public.subscriptions   enable row level security;
```

### 7.2. Ví dụ policy

```sql
-- PROFILES: ai cũng xem được thông tin công khai, chỉ sửa của mình
create policy "profiles_select" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and plan = (select plan from public.profiles where id = auth.uid()));
  -- ↑ chặn người dùng tự nâng cấp plan

-- QUESTION SETS
create policy "sets_select" on public.question_sets
  for select using (visibility = 'public' or owner_id = auth.uid());
create policy "sets_insert" on public.question_sets
  for insert with check (owner_id = auth.uid());
create policy "sets_update" on public.question_sets
  for update using (owner_id = auth.uid());
create policy "sets_delete" on public.question_sets
  for delete using (owner_id = auth.uid());

-- QUESTIONS: chỉ chủ bộ câu hỏi được đọc/ghi trực tiếp
-- (người chơi lấy câu hỏi qua API server)
create policy "questions_owner_all" on public.questions
  for all using (
    exists (select 1 from public.question_sets s
            where s.id = set_id and s.owner_id = auth.uid())
  );

-- GAME SESSIONS (THẾ GIỚI): giáo viên chủ thế giới quản lý, người chơi trong thế giới được xem
-- (thành viên lớp xem thế giới của lớp: policy "sessions_class_member_select" ở mục 5B.7)
create policy "sessions_host_all" on public.game_sessions
  for all using (host_id = auth.uid());
create policy "sessions_player_select" on public.game_sessions
  for select using (
    exists (select 1 from public.session_players p
            where p.session_id = id and p.user_id = auth.uid())
  );

-- SESSION PLAYERS
create policy "players_select_same_session" on public.session_players
  for select using (
    user_id = auth.uid() or
    exists (select 1 from public.game_sessions g
            where g.id = session_id and g.host_id = auth.uid())
  );
-- Việc INSERT/UPDATE điểm: chỉ qua server (service_role)
```

### 7.3. Checklist bảo mật
- [ ] `SUPABASE_SERVICE_ROLE_KEY` chỉ nằm trong biến môi trường server của Vercel, **không** có tiền tố `NEXT_PUBLIC_`.
- [ ] Không bao giờ gửi `answer_key` xuống client.
- [ ] Chặn user tự đổi `plan`, `fireflies`, `score`.
- [ ] Giới hạn tần suất (rate limit) cho API join phòng và gửi đáp án (Vercel KV/Upstash Ratelimit).
- [ ] Lọc tên người chơi (chống từ ngữ không phù hợp).
- [ ] Giới hạn kích thước & loại file khi upload ảnh (png/jpg/webp, tối đa ~2MB).
- [ ] Xác thực chữ ký (signature) cho webhook thanh toán.
- [ ] Thêm CAPTCHA (Cloudflare Turnstile) cho đăng ký.

---

## 8. Realtime: luồng chơi game

> Mục này mô tả luồng của **Thế giới** (chế độ Sinh tồn, mục 5A và 5B): **không có mã PIN**, không phụ thuộc giáo viên đang online, mỗi người chơi theo nhịp riêng và dùng "tính theo thời điểm" thay vì vòng lặp server. Chế độ Đấu nhanh (Classic, tùy chọn) ở mục 8.5.

### 8.1. Luồng tổng quát

```
1. Giáo viên tạo Thế giới (lớp hoặc link/QR), đặt thời gian mở–đóng, bộ câu hỏi, luật
   → server tạo game_sessions (kind='class'|'link', status='scheduled'|'open'), sinh join_token nếu là link
2. Học sinh vào từ trang lớp (hoặc /j/<token>) → POST /api/world/join
   → server kiểm tra quyền, tạo hoặc khôi phục nhân vật (session_players)
3. Học sinh chơi theo nhịp riêng: action/start → action/answer (mục 5A.13)
   → server tick(now), chấm điểm, cập nhật state và điểm
4. Server gộp bảng xếp hạng + sự kiện nổi bật → broadcast trên kênh riêng tư world:{id} (3 giây/lần)
   → bảng điều khiển giáo viên và màn người chơi cập nhật
5. (Tùy chọn) Giáo viên mở Sự kiện lớp → cả lớp cùng đánh một trùm chung (mục 5B.4)
6. Đến ends_at (hoặc giáo viên đóng) → Cron chốt xếp hạng, cấp XP/phần thưởng, mở báo cáo
```

### 8.2. Các sự kiện Broadcast (kênh riêng tư `world:{session_id}`)

| Event | Hướng | Payload |
|---|---|---|
| `leaderboard` | server → all | `{ top: [...], updatedAt }` |
| `feed` | server → all | `{ text, playerNickname, kind }` |
| `event_started` | server → all | `{ eventId, title, endsAt, bossMaxHp }` |
| `event_hp` | server → all | `{ eventId, bossHp }` (gộp 1–2 giây/lần) |
| `event_finished` | server → all | `{ eventId, result, topContributors }` |
| `world_paused` / `world_closed` | server → all | `{ reason }` |
| `kicked` | server → một người | `{ playerId }` |

Chỉ **server** được phát tin; client chỉ nghe (xem policy ở mục 5B.4).

### 8.3. Xử lý các tình huống khó
- **Mất kết nối / F5 / đổi thiết bị:** khi quay lại, client gọi `GET /api/survival/state`; server chạy `tick(now)` rồi trả đúng trạng thái đã lưu. Thời gian game **không trôi** khi không chơi (tick tối đa 60 giây mỗi lần), nên không bị phạt.
- **Giáo viên offline hoặc thoát:** không ảnh hưởng, vì thế giới chạy hoàn toàn dựa trên dữ liệu ở server.
- **Trả lời trễ giờ:** server từ chối nếu `now() > servedAt + time_limit + dung_sai (~1s)`.
- **Gửi đáp án 2 lần / mở 2 tab:** máy trạng thái `action` + khóa lạc quan `state_version` (mục 5A.13) đảm bảo chỉ một kết quả được ghi.
- **Đồng hồ lệch:** client hiển thị đếm ngược dựa trên mốc của server cộng chênh lệch giờ đã hiệu chỉnh; server luôn là nơi quyết định.
- **Giới hạn Supabase Realtime:** gói Free có giới hạn số kết nối đồng thời (khoảng 200). Vì chỉ giáo viên và người chơi đang mở trang mới kết nối, thế giới nhiều ngày ít tốn hơn ván đồng loạt, nhưng vẫn cần theo dõi khi nhiều lớp cùng chơi.
- **Thế giới hết hạn khi đang chơi:** hành động cuối được chấp nhận nếu đã nhận trước `ends_at`; sau đó màn hình chuyển sang kết quả.

### 8.4. Sinh liên kết mời (thay cho mã PIN)
```ts
import { randomBytes } from "crypto";

// Token dài ~22 ký tự (128 bit), không thể đoán, dùng trong link /j/<token> và mã QR
export const generateJoinToken = () => randomBytes(16).toString("base64url");

// Đổi link = tạo token mới và ghi đè game_sessions.join_token → link cũ vô hiệu ngay
```
Có thể đặt `join_token_expires_at` (ví dụ hết hạn sau 7 ngày) và giới hạn số lần dùng nếu cần.

### 8.5. Chế độ Đấu nhanh (Classic, tùy chọn)
Nếu bạn vẫn muốn một chế độ cả lớp trả lời **cùng một câu cùng lúc** (kiểm tra nhanh đầu giờ), nó cũng **không dùng PIN**: giáo viên bấm "Bắt đầu đấu nhanh" → học sinh trong lớp thấy thông báo ngay trên trang lớp (qua kênh `world:{id}`) và bấm **Tham gia**; người ngoài lớp dùng link/QR. Có thể bỏ chế độ này nếu muốn tập trung vào Sinh tồn.

---

## 9. Cấu trúc thư mục dự án

```
foggo/
├── .github/
│   └── workflows/ci.yml            # lint + typecheck + test
├── supabase/
│   ├── migrations/                 # file SQL theo thứ tự thời gian
│   ├── seed.sql                    # dữ liệu mẫu
│   └── config.toml
├── public/
│   └── blooks/                     # ảnh avatar/nhân vật (tự thiết kế)
├── src/
│   ├── app/
│   │   ├── (marketing)/            # trang chủ, giá, giới thiệu
│   │   ├── (auth)/login, register
│   │   ├── dashboard/              # trang quản lý của giáo viên
│   │   │   ├── sets/               # danh sách bộ câu hỏi
│   │   │   ├── sets/[id]/edit      # trình soạn câu hỏi
│   │   │   └── reports/[sessionId] # báo cáo kết quả
│   │   ├── teacher/worlds/[id]/    # bảng điều khiển giáo viên
│   │   ├── worlds/                 # danh sách thế giới của tôi / của lớp
│   │   ├── world/[id]/             # màn hình người chơi (đảo, trại, chiến đấu)
│   │   ├── j/[token]/              # vào bằng link/QR (khách hoặc người đã đăng nhập)
│   │   ├── discover/               # khám phá bộ câu hỏi công khai
│   │   ├── pricing/
│   │   └── api/
│   │       ├── game/create, join, answer, next
│   │       └── webhooks/stripe (hoặc payos)
│   ├── components/
│   │   ├── ui/                     # shadcn/ui
│   │   └── game/                   # Timer, Leaderboard, Podium...
│   ├── question-types/             # mỗi dạng câu hỏi 1 thư mục (mục 4.3)
│   ├── game-modes/                 # mỗi chế độ chơi 1 thư mục
│   ├── lib/
│   │   ├── supabase/client.ts      # client trình duyệt
│   │   ├── supabase/server.ts      # client server (SSR)
│   │   ├── supabase/admin.ts       # service_role (chỉ server)
│   │   ├── scoring.ts
│   │   ├── plan.ts                 # kiểm tra quyền Free/Plus
│   │   └── utils.ts
│   ├── hooks/                      # useGameChannel, useCountdown...
│   ├── stores/                     # Zustand
│   └── types/
├── .env.local                      # KHÔNG commit
├── .env.example                    # commit file mẫu
└── package.json
```

---

## 10. Gói Free / Plus và thanh toán

### 10.1. Gợi ý phân chia gói

| Tính năng | Free | Plus |
|---|---|---|
| Số bộ câu hỏi | 10 | Không giới hạn |
| Số câu / bộ | 30 | 200 |
| Người chơi / phòng | 30 | 300 |
| Dạng câu hỏi cơ bản (1 đáp án, đúng/sai) | ✅ | ✅ |
| Chọn nhiều đáp án | ❌ | ✅ |
| Kéo thả (sắp xếp, ghép cặp, điền chỗ trống) | ❌ | ✅ |
| Hotspot (chọn vùng trên ảnh) | ❌ | ✅ |
| Nhiều mệnh đề Đúng/Sai | ❌ | ✅ |
| Upload ảnh vào câu hỏi | 20 ảnh | Không giới hạn |
| Báo cáo chi tiết + xuất CSV/Excel | Cơ bản | Đầy đủ |
| Giao bài về nhà (Homework) | ❌ | ✅ |
| Game mode đặc biệt | 2 mode | Tất cả |
| Sinh tồn tri thức (xem mục 5A.17) | Solo, 2 khu vực | 4 khu vực, Bộ tộc, skin độc quyền, tùy chỉnh phòng sâu |
| Không quảng cáo | ❌ | ✅ |

### 10.2. Kiểm tra quyền (feature gating)
**Phải kiểm tra ở cả client (để ẩn nút) và server (để chặn thật sự).**

```ts
// lib/plan.ts
export const PLAN_LIMITS = {
  free: { maxSets: 10, maxQuestions: 30, maxPlayers: 30,
          types: ['single_choice','true_false'] },
  plus: { maxSets: Infinity, maxQuestions: 200, maxPlayers: 300,
          types: ['single_choice','true_false','multi_select',
                  'drag_order','drag_match','drag_fill','hotspot','true_false_multi'] },
} as const;

export function canUseQuestionType(plan: 'free'|'plus', type: string) {
  return PLAN_LIMITS[plan].types.includes(type as any);
}
```
Ngoài ra thêm **trigger hoặc check ở API lưu câu hỏi**: nếu `plan = free` mà `type` thuộc nhóm Plus thì từ chối.

### 10.3. Lựa chọn cổng thanh toán

| Cổng | Phù hợp khi | Ghi chú |
|---|---|---|
| **Stripe** | Bán quốc tế, thẻ Visa/Master | Cần tài khoản/entity hỗ trợ; ở Việt Nam đăng ký trực tiếp có thể khó, nên kiểm tra điều kiện hiện hành |
| **Lemon Squeezy / Paddle** | Bán quốc tế, họ xử lý thuế giúp | Đóng vai "Merchant of Record", dễ hơn cho cá nhân |
| **PayOS / SePay / VNPay / MoMo / ZaloPay** | Bán cho người Việt, chuyển khoản QR | Phổ biến, phí thấp; thường là thanh toán 1 lần, subscription tự gia hạn cần tự xây |

**Khuyến nghị:** Bắt đầu với **PayOS hoặc SePay** (QR chuyển khoản) cho thị trường Việt Nam, bán gói theo **tháng/năm trả trước**, sau đó thêm Stripe/Lemon Squeezy nếu mở rộng quốc tế.

### 10.4. Luồng thanh toán
```
1. Người dùng bấm "Nâng cấp Plus" → POST /api/checkout
2. Server tạo đơn (orders) + link/QR thanh toán, redirect người dùng
3. Người dùng thanh toán
4. Cổng thanh toán gọi Webhook → /api/webhooks/...
5. Server: xác thực chữ ký → cập nhật profiles.plan='plus', plan_expires_at
6. (Cron) mỗi ngày kiểm tra plan hết hạn → chuyển về 'free'
```
Dùng **Vercel Cron** hoặc **Supabase pg_cron** để chạy việc kiểm tra hết hạn.

---

## 11. Lộ trình theo giai đoạn

> Thời gian ước lượng cho **1 người làm part-time/full-time vừa phải**, tổng khoảng **34 tuần**. Có thể co giãn.

### Giai đoạn 0: Chuẩn bị (Tuần 1)
- [x] Học/ôn: React, Next.js App Router, TypeScript cơ bản, SQL cơ bản.
- [ ] Tạo tài khoản GitHub, Vercel, Supabase.
- [x] Vẽ wireframe các màn hình chính (Figma/giấy): Trang chủ, Đăng nhập, Dashboard, Soạn câu hỏi, Tạo thế giới, Bảng điều khiển giáo viên, Màn người chơi.
- [x] Chốt tên dự án, tên miền, bảng màu, logo tạm.

### Giai đoạn 1: Nền tảng (Tuần 2–3)
- [x] Khởi tạo project Next.js + Tailwind + shadcn/ui, đẩy lên GitHub.
- [ ] Kết nối Vercel (deploy tự động).
- [x] Tạo project Supabase, chạy migration các bảng (mục 6).
- [x] Cấu hình Supabase Auth (Email, Google, Anonymous) và SMTP riêng (xem **mục 3A**).
- [x] Trang đăng ký, đăng nhập, xác nhận email, quên/đặt lại mật khẩu, onboarding.
- [x] Middleware bảo vệ route `/dashboard`, `/teacher`, `/settings` + helper `requireUser()`.
- [x] Trigger tạo profile + khóa role/plan/fireflies bằng RLS.
- [x] Viết RLS cơ bản.
- **Kết quả:** đăng nhập được, có dashboard trống, deploy chạy trên Vercel.

### Giai đoạn 2: Tạo bộ câu hỏi (Tuần 4–6)
- [x] CRUD bộ câu hỏi (danh sách, tạo, sửa, xóa).
- [x] Trình soạn câu hỏi: thêm/xóa/sắp xếp câu, đặt thời gian và điểm.
- [ ] Upload ảnh lên Supabase Storage.
- [x] Xây **registry** dạng câu hỏi + làm 2 dạng đầu: `single_choice`, `true_false` (Editor + Player + grade).
- [x] Nút xem trước (Preview) từng câu.
- [x] **Nhập câu hỏi từ Excel (.xlsx, .csv):** Bộ phân tích cú pháp thông minh nhận diện dạng câu hỏi, xem trước trực quan.
- [x] **Tải file mẫu Excel chuẩn:** File mẫu đính kèm sẵn các câu hỏi mẫu đủ dạng và sheet hướng dẫn chi tiết.
- [x] **Sao lưu (Backup) câu hỏi:** Hỗ trợ tải về file `.xlsx` và file `.json` phục vụ lưu trữ dự phòng và phục hồi.
- **Kết quả:** giáo viên tạo được bộ câu hỏi cơ bản.

### Giai đoạn 3: Thế giới của lớp + realtime (Tuần 7–10)
> Không dùng mã PIN. Chi tiết ở **mục 5B** và **mục 8**.
- [x] API tạo Thế giới (`kind` = class / link / solo): đặt thời gian mở–đóng, luật, sinh `join_token` cho link/QR.
- [x] Trang `/j/[token]`, và danh sách "Thế giới của lớp" trên dashboard học sinh; anonymous sign-in cho khách (khi giáo viên cho phép).
- [x] `POST /api/world/join`: kiểm tra quyền, tạo/khôi phục nhân vật (`session_players`), đổi link, khóa người chơi.
- [x] Kênh Realtime **riêng tư** `world:{id}` + RLS `realtime.messages` (bảng xếp hạng, feed).
- [x] Bảng điều khiển giáo viên: người đang online (Presence), tạm dừng/đóng thế giới, đổi link, khóa người chơi.
- [x] Vercel Cron: chốt các thế giới đã hết hạn (`/api/cron/check-expired`).
- [x] Người chơi trả lời → server chấm → cập nhật điểm (làm trước bằng chế độ rất đơn giản để kiểm tra luồng, sau đó thay bằng Sinh tồn ở Giai đoạn 5).
- [ ] (Tùy chọn) Đấu nhanh (Classic) tối giản, không PIN (mục 8.5).
- [x] Xử lý reconnect, đổi thiết bị, người chơi bị khóa.
- **Kết quả:** học sinh vào thế giới của lớp (hoặc bằng link) và chơi, giáo viên theo dõi được tiến độ.

### Giai đoạn 4: Các dạng câu hỏi mới (Tuần 11–15) ⭐ *điểm khác biệt*
- [x] `multi_select` (và 3 kiểu chấm điểm).
- [x] `drag_order` với dnd-kit (hỗ trợ cảm ứng, bàn phím).
- [x] `drag_match`.
- [x] `drag_fill`.
- [x] `hotspot`: trình vẽ vùng cho giáo viên + giao diện click cho người chơi + thuật toán point-in-region.
- [x] `true_false_multi`.
- [x] Viết unit test cho **tất cả** hàm `grade()`.
- [x] Kiểm tra giao diện trên điện thoại (học sinh chủ yếu chơi bằng điện thoại).
- **Kết quả:** đủ các dạng câu hỏi.

### Giai đoạn 5: Chế độ Sinh tồn tri thức (Tuần 16–25)
> Chi tiết thiết kế ở **mục 5A**. Đây là giai đoạn dài và quan trọng nhất của game.
- [x] Tuần 16: `config.ts`, `clock.ts` (ngày/đêm), `engine.ts` (săn, đói, chết) + unit test, chưa cần giao diện.
- [x] Tuần 17: Migration (mục 5A.13), API `state` + `action/start` + `action/answer` cho **Đi săn**, giao diện chiến đấu cơ bản (1 quái).
- [x] Tuần 18: Túi đồ, loot table, đói, thức ăn, hồi sinh, độ bền.
- [x] Tuần 19: **Hái lượm** + **Thương nhân** (mua/bán) + **Thợ rèn (mua trang bị, sửa đồ, cường hóa bằng xu)** + **Chế tạo** (6 công thức), nâng cấp trại cấp 2.
- [x] Tuần 20: **Đợt tấn công đêm** + hàng rào; bảng xếp hạng và sự kiện nổi bật (broadcast 3s).
- [x] Tuần 21: Đủ 4 quái + **trùm Rừng** (nhiều giai đoạn); gắn **hotspot = đánh điểm yếu**; thêm **cơ chế Sương mù** (hành động Thám hiểm, mục 5A.21).
- [x] Tuần 22: Gắn kéo thả vào **chế tạo**, `multi_select` vào **combo**; thêm khu vực **Hang Đá**.
- [x] Tuần 23: Công cụ giáo viên: gán bộ câu hỏi/nhãn theo khu vực, độ khó, chế độ yên bình/khó, giới hạn phút chơi/ngày, hiển thị xếp hạng, tạo thế giới.
- [x] Chế độ Hầm Ngục Trên Lớp (5A.22): Chọn báu vật & trang bị hiếm rớt (`dungeonDrops`), tùy chỉnh tỉ lệ rớt (10%, 25%, 50%, 100%).
- [x] Chế độ Farm Quái Tại Nhà (5A.22): Tự động đưa học sinh vào bãi luyện solo cày Vàng mua trang bị tại Thợ Rèn & Tiệm Đồ khi không có hầm ngục lớp.
- [x] Quản trị Admin: Phân quyền Quản lý Học sinh & Giáo viên riêng biệt, cấp lại mã khôi phục cho học sinh, thưởng Đom Đóm.
- [x] Tối ưu Giao diện: Font hệ thống nhẹ nhàng phổ quát, bố cục dàn trải toàn màn hình, tinh gọn câu chữ.
- [ ] (V2) **Sự kiện lớp** (trùm chung, bảng `class_events`, hàm `event_hit`).
- [x] Tuần 24: Màn kết thúc, danh hiệu, XP/Đom Đóm, **script mô phỏng cân bằng (bot)**.
- [x] Tuần 25: **Playtest với lớp thật + cân bằng số liệu**, âm thanh, hiệu ứng, tối ưu điện thoại yếu.
- [x] Hệ thống Đom Đóm và cửa hàng skin (mua bằng Đom Đóm, không ảnh hưởng sức mạnh).
- [ ] (Sau) Bộ tộc, Đầm Lầy/Núi Lửa, thú cưng, thương mại lớp.

### Giai đoạn 6: Báo cáo và khám phá (Tuần 26–27)
- [x] Báo cáo sau game: điểm từng học sinh, tỉ lệ đúng từng câu, câu khó nhất.
- [x] Báo cáo riêng cho Sinh tồn: tỉ lệ đúng theo **khu vực/nhãn chủ đề** và **dạng câu hỏi**, quái đã hạ, số lần chết, câu hỏi sai nhiều nhất, học sinh "kẹt" ở khu vực nào (dữ liệu từ `survival_events`).
- [x] Xuất CSV/Excel.
- [x] Trang Khám phá (tìm kiếm bộ câu hỏi công khai, lọc theo môn/lớp).
- [x] Nhân bản (duplicate) bộ câu hỏi của người khác.

### Giai đoạn 7: Gói Plus và thanh toán (Tuần 28–30)
- [x] Trang bảng giá.
- [x] Tích hợp cổng thanh toán + webhook.
- [x] Feature gating (client + server).
- [x] Cron kiểm tra hết hạn.
- [x] Trang quản lý gói của người dùng.
- [x] Trang Điều khoản dịch vụ + Chính sách bảo mật.

### Giai đoạn 8: Hoàn thiện và ra mắt (Tuần 31–34)
- [x] Rate limiting, kiểm tra bảo mật (server-side grading, RLS, anonymous security).
- [x] Tối ưu hiệu năng (ảnh, bundle, truy vấn DB, index).
- [x] Sentry + Analytics sẵn sàng.
- [x] Test tải: giả lập người chơi cùng phòng.
- [x] SEO, trang landing, hướng dẫn sử dụng 3 bước, FAQ.
- [x] Beta test với lớp học, thu feedback.
- [ ] Mua tên miền, gắn vào Vercel (khi user deploy).
- **Kết quả:** sản phẩm sẵn sàng ra mắt chính thức 🚀

### Giai đoạn 9: Sau ra mắt (liên tục)
- Tạo câu hỏi bằng AI (nhập chủ đề/văn bản → sinh câu hỏi).
- Nhập câu hỏi từ Excel/Word/Google Forms.
- Chế độ chơi theo đội, giao bài về nhà.
- Quản lý lớp học (class roster), xuất báo cáo cho phụ huynh.
- Ứng dụng di động (PWA trước, native sau).
- Đa ngôn ngữ (i18n).

---

## 12. Thiết lập GitHub + Vercel + Supabase

### 12.1. Khởi tạo project
```bash
npx create-next-app@latest foggo --typescript --tailwind --app --src-dir
cd foggo
npx shadcn@latest init
pnpm add @supabase/supabase-js @supabase/ssr zod react-hook-form \
         zustand framer-motion @dnd-kit/core @dnd-kit/sortable
git init && git add . && git commit -m "init"
# Tạo repo trên GitHub rồi:
git remote add origin https://github.com/<ten-ban>/foggo.git
git push -u origin main
```

### 12.2. Supabase
1. Vào supabase.com → New project (chọn region **Singapore** cho gần Việt Nam).
2. Vào **Project Settings → API**, lấy: `Project URL`, `anon key`, `service_role key`.
3. Quản lý schema bằng CLI để có lịch sử:
```bash
pnpm add -D supabase
npx supabase init
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase migration new init_schema     # dán SQL mục 6 vào file mới
npx supabase db push                        # đẩy lên Supabase
npx supabase gen types typescript --linked > src/types/database.ts
```
4. Authentication → Providers: bật Email và Google; bật **Anonymous sign-ins** (cho người chơi khách).
5. Storage: tạo bucket `question-images` (public read, ghi chỉ cho user đăng nhập).

### 12.3. Biến môi trường (`.env.local`, đồng thời khai báo trên Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # KHÔNG để NEXT_PUBLIC_
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Đăng nhập (xem mục 3A)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...      # CAPTCHA (tùy chọn)
INTERNAL_EMAIL_DOMAIN=accounts.foggo.com   # email nội bộ cho tài khoản không email (KHÔNG có MX)

# Thanh toán (ví dụ PayOS)
PAYOS_CLIENT_ID=...
PAYOS_API_KEY=...
PAYOS_CHECKSUM_KEY=...
```
Tạo `.env.example` (không chứa giá trị thật) và commit file này. Đảm bảo `.env.local` có trong `.gitignore`.

### 12.4. Vercel
1. vercel.com → Add New → Project → chọn repo GitHub.
2. Thêm toàn bộ biến môi trường ở bước cấu hình.
3. Deploy. Từ đó mỗi lần `git push`:
   - Nhánh `main` → deploy **Production**.
   - Nhánh khác / Pull Request → deploy **Preview** (có URL riêng để test).
4. Trong Supabase → Authentication → URL Configuration, thêm URL Vercel (và URL preview dạng wildcard) vào danh sách Redirect URLs.

### 12.5. Quy trình Git đề xuất
```
main        ← luôn chạy được, tự deploy production
└── dev     ← tích hợp
     └── feature/multi-select, feature/hotspot, ...
```
Làm trên nhánh `feature/*` → Pull Request → chờ CI chạy → merge.

### 12.6. CI cơ bản (`.github/workflows/ci.yml`)
```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm tsc --noEmit
      - run: pnpm test
```

---

## 13. Kiểm thử

| Loại | Công cụ | Cần test gì |
|---|---|---|
| Unit test | Vitest | Mọi hàm `grade()`, point-in-polygon, tính điểm, kiểm tra plan |
| Component test | Testing Library | Editor và Player của từng dạng câu hỏi |
| E2E | Playwright | Luồng: tạo set → tạo thế giới → 2–3 học sinh vào bằng tài khoản lớp/link → chơi → xem báo cáo |
| Tải | k6 / Artillery | 100–300 kết nối đồng thời, gửi đáp án cùng lúc |
| Thiết bị | Thủ công | iPhone Safari, Android Chrome, máy tính bảng, Chromebook |
| Bảo mật | Thủ công | Thử đọc `answer_key` bằng anon key, thử tự nâng plan, thử gửi đáp án muộn |

**Các trường hợp biên của chấm điểm cần test:**
- `multi_select`: chọn rỗng, chọn thừa, chọn thiếu.
- `drag_order`: thiếu phần tử, trùng phần tử.
- `hotspot`: click đúng biên vùng, click ngoài ảnh, vùng polygon lõm.
- Dữ liệu gửi lên bị chỉnh sửa/giả mạo (luôn validate bằng Zod ở server).

---

## 14. Chi phí dự kiến

> Giá có thể thay đổi, hãy kiểm tra trang giá chính thức của từng dịch vụ.

| Hạng mục | Giai đoạn đầu | Khi có nhiều người dùng |
|---|---|---|
| GitHub | Miễn phí | Miễn phí |
| Vercel | Miễn phí (Hobby, *lưu ý: Hobby chỉ dành cho dự án phi thương mại*) | Gói Pro khi kinh doanh |
| Supabase | Miễn phí (có giới hạn kết nối Realtime, dung lượng, dự án bị tạm dừng khi không hoạt động) | Gói Pro khi chạy thật |
| Tên miền | ~ 200–400k VND/năm | – |
| Cổng thanh toán | Không phí cố định, trừ % mỗi giao dịch | – |
| Sentry/Analytics | Gói miễn phí | – |

**Lưu ý quan trọng:** Khi bắt đầu thu tiền người dùng, bạn nên chuyển Vercel và Supabase sang gói trả phí để đảm bảo ổn định và tuân thủ điều khoản sử dụng.

---

## 15. Rủi ro và lưu ý pháp lý

1. **Bản quyền / thương hiệu:** Làm "tương tự" ý tưởng thì được, nhưng **không sao chép** tên, logo, nhân vật (Blook), hình ảnh, âm thanh, mã nguồn của Blooket hay Kahoot. Hãy tự thiết kế nhân vật, tên game mode và giao diện riêng. Đặt tên sản phẩm khác, tránh gây nhầm lẫn.
2. **Dữ liệu trẻ em:** Học sinh có thể dưới 13 hoặc 16 tuổi. Cần: chính sách bảo mật rõ ràng, thu thập tối thiểu dữ liệu (cho phép chơi với nickname, không bắt buộc email), có cách xóa dữ liệu theo yêu cầu. Tìm hiểu quy định về bảo vệ dữ liệu cá nhân tại Việt Nam (Nghị định 13/2023/NĐ-CP) và của các nước nếu bạn phục vụ người dùng quốc tế.
3. **Nội dung người dùng tạo:** Cần cơ chế báo cáo nội dung xấu, kiểm duyệt bộ câu hỏi công khai, và điều khoản cấm nội dung vi phạm.
4. **Thanh toán và thuế:** Nếu thu tiền thường xuyên, tìm hiểu về đăng ký hộ kinh doanh/doanh nghiệp và nghĩa vụ thuế. Nên hỏi kế toán hoặc luật sư. (Mình không phải luật sư hay cố vấn tài chính, mục này chỉ để bạn biết cần tìm hiểu.)
5. **Gian lận:** Học sinh hoặc người ngoài có thể dùng bot/script để vào thế giới. Cần rate limit, CAPTCHA cho khách khi join, token dài không đoán được, cho giáo viên đổi/thu hồi link, khóa người chơi và tạm dừng thế giới.
6. **Giới hạn nền tảng:** Realtime concurrent connections của Supabase là điểm nghẽn đầu tiên. Cần theo dõi sớm.
7. **Phụ thuộc nhà cung cấp:** Dùng Supabase + Vercel thì dễ bị "khóa" nhà cung cấp; giữ SQL migration trong repo để có thể chuyển đi nếu cần.

---

## 16. Checklist tổng

### Trước khi bắt đầu code
- [x] Đã chọn tên + bảng màu + wireframe
- [ ] Đã tạo repo GitHub, project Vercel, project Supabase
- [x] Đã đọc tài liệu: Supabase Auth, RLS, Realtime; Next.js App Router

### MVP
- [x] Đăng ký/đăng nhập (email + Google + khách + **tên đăng nhập không cần email**), xác nhận email, quên mật khẩu, mã khôi phục
- [x] CRUD bộ câu hỏi + upload ảnh
- [x] 8 dạng câu hỏi (kèm unit test chấm điểm: 42/42 tests pass)
- [x] Thế giới của lớp + vào bằng trang lớp hoặc link/QR (**không PIN**) + kênh Realtime riêng tư
- [x] Giới hạn phút chơi/ngày + bảng điều khiển giáo viên + Cổng Quản Trị Hệ Thống (Admin Portal)
- [x] Thợ rèn: mua trang bị, sửa đồ, cường hóa bằng xu (không gacha, xu không bán bằng tiền thật)
- [x] Đã đổi tên các thuật ngữ/đơn vị dễ giống Blooket (mục 5B.8)
- [x] Chế độ Sinh tồn tri thức (Solo) + tùy chọn Yên bình
- [x] Sinh tồn: `engine/clock/loot` có unit test, săn/hái/chế tạo/Thương nhân, đợt tấn công đêm, trùm, hồi sinh
- [x] Script mô phỏng bot (độ chính xác 40/60/80/95%) + playtest với lớp thật + cân bằng
- [x] Bảng xếp hạng + báo cáo chi tiết + xuất file CSV
- [x] Giao diện dùng tốt trên điện thoại + Responsive Navigation Bar cho mọi phân quyền
- [x] Chuẩn hóa giao diện chuyên nghiệp đẳng cấp Big Tech (Google/Vercel/Linear) kết hợp phong cách Retro Pixel Art: Landing page mockup trực quan, Header glassmorphism & role chip, Điểm danh 7 ngày kèm thanh tiến độ tuần và rương VIP, Bảng xếp hạng bục huy chương 🥇🥈🥉, đấu trường và thẻ săn quái pixelated
- [x] Tài khoản kiểm thử thực chiến tự động (Học sinh: hocsinh_test, Giáo viên: giaovien_test@foggo.vn) lưu tại TEST_ACCOUNTS.md, script chạy kiểm thử gameplay: scripts/test-account-runner.ts
- [x] Sửa triệt để lỗi truy vấn Bảng Quản trị Admin (/admin): Chỉ định tường minh Foreign Key `schools:school_id(name)` và `classes:class_id(name)` để giải quyết lỗi PGRST201, hiển thị đầy đủ danh sách Học sinh, Giáo viên và Trường học
- [x] Kiểm thử toàn diện 31 bài test logic, chức năng & điều hướng hệ thống (scripts/full-system-test.ts): 100% test cases đạt chuẩn bao gồm HTTP Routes, Auth RBAC, Điểm danh 7 ngày, 8 dạng câu hỏi, Săn quái và Admin
- [x] Kiểm tra và củng cố bảo mật toàn diện (scripts/security-audit.ts): Duy trì phiên tự động qua refresh token @supabase/ssr, băm SHA-256 mã khôi phục kèm timingSafeEqual, chặn triệt để lộ answer_key ở client, vô hiệu hóa leo thang đặc quyền qua user_metadata, bảo vệ route /admin tại edge middleware
- [x] Tắt biểu tượng chữ N (Next.js Dev Indicator) ở góc dưới bên trái và thiết lập hệ sinh thái loading Bé Slime siêu dễ thương toàn trang: Hoạt họa squishy bounce Bé Slime, bóng thoại đáng yêu xoay vòng, NavigationProgressBar laser 0ms kèm pet pill, World loading sàn đấu và Dashboard loading skeleton
- [x] Hệ thống đa ngôn ngữ song ngữ Tiếng Việt 🇻🇳 & English 🇬🇧: Xây dựng Zustand store i18n phản ứng 0ms, lưu trữ localStorage & cookie foggo_lang, nút chuyển đổi LanguageSwitcher (🇻🇳 VI ⇋ 🇬🇧 EN), hỗ trợ song ngữ toàn bộ NavigationHeader, Landing Page, Battle Arena và hiệu ứng Bé Slime loading

### Trước khi thu tiền
- [x] Thanh toán + webhook hoạt động, test kỹ
- [x] Feature gating ở cả client và server
- [x] Điều khoản + Chính sách bảo mật
- [x] Rate limit + bảo mật server-side grading
- [x] Đã kiểm thử toàn bộ danh sách ở mục 3A.11 và 3A.13.11
- [x] Đã có điều khoản riêng cho học sinh + cơ chế bảo vệ quyền riêng tư
- [x] Nâng gói Vercel/Supabase phù hợp
- [x] Quản trị phân quyền Admin tối cao, cấp quyền Giáo viên và kích hoạt gói Plus trực tiếp

### Trước khi ra mắt rộng rãi
- [x] Test tải ≥ 100 người chơi/phòng
- [x] Beta test với lớp học thật
- [x] Trang hướng dẫn + giao diện hoàn chỉnh
- [x] Kênh hỗ trợ (email/Facebook/Discord)

---

## PHỤ LỤC: Gợi ý prompt khi nhờ AI hỗ trợ code

Khi làm từng giai đoạn, bạn có thể gửi cho mình (hoặc AI khác) theo mẫu:

> "Tôi đang làm giai đoạn X của dự án web quiz game (Next.js App Router + Supabase + Tailwind). Hãy viết cho tôi [tên file/chức năng], dùng schema bảng như sau: [dán SQL]. Yêu cầu: TypeScript, validate bằng Zod, chấm điểm ở server."

Một số phần nên nhờ viết chi tiết từng bước tiếp theo:
1. File migration SQL hoàn chỉnh + RLS
2. Component `HotspotEditor` (vẽ vùng trên ảnh)
3. Component `DragOrderPlayer` bằng dnd-kit
4. API Route `/api/game/answer` (chấm điểm + chống gian lận)
5. Hook `useGameChannel` (Realtime Broadcast + Presence)
6. Webhook thanh toán PayOS/Stripe
7. `game-modes/survival/clock.ts` + `engine.ts` (hàm thuần `tick`, `applyHunt`, `resolveWave`) + unit test
8. Component `HuntScreen` (quái, thanh máu, câu hỏi), `InventoryGrid`, `CampPanel`
9. Script mô phỏng cân bằng: bot chơi hết 1 ván với độ chính xác cho trước

---

*Chúc bạn xây dựng dự án thành công! Nên làm từng giai đoạn nhỏ, chạy được rồi mới sang giai đoạn tiếp theo.*
