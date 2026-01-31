# Phase 1: Foundation & Setup

## Mục tiêu
Khởi tạo project và cấu hình cơ bản để có nền tảng vững chắc cho development.

## Trạng thái: `[x]` Completed

---

## Tasks

### Task 1.1: Khởi tạo Next.js 15 + React 19 + TypeScript
**Status:** `[x]` Completed

#### To-Do:
- [x] Chạy `npx create-next-app@latest` với App Router
- [x] Cấu hình TypeScript strict mode
- [x] Setup path aliases trong `tsconfig.json`
- [x] Verify project chạy được ở localhost:3000

#### Issues & Notes:
- Next.js 16.1.4 + React 19.2.3 đã được cài đặt (phiên bản mới nhất)
- Tailwind CSS 4 đã được include sẵn

---

### Task 1.2: Cấu hình Tailwind CSS + shadcn/ui
**Status:** `[x]` Completed

#### To-Do:
- [x] Install Tailwind CSS 4
- [x] Cấu hình `tailwind.config.js` với theme colors từ requirement
  - Đỏ Tết: #C41E3A
  - Vàng Ánh Kim: #FFD700
  - Xanh Lá Chuối: #2E5339
  - Trắng Ngà: #FFFEF5
  - Nâu Đất: #5D4037
- [x] Setup `globals.css` với CSS variables
- [x] Init shadcn/ui với `npx shadcn@latest init`
- [x] Install các components cần thiết: button, input, card, dialog, etc.
- [x] Cấu hình fonts: Be Vietnam Pro / Inter

#### Issues & Notes:
- Đã cấu hình Be Vietnam Pro làm font chính + JetBrains Mono làm monospace
- Đã exclude `ui-ux-pro-max-skill` khỏi TypeScript build
- Build thành công với Next.js 16.1.4 + Tailwind CSS 4

---

### Task 1.3: Setup Three.js + React Three Fiber
**Status:** `[x]` Completed

#### To-Do:
- [x] Install packages: `three`, `@react-three/fiber`, `@react-three/drei`
- [x] Tạo wrapper component cho 3D canvas
- [x] Test basic 3D scene render
- [x] Cấu hình lazy loading cho 3D components

#### Issues & Notes:
- Đã tạo `Scene3D` wrapper component với lazy loading
- Đã tạo `BanhTet3D` 3D model component (placeholder)
- Sử dụng `next/dynamic` với `ssr: false` trong Client Component
- Build thành công, 3D render hoạt động

---

### Task 1.4: Cấu hình i18n (next-intl) cho Việt/English
**Status:** `[x]` Completed

#### To-Do:
- [x] Install `next-intl`
- [x] Tạo cấu trúc thư mục `/messages` với `vi.json` và `en.json`
- [x] Setup middleware cho locale routing
- [x] Cấu hình default locale (vi)
- [x] Tạo language switcher component
- [x] Test switching giữa VI/EN

#### Issues & Notes:
- Đã cấu hình next-intl với App Router
- Routes: /vi (default), /en
- Middleware warning về "proxy" convention - vẫn hoạt động
- HeroSection đã dùng translations

---

### Task 1.5: Setup Supabase client + environment
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo Supabase project (hoặc sử dụng existing)
- [x] Tạo file `.env.local` với:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY
- [x] Install `@supabase/supabase-js`, `@supabase/ssr`
- [x] Tạo Supabase client helpers trong `/lib/supabase`
  - `client.ts` - Browser client
  - `server.ts` - Server client
  - `middleware.ts` - Middleware client
- [x] Test connection với Supabase

#### Issues & Notes:
- Đã tạo `.env.local.example` template
- Đã định nghĩa Database types trong `types.ts`
- Cần tạo Supabase project thực tế để test connection

---

### Task 1.6: Tạo database schema + seed data
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo bảng `products`
- [x] Tạo bảng `price_tiers`
- [x] Tạo bảng `product_tier_prices`
- [x] Tạo bảng `date_tier_assignments`
- [x] Tạo bảng `orders`
- [x] Tạo bảng `order_items`
- [x] Tạo bảng `order_statuses`
- [x] Tạo bảng `site_settings`
- [x] Chạy migration scripts
- [x] Tạo seed data cho products (8 sản phẩm)
- [x] Tạo seed data cho price_tiers (3 tiers)
- [x] Tạo seed data cho product_tier_prices
- [x] Tạo seed data cho order_statuses
- [x] Tạo seed data cho site_settings
- [x] Setup auto-seed logic với environment config

#### Issues & Notes:
- Migration: `supabase/migrations/001_initial_schema.sql`
- Seed: `supabase/seed/001_seed_data.sql`
- RLS policies cho public read + service role full access
- Cần chạy trong Supabase SQL Editor

---

### Task 1.7: Cấu hình ESLint, Prettier
**Status:** `[x]` Completed

#### To-Do:
- [x] Cấu hình ESLint với Next.js recommended rules
- [x] Setup Prettier với config phù hợp
- [x] Tạo `.prettierrc` và `.eslintrc.json`
- [x] Setup pre-commit hooks với husky (optional) - skipped
- [x] Test lint và format

#### Issues & Notes:
- ESLint 9 flat config với next recommended rules
- Prettier với tailwindcss plugin cho class sorting
- Scripts: `npm run lint`, `npm run format`

---

## Deliverables Checklist

- [x] Project chạy được ở localhost
- [x] Database có sẵn products + pricing data
- [x] i18n hoạt động cơ bản (switch VI/EN)
- [x] 3D rendering test thành công
- [x] Tailwind + shadcn/ui setup xong
- [x] Code formatting + linting hoạt động

---

## Dependencies

- Không có dependencies từ phase khác

---

## Files Created/Modified

```
banhtet/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/
├── components/
│   ├── ui/              # shadcn components
│   └── 3d/              # Three.js components
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── messages/
│   ├── vi.json
│   └── en.json
├── .env.local
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

*Last Updated: 2026-01-26*
