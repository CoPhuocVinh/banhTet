# Phase 2: Landing Page & 3D Hero

## Mục tiêu
Tạo trang chủ ấn tượng với hiệu ứng 3D bánh tét, giới thiệu thương hiệu và các sản phẩm nổi bật.

## Trạng thái: `[x]` Completed

## Dependencies: Phase 1 hoàn thành

---

## Tasks

### Task 2.1: Layout chung - Header, Footer, Navigation
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo Header component với:
  - Logo thương hiệu
  - Navigation menu (Trang chủ, Sản phẩm, Đặt hàng)
  - Language switcher (VI/EN)
  - Cart icon với badge số lượng
  - Mobile hamburger menu
- [x] Tạo Footer component với:
  - Thông tin liên hệ (hotline, email, address)
  - Social links (Facebook, Zalo)
  - Copyright
- [x] Tạo Navigation với smooth scroll
- [x] Responsive cho mobile/tablet/desktop

#### Issues & Notes:
- Header/Footer dùng static data, cần kết nối Supabase sau

---

### Task 2.2: Hero section với 3D bánh tét xoay
**Status:** `[x]` Completed

#### To-Do:
- [x] Sử dụng 3D model bánh tét từ React Three Fiber
- [x] Setup React Three Fiber canvas
- [x] Implement auto-rotate animation cho model
- [x] Thêm lighting setup (ambient + directional + environment)
- [x] Tạo background gradient với Framer Motion animation
- [x] Thêm headline text với animation (Framer Motion stagger)
- [x] CTA button "Đặt hàng ngay" với shadow effects
- [x] Fallback loading spinner
- [x] Scroll indicator animated

#### Issues & Notes:
- 3D model sử dụng primitive shapes (Cylinder, Torus, RoundedBox)
- Có thể thay bằng .glb model sau

---

### Task 2.3: Section giới thiệu thương hiệu
**Status:** `[x]` Completed

#### To-Do:
- [x] Layout 2 columns: Image + Text
- [x] Thêm hình ảnh thương hiệu/quy trình làm bánh
- [x] Animation fade-in khi scroll vào view
- [x] Responsive stack trên mobile
- [x] Stats grid với icons (Lucide)

#### Issues & Notes:
- Image từ CDN placeholder

---

### Task 2.4: Section sản phẩm nổi bật (3D hover effects)
**Status:** `[x]` Completed

#### To-Do:
- [x] Grid layout 2-4 columns responsive
- [x] Product card với:
  - Hình ảnh (từ CDN: https://cdn.efl.vn/banhTetImg/)
  - Tên sản phẩm
  - Trọng lượng
  - Giá "từ XXXk" (giá thấp nhất)
  - Hover scale effect
- [x] Animation stagger khi load
- [x] "Xem thêm" button link đến /products

#### Issues & Notes:
- Dùng sample data, cần fetch từ Supabase sau

---

### Task 2.5: Section bảng giá theo ngày
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo bảng giá responsive (horizontal scroll trên mobile)
- [x] Color coding theo tier
- [x] Tooltip giải thích các tier
- [x] Badge "Phổ biến" cho tier cao điểm

#### Issues & Notes:
- Dùng static data từ seed file
- Cần connect Supabase cho dynamic data

---

### Task 2.6: Schedule Calendar (Chọn ngày đặt hàng)
**Status:** `[x]` Completed

#### To-Do:
- [x] Install `react-day-picker` và `date-fns`
- [x] Tạo Calendar component custom
- [x] Hiển thị mỗi ô ngày với:
  - Ngày dương lịch (lớn)
  - Ngày âm lịch (nhỏ, placeholder)
  - Màu nền theo tier
- [x] Trạng thái ngày:
  - Ngày quá khứ: disabled/opacity
  - Ngày có tier: colored background
- [x] Click ngày → select và hiển thị info
- [x] Legend màu sắc

#### Issues & Notes:
- Lunar date hiện dùng placeholder mapping
- Cần install @dqcai/vn-lunar cho conversion thực

---

### Task 2.7: CTA đặt hàng nổi bật
**Status:** `[x]` Completed

#### To-Do:
- [x] Animated CTA section với gradient background
- [x] Số hotline click-to-call
- [x] Zalo link
- [x] Background animation effects

#### Issues & Notes:
- Fixed bottom bar có thể thêm sau nếu cần

---

### Task 2.8: Responsive cho mobile/tablet
**Status:** `[~]` In Progress

#### To-Do:
- [x] Mobile hamburger menu trong Header
- [x] Responsive grid layouts
- [x] Touch-friendly button sizes
- [x] Font size responsive
- [ ] Test thực tế trên devices
- [ ] 3D performance optimization

#### Issues & Notes:
- Cần test trên thiết bị thực

---

## Deliverables Checklist

- [x] Landing page hoàn chỉnh với tất cả sections
- [x] Hiệu ứng 3D hoạt động
- [x] Schedule Calendar hoạt động
- [x] Đa ngôn ngữ Việt/English
- [x] Responsive layouts
- [ ] Data fetch từ Supabase (đang dùng static)

---

## Files Created/Modified

```
src/components/
├── layout/
│   ├── Header.tsx          ✅ Created
│   ├── Footer.tsx          ✅ Created
│   ├── LanguageSwitcher.tsx (existing)
│   └── index.ts            ✅ Created
├── sections/
│   ├── HeroSection.tsx     ✅ Updated (Framer Motion)
│   ├── BrandSection.tsx    ✅ Created
│   ├── FeaturedProducts.tsx ✅ Created
│   ├── PricingTable.tsx    ✅ Created
│   ├── ScheduleCalendar.tsx ✅ Created
│   ├── CTASection.tsx      ✅ Created
│   └── index.ts            ✅ Created
└── 3d/
    ├── BanhTet3D.tsx       (existing)
    └── Scene3D.tsx         (existing)

src/app/[locale]/
├── page.tsx                ✅ Updated (all sections)
└── layout.tsx              ✅ Updated (Header/Footer)

messages/
├── vi.json                 ✅ Updated (brand translations)
└── en.json                 ✅ Updated (brand translations)
```

---

*Last Updated: 2026-01-27*
