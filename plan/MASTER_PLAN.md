# Bánh Tét Tết - Master Plan

## Project Overview

Web application đặt và bán bánh tét Tết với hiệu ứng 3D, đa ngôn ngữ VI/EN, và admin dashboard.

**Requirements:** [docs/requirement.md](../docs/requirement.md)

---

## Timeline Overview

| Phase | Tên | Status | Tasks | Chi tiết |
|-------|-----|--------|-------|----------|
| 1 | Foundation & Setup | `[x]` Completed | 7 tasks | [Phase 1](phase-1/README.md) |
| 2 | Landing Page & 3D Hero | `[x]` Completed | 8 tasks | [Phase 2](phase-2/README.md) |
| 3 | Product Catalog & Cart | `[x]` Completed | 8 tasks | [Phase 3](phase-3/README.md) |
| 4 | Checkout & Order | `[x]` Completed | 6 tasks | [Phase 4](phase-4/README.md) |
| 5 | Polish & Optimization | `[~]` In Progress | 8 tasks | [Phase 5](phase-5/README.md) |
| 6 | Deployment | `[ ]` Pending | 5 tasks | [Phase 6](phase-6/README.md) |
| 7 | Admin Dashboard | `[x]` Completed | 11 tasks | [Phase 7](phase-7/README.md) |

**Tổng:** 53 tasks

---

## Phase Summary

### Phase 1: Foundation & Setup
**Mục tiêu:** Khởi tạo project và cấu hình cơ bản

**Tasks:**
- 1.1 Khởi tạo Next.js 15 + React 19 + TypeScript
- 1.2 Cấu hình Tailwind CSS + shadcn/ui
- 1.3 Setup Three.js + React Three Fiber
- 1.4 Cấu hình i18n (next-intl)
- 1.5 Setup Supabase client
- 1.6 Tạo database schema + seed data
- 1.7 Cấu hình ESLint, Prettier

**Deliverables:** Project chạy, DB có data, i18n hoạt động

---

### Phase 2: Landing Page & 3D Hero
**Mục tiêu:** Trang chủ ấn tượng với 3D

**Tasks:**
- 2.1 Layout: Header, Footer, Navigation
- 2.2 Hero section với 3D bánh tét
- 2.3 Section giới thiệu thương hiệu
- 2.4 Section sản phẩm nổi bật
- 2.5 Section bảng giá theo ngày
- 2.6 Schedule Calendar
- 2.7 CTA đặt hàng
- 2.8 Responsive mobile/tablet

**Deliverables:** Landing page hoàn chỉnh, 3D mượt

---

### Phase 3: Product Catalog & Cart
**Mục tiêu:** Xem sản phẩm và quản lý giỏ hàng

**Tasks:**
- 3.1 Trang danh sách sản phẩm
- 3.2 Product card với 3D hover
- 3.3 Trang chi tiết sản phẩm
- 3.4 Logic tính giá theo ngày âm lịch
- 3.5 Cart state management (Zustand)
- 3.6 Cart drawer/modal UI
- 3.7 Thêm/xóa/cập nhật số lượng
- 3.8 Tổng tiền tự động theo ngày nhận

**Deliverables:** Catalog, giỏ hàng với localStorage persist

---

### Phase 4: Checkout & Order
**Mục tiêu:** Hoàn tất đặt hàng

**Tasks:**
- 4.1 Form thông tin khách hàng
- 4.2 Date picker với âm lịch
- 4.3 Validation form
- 4.4 API route lưu order
- 4.5 Trang xác nhận đơn hàng
- 4.6 Email notification (optional)

**Deliverables:** Flow đặt hàng hoàn chỉnh, đơn lưu DB

---

### Phase 5: Polish & Optimization
**Mục tiêu:** Hoàn thiện trải nghiệm

**Tasks:**
- 5.1 Animation polish
- 5.2 Loading states & Skeleton
- 5.3 Error handling & Fallbacks
- 5.4 SEO optimization
- 5.5 Performance optimization
- 5.6 Accessibility audit
- 5.7 Cross-browser testing
- 5.8 Mobile optimization

**Deliverables:** Lighthouse > 90, SEO ready, responsive hoàn hảo

---

### Phase 6: Deployment
**Mục tiêu:** Đưa lên production

**Tasks:**
- 6.1 Setup Vercel project
- 6.2 Environment variables
- 6.3 Domain configuration
- 6.4 SSL certificate
- 6.5 Analytics setup (optional)

**Deliverables:** Website live với HTTPS

---

### Phase 7: Admin Dashboard
**Mục tiêu:** Quản lý đơn hàng + Cấu hình

**Tasks:**
- 7.1 Auth với Supabase
- 7.2 Dashboard overview
- 7.3 Schedule Calendar Admin
- 7.4 Cấu hình Price Tiers
- 7.5 Danh sách đơn hàng
- 7.6 Chi tiết đơn + cập nhật status
- 7.7 Thống kê doanh thu
- 7.8 Quản lý sản phẩm (CRUD)
- 7.9 Cài đặt website
- 7.10 Quản lý trạng thái đơn
- 7.11 Cấu hình ngày (gán tier)

**Deliverables:** Admin panel hoàn chỉnh

---

## Tech Stack

```
Frontend:
├── Next.js 15 + React 19 + TypeScript 5
├── Tailwind CSS 4 + Framer Motion
├── Three.js + React Three Fiber + Drei
├── shadcn/ui + Lucide React
├── Zustand (state + localStorage persist)
├── react-hook-form + zod
├── next-intl (i18n VI/EN)
├── react-day-picker + @dqcai/vn-lunar
└── @fullcalendar/react (Admin)

Backend:
├── Supabase (PostgreSQL + Auth)
├── Next.js API Routes
└── Resend (Email - optional)
```

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[~]` | In Progress |
| `[x]` | Completed |
| `[!]` | Blocked/Issue |

---

## How to Use This Plan

### Cấu trúc Plan

```
Phase (giai đoạn)
├── Task (công việc lớn)
│   ├── To-do (việc cụ thể cần làm)
│   │   └── Issue/Note (vấn đề gặp phải khi implement)
│   └── To-do
└── Task
    └── To-do
```

### Quy tắc làm việc

1. **Bắt đầu task:** Đổi `[ ]` → `[~]`
2. **Hoàn thành task:** Đổi `[~]` → `[x]`
3. **Gặp issue:** Đổi `[ ]` → `[!]` và note ngay tại to-do
4. **Update progress:** Cập nhật bảng Timeline Overview

### Quy tắc ghi chú vấn đề

Khi implement to-do mà **gặp vấn đề**, PHẢI note ngay vào to-do đó:

```markdown
- [!] Tên to-do
  > **Issue:** Mô tả vấn đề gặp phải
  > **Nguyên nhân:** (nếu biết)
  > **Giải pháp tạm:** (nếu có)
  > **Cần:** (cần gì để giải quyết)
```

**Lý do:**
- Tránh mất dấu vấn đề
- Dễ report và theo dõi
- Giúp quay lại xử lý sau
- Tạo lịch sử cho việc debug

---

## Quick Links

- [Requirements](../docs/requirement.md)
- [Phase 1: Foundation](phase-1/README.md)
- [Phase 2: Landing Page](phase-2/README.md)
- [Phase 3: Product & Cart](phase-3/README.md)
- [Phase 4: Checkout](phase-4/README.md)
- [Phase 5: Optimization](phase-5/README.md)
- [Phase 6: Deployment](phase-6/README.md)
- [Phase 7: Admin](phase-7/README.md)

---

*Created: 2026-01-26*
*Last updated: 2026-01-31*
*Phase 4 completed: 2026-01-27*
*Phase 7 completed: 2026-01-31*
