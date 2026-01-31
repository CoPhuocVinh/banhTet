# Phase 7: Admin Dashboard

## Mục tiêu
Xây dựng Admin panel hoàn chỉnh để quản lý đơn hàng, sản phẩm, giá cả và cấu hình website.

## Trạng thái: `[x]` Completed

## Dependencies: Phase 6 hoàn thành (có thể làm song song)

---

## Tasks

### Task 7.1: Auth với Supabase (Login admin)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/login`
- [x] Setup Supabase Auth
- [x] Login form với email/password
- [x] Implement auth middleware/guard
- [x] Protected routes cho `/admin/*`
- [x] Logout functionality
- [x] Session management
- [x] Tạo admin user trong Supabase
- [x] RLS policies cho admin tables

#### Files:
- `src/app/admin/login/page.tsx`
- `src/app/admin/layout.tsx`
- `src/middleware.ts`

---

### Task 7.2: Dashboard overview
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin` (dashboard)
- [x] Admin layout với sidebar navigation
- [x] Stats cards:
  - Tổng đơn hôm nay
  - Doanh thu hôm nay
  - Đơn chờ xác nhận
  - Đơn đang giao
- [x] Quick actions:
  - Xem đơn mới
  - Xem calendar
- [x] Recent orders list (5-10 orders)
- [ ] Revenue chart (optional) - moved to statistics

#### Files:
- `src/app/admin/(dashboard)/page.tsx`
- `src/app/admin/(dashboard)/layout.tsx`
- `src/components/admin/AdminSidebar.tsx`

---

### Task 7.3: Schedule Calendar Admin
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/calendar` (dùng react-day-picker thay vì fullcalendar)
- [x] Calendar view với:
  - Ngày dương lịch
  - Tổng số bánh đặt trong ngày
  - Màu nền theo tier
  - Badge số lượng đơn
- [x] Click ngày → Popup chi tiết:
  - Danh sách orders của ngày
  - Tổng số lượng bánh
  - Tổng doanh thu ngày
  - Link xem chi tiết từng đơn
- [ ] Filter theo status - optional
- [ ] Export data (CSV) - optional

#### Files:
- `src/app/admin/(dashboard)/calendar/page.tsx`

---

### Task 7.4: Cấu hình giai đoạn giá (Price Tiers)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/price-tiers`
- [x] List view các tiers hiện có
- [x] Create tier:
  - Tên
  - Mô tả
  - Màu sắc (color picker)
- [x] Edit tier
- [x] Delete tier (với confirmation)
- [x] Preview màu sắc

#### Files:
- `src/app/admin/(dashboard)/price-tiers/page.tsx`

---

### Task 7.5: Danh sách đơn hàng (Table view)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/orders`
- [x] Data table với columns:
  - Mã đơn
  - Khách hàng
  - SĐT
  - Ngày giao
  - Tổng tiền
  - Trạng thái (badge màu)
  - Ngày tạo
  - Actions
- [x] Search: theo mã đơn, tên, SĐT
- [x] Filter theo trạng thái
- [x] Pagination
- [ ] Bulk actions (optional)

#### Files:
- `src/app/admin/(dashboard)/orders/page.tsx`

---

### Task 7.6: Chi tiết đơn hàng + Cập nhật trạng thái
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/orders/[id]`
- [x] Hiển thị chi tiết:
  - Thông tin khách hàng
  - Địa chỉ giao hàng
  - Ngày giao
  - Ghi chú
  - Danh sách sản phẩm + số lượng + đơn giá
  - Tổng tiền
- [x] Dropdown đổi trạng thái
- [ ] Nút gọi điện (click-to-call) - optional
- [ ] Nút copy địa chỉ - optional
- [ ] Print order - optional

#### Files:
- `src/app/admin/(dashboard)/orders/[id]/page.tsx`
- `src/app/admin/(dashboard)/orders/[id]/OrderStatusUpdater.tsx`

---

### Task 7.7: Thống kê doanh thu
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/statistics`
- [x] Date range picker (từ ngày - đến ngày)
- [x] Preset ranges: Hôm nay, 7 ngày, 30 ngày, Tháng này
- [x] Stats cards:
  - Tổng doanh thu
  - Tổng đơn hàng
  - Tổng số bánh
  - Giá trị đơn TB
- [x] Chart doanh thu theo ngày (line chart - recharts)
- [x] Top sản phẩm bán chạy (bar chart)
- [ ] Phân bố trạng thái đơn hàng (pie chart) - optional
- [ ] Export report (CSV/PDF) - optional

#### Files:
- `src/app/admin/(dashboard)/statistics/page.tsx`

---

### Task 7.8: Quản lý sản phẩm (CRUD)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/products`
- [x] List view với:
  - Thumbnail
  - Tên
  - Trọng lượng
  - Giá theo tier
  - Available status
  - Actions
- [x] Create product:
  - Tên
  - Slug (auto-generate)
  - Mô tả
  - Trọng lượng
  - Hình ảnh URL
  - Is available
- [x] Edit product
- [x] Delete product (với confirmation)
- [x] Set giá cho từng tier (trong modal)
- [x] Enable/Disable nhanh (toggle)

#### Files:
- `src/app/admin/(dashboard)/products/page.tsx`

---

### Task 7.9: Cài đặt website (Site Settings)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/settings`
- [x] Form cài đặt:
  - **Thông tin liên hệ:**
    - Hotline
    - Email
    - Địa chỉ
    - Facebook link
    - Zalo link
  - **Thương hiệu:**
    - Tên (VI/EN)
    - Slogan (VI/EN)
- [x] Save button
- [x] Success/error notification (toast)
- [ ] Preview thay đổi (optional)

#### Files:
- `src/app/admin/(dashboard)/settings/page.tsx`

---

### Task 7.10: Quản lý trạng thái đơn (Order Statuses)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/order-statuses`
- [x] List view với:
  - Badge preview
  - Tên
  - Màu
  - Thứ tự hiển thị
  - Số đơn đang sử dụng
  - Actions
- [x] Create status: tên, màu (color picker), display_order
- [x] Edit status
- [x] Delete status (không cho xóa nếu đang được sử dụng)

#### Files:
- `src/app/admin/(dashboard)/order-statuses/page.tsx`

---

### Task 7.11: Cấu hình ngày - Gán tier cho ngày
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/admin/date-config`
- [x] Calendar view (tháng) với react-day-picker
- [x] Click ngày → Modal:
  - Chọn tier từ danh sách
  - Option "Không gán" để xóa
  - Save button
- [x] Visual:
  - Ngày có tier: hiển thị màu + tên tier
  - Ngày chưa gán: neutral
- [ ] Bulk assign - optional
- [ ] Copy từ năm trước - optional

#### Files:
- `src/app/admin/(dashboard)/date-config/page.tsx`

---

## Admin Layout

```
┌─────────────────────────────────────────────────────────┐
│  🍃 Bánh Tét Admin                    [User ▼] [Logout] │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│  Dashboard  │  [Page Content]                           │
│  Calendar   │                                           │
│  Orders     │                                           │
│  Products   │                                           │
│  ─────────  │                                           │
│  Price Tiers│                                           │
│  Date Config│                                           │
│  Statuses   │                                           │
│  Settings   │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

---

## Deliverables Checklist

- [x] Admin login/logout hoạt động
- [x] Dashboard với stats
- [x] Schedule Calendar với chi tiết đơn theo ngày
- [x] Quản lý đơn hàng (list + detail + status update)
- [x] Quản lý sản phẩm (CRUD)
- [x] Quản lý Price Tiers (CRUD)
- [x] Cấu hình ngày (gán tier)
- [x] Quản lý Order Statuses (CRUD)
- [x] Site Settings (edit)
- [x] Thống kê doanh thu

---

## Files Created/Modified

```
app/
├── admin/
│   ├── layout.tsx            # Admin layout với sidebar
│   ├── page.tsx              # Dashboard
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── calendar/
│   │   └── page.tsx          # Schedule Calendar
│   ├── orders/
│   │   ├── page.tsx          # Orders list
│   │   └── [id]/
│   │       └── page.tsx      # Order detail
│   ├── products/
│   │   └── page.tsx          # Products CRUD
│   ├── price-tiers/
│   │   └── page.tsx          # Price Tiers management
│   ├── date-config/
│   │   └── page.tsx          # Date tier assignments
│   ├── order-statuses/
│   │   └── page.tsx          # Order Statuses management
│   ├── statistics/
│   │   └── page.tsx          # Revenue statistics
│   └── settings/
│       └── page.tsx          # Site settings
└── api/
    └── admin/
        ├── orders/
        ├── products/
        ├── price-tiers/
        ├── date-config/
        ├── order-statuses/
        └── settings/

components/
├── admin/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── StatsCard.tsx
│   ├── DataTable.tsx
│   ├── OrderDetail.tsx
│   ├── ProductForm.tsx
│   ├── TierForm.tsx
│   ├── StatusForm.tsx
│   ├── SettingsForm.tsx
│   ├── DateConfigCalendar.tsx
│   └── ScheduleCalendar.tsx

lib/
├── auth/
│   └── admin.ts              # Admin auth utilities
└── api/
    └── admin/
        ├── orders.ts
        ├── products.ts
        └── settings.ts

middleware.ts                 # Auth middleware for /admin
```

---

*Last Updated: 2026-01-31*
