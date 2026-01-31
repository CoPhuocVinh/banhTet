# Phase 7: Admin Dashboard

## Mục tiêu
Xây dựng Admin panel hoàn chỉnh để quản lý đơn hàng, sản phẩm, giá cả và cấu hình website.

## Trạng thái: `[ ]` Pending

## Dependencies: Phase 6 hoàn thành

---

## Tasks

### Task 7.1: Auth với Supabase (Login admin)
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/login`
- [ ] Setup Supabase Auth
- [ ] Login form với email/password
- [ ] Implement auth middleware/guard
- [ ] Protected routes cho `/admin/*`
- [ ] Logout functionality
- [ ] Session management
- [ ] Tạo admin user trong Supabase
- [ ] RLS policies cho admin tables

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.2: Dashboard overview
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin` (dashboard)
- [ ] Admin layout với sidebar navigation
- [ ] Stats cards:
  - Tổng đơn hôm nay
  - Doanh thu hôm nay
  - Đơn chờ xác nhận
  - Đơn đang giao
- [ ] Quick actions:
  - Xem đơn mới
  - Xem calendar
- [ ] Recent orders list (5-10 orders)
- [ ] Revenue chart (optional)

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.3: Schedule Calendar Admin
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Install `@fullcalendar/react` với plugins cần thiết
- [ ] Tạo route `/admin/calendar`
- [ ] Calendar view với:
  - Ngày dương lịch + ngày âm lịch
  - Tổng số bánh đặt trong ngày
  - Màu nền theo tier
  - Progress bar/badge số lượng
- [ ] Click ngày → Popup chi tiết:
  - Danh sách orders của ngày
  - Tổng số lượng từng loại bánh
  - Tổng doanh thu ngày
  - Link xem chi tiết từng đơn
- [ ] Filter theo status
- [ ] Export data (CSV) - optional

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.4: Cấu hình giai đoạn giá (Price Tiers)
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/price-tiers`
- [ ] List view các tiers hiện có
- [ ] Create tier:
  - Tên (VI/EN)
  - Màu sắc (color picker)
  - Sort order
- [ ] Edit tier
- [ ] Delete tier (với confirmation)
- [ ] Drag & drop reorder
- [ ] Preview màu sắc

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.5: Danh sách đơn hàng (Table view)
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/orders`
- [ ] Data table với columns:
  - Mã đơn
  - Khách hàng
  - SĐT
  - Ngày giao
  - Tổng tiền
  - Trạng thái (badge màu)
  - Ngày tạo
  - Actions
- [ ] Search: theo mã đơn, tên, SĐT
- [ ] Filter:
  - Theo trạng thái
  - Theo ngày giao
  - Theo ngày tạo
- [ ] Sort các columns
- [ ] Pagination
- [ ] Bulk actions (optional):
  - Đổi trạng thái nhiều đơn

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.6: Chi tiết đơn hàng + Cập nhật trạng thái
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/orders/[id]`
- [ ] Hiển thị chi tiết:
  - Thông tin khách hàng
  - Địa chỉ giao hàng
  - Ngày giao (dương + âm lịch)
  - Ghi chú
  - Danh sách sản phẩm + số lượng + đơn giá
  - Tổng tiền
  - Lịch sử trạng thái
- [ ] Dropdown đổi trạng thái
- [ ] Nút gọi điện (click-to-call)
- [ ] Nút copy địa chỉ
- [ ] Print order - optional
- [ ] Edit order (nếu chưa giao) - optional

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.7: Thống kê doanh thu
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/statistics`
- [ ] Date range picker (từ ngày - đến ngày)
- [ ] Preset ranges: Hôm nay, 7 ngày, 30 ngày, Tháng này
- [ ] Stats:
  - Tổng doanh thu
  - Tổng đơn hàng
  - Tổng số bánh
  - Đơn trung bình
- [ ] Chart doanh thu theo ngày (line/bar chart)
- [ ] Top sản phẩm bán chạy
- [ ] Phân bố trạng thái đơn hàng (pie chart)
- [ ] Export report (CSV/PDF) - optional

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.8: Quản lý sản phẩm (CRUD)
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/products`
- [ ] List view với:
  - Thumbnail
  - Tên
  - Category
  - Trọng lượng
  - Available status
  - Actions
- [ ] Create product:
  - Tên (VI/EN)
  - Slug (auto-generate)
  - Mô tả
  - Trọng lượng
  - Category (tét/ú)
  - Hình ảnh (upload hoặc URL)
  - Is vegetarian
  - Is available
- [ ] Edit product
- [ ] Delete product (với confirmation)
- [ ] Set giá cho từng tier (inline hoặc modal)
- [ ] Enable/Disable nhanh (toggle)
- [ ] Drag & drop reorder hiển thị

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.9: Cài đặt website (Site Settings)
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/settings`
- [ ] Form cài đặt:
  - **Thông tin liên hệ:**
    - Hotline
    - Email
    - Địa chỉ
    - Facebook link
    - Zalo link
  - **Thương hiệu:**
    - Tên (VI/EN)
    - Slogan (VI/EN)
- [ ] Save button
- [ ] Validation
- [ ] Success/error notification
- [ ] Preview thay đổi (optional)

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.10: Quản lý trạng thái đơn (Order Statuses)
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/order-statuses`
- [ ] List view với:
  - Badge preview
  - Code
  - Tên (VI/EN)
  - Is default
  - Is final
  - Actions
- [ ] Create status:
  - Code (unique)
  - Tên (VI/EN)
  - Màu badge (color picker)
  - Is default (checkbox)
  - Is final (checkbox)
  - Sort order
- [ ] Edit status
- [ ] Delete status (không cho xóa nếu đang được sử dụng)
- [ ] Drag & drop reorder

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 7.11: Cấu hình ngày - Gán tier cho ngày
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo route `/admin/date-config` hoặc tab trong `/admin/price-tiers`
- [ ] Calendar view (tháng)
- [ ] Click ngày → Popup:
  - Chọn tier từ dropdown
  - Enable/Disable checkbox
  - Ghi chú text field
  - Save button
- [ ] Bulk assign:
  - Select nhiều ngày
  - Assign cùng tier
- [ ] Visual:
  - Ngày có tier: hiển thị màu
  - Ngày disabled: gray + icon
  - Ngày chưa gán: white/neutral
- [ ] Copy từ năm trước (optional)

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

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

- [ ] Admin login/logout hoạt động
- [ ] Dashboard với stats
- [ ] Schedule Calendar với chi tiết đơn theo ngày
- [ ] Quản lý đơn hàng (list + detail + status update)
- [ ] Quản lý sản phẩm (CRUD)
- [ ] Quản lý Price Tiers (CRUD)
- [ ] Cấu hình ngày (gán tier, enable/disable)
- [ ] Quản lý Order Statuses (CRUD)
- [ ] Site Settings (edit)
- [ ] Thống kê doanh thu

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

*Last Updated: 2026-01-26*
