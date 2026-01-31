# Bánh Tét Tết - Web App Requirements

## 1. Tổng Quan Dự Án

### 1.1 Mô tả

Web application đặt và bán bánh tét Tết - sản phẩm truyền thống Việt Nam trong dịp Tết Nguyên Đán. Website hướng tới trải nghiệm hiện đại với hiệu ứng 3D, giao diện đẹp mắt, và quy trình đặt hàng đơn giản.

### 1.2 Mục tiêu

- Tạo kênh bán hàng online chuyên nghiệp cho bánh tét Tết
- Giúp khách hàng dễ dàng xem sản phẩm, giá cả và đặt hàng
- Tự động hóa quản lý đơn hàng qua database
- Tạo ấn tượng với thiết kế độc đáo kết hợp truyền thống & hiện đại

---

## 2. Phân Tích Nghiệp Vụ

### 2.1 Sản Phẩm

> **Lưu ý:** Danh sách sản phẩm được quản lý động qua Admin. Bảng dưới đây là **seed data** ban đầu.

| STT | Loại bánh                 | Trọng lượng | Mô tả                                              |
| --- | --------------------------- | -------------- | ---------------------------------------------------- |
| 1   | Tét - Thập cẩm Tôm Khô | 1.7kg          | Bánh tét cao cấp, nhân thập cẩm với tôm khô |
| 2   | Tét - 3 màu               | 1.2kg          | Bánh tét 3 màu truyền thống                     |
| 3   | Tét - Thịt trứng (Lớn)  | 1.2kg          | Bánh tét nhân thịt + trứng muối, cỡ lớn      |
| 4   | Tét - Thịt trứng (Nhỏ)  | 1.0kg          | Bánh tét nhân thịt + trứng muối, cỡ nhỏ      |
| 5   | Tét - Đậu mỡ & Chay     | 1.0kg          | Phù hợp người ăn chay                           |
| 6   | Tét - Chuối               | 800g           | Bánh tét chuối ngọt                              |
| 7   | Ú - Thập cẩm Tôm Khô   | 900g           | Bánh ú cao cấp                                    |
| 8   | Ú - Thập cẩm             | 500g           | Bánh ú thập cẩm nhỏ                             |

**Admin có thể:** Thêm/sửa/xóa sản phẩm, thay đổi giá, enable/disable.

### 2.2 Bảng Giá Theo Ngày Âm Lịch

> **Lưu ý:** Giá và giai đoạn được Admin cấu hình qua `price_tiers` + `product_tier_prices`. Bảng dưới là **seed data**.

Giá tăng dần theo độ gần Tết:

| Ngày Âm Lịch | Mức giá        |
| --------------- | ---------------- |
| 18 - 19         | Giá thấp nhất |
| 20 - 22         | Giá trung bình |
| 23 - 29         | Giá cao nhất   |

**Chi tiết giá:**

| Sản phẩm                        | 18-19 | 20-22 | 23-29 |
| --------------------------------- | ----- | ----- | ----- |
| Tét Thập cẩm Tôm Khô (1.7kg) | 260k  | 280k  | 290k  |
| Tét 3 màu (1.2kg)               | 140k  | 150k  | 160k  |
| Tét Thịt trứng Lớn (1.2kg)    | 140k  | 150k  | 160k  |
| Tét Thịt trứng Nhỏ (1.0kg)    | 120k  | 130k  | 140k  |
| Tét Đậu mỡ & Chay (1.0kg)     | 100k  | 120k  | 130k  |
| Tét Chuối (800g)                | 80k   | 90k   | 100k  |
| Ú Thập cẩm Tôm Khô (900g)    | 130k  | 140k  | 145k  |
| Ú Thập cẩm (500g)              | 75k   | 80k   | 85k   |

### 2.3 Quy Trình Đặt Hàng

```
[Khách xem sản phẩm] → [Chọn loại bánh + số lượng] → [Chọn ngày nhận]
→ [Điền thông tin liên hệ] → [Xác nhận đơn hàng] → [Nhận thông báo]
```

### 2.4 Thông Tin Khách Hàng Cần Thu Thập

- Họ tên (bắt buộc)
- Số điện thoại (bắt buộc)
- Email (tùy chọn - gửi notification nếu có)
- Địa chỉ giao hàng (bắt buộc)
- Ngày muốn nhận bánh - chọn dương lịch, hiển thị âm lịch bên dưới
- Ghi chú đặc biệt (tùy chọn)

### 2.5 Thông Tin Liên Hệ

> **Lưu ý:** Thông tin liên hệ lưu trong `site_settings`, Admin có thể thay đổi.

- **Hotline:** 0374027409 *(seed data)*
- **Email:** *(Admin cấu hình)*
- **Facebook/Zalo:** *(Admin cấu hình)*

### 2.6 Giá Gốc (Base Price) - Tham Khảo Nội Bộ

| Sản phẩm                        | 18-19 | 20-22 | 23-29 |
| --------------------------------- | ----- | ----- | ----- |
| Tét Thập cẩm Tôm Khô (1.7kg) | 220k  | 240k  | 250k  |
| Tét 3 màu (1.2kg)               | 100k  | 110k  | 120k  |
| Tét Thịt trứng Lớn (1.2kg)    | 100k  | 110k  | 120k  |
| Tét Thịt trứng Nhỏ (1.0kg)    | 80k   | 90k   | 100k  |
| Tét Đậu mỡ & Chay (1.0kg)     | 60k   | 80k   | 90k   |
| Tét Chuối (800g)                | 40k   | 50k   | 60k   |
| Ú Thập cẩm Tôm Khô (900g)    | 90k   | 100k  | 105k  |
| Ú Thập cẩm (500g)              | 35k   | 40k   | 45k   |

### 2.7 Mapping Ngày Âm Lịch - Dương Lịch (Tết 2026)

> **Lưu ý:** Đây là tham khảo. Thực tế Admin gán ngày vào tier qua `date_tier_assignments`.

| Ngày Âm Lịch (Tháng Chạp) | Ngày Dương Lịch | Giai đoạn giá |
| ---------------------------- | ----------------- | ---------------- |
| 18 tháng Chạp              | 05/02/2026        | Giá thấp       |
| 19 tháng Chạp              | 06/02/2026        | Giá thấp       |
| 20 tháng Chạp              | 07/02/2026        | Giá trung bình |
| 21 tháng Chạp              | 08/02/2026        | Giá trung bình |
| 22 tháng Chạp              | 09/02/2026        | Giá trung bình |
| 23 tháng Chạp (Táo Quân)  | 10/02/2026        | Giá cao        |
| 24 - 29 tháng Chạp         | 11-16/02/2026     | Giá cao        |
| **Mùng 1 Tết**           | **17/02/2026**  | Tết            |

---

## 3. Yêu Cầu Chức Năng

### 3.1 Trang Chủ (Landing Page)

- [ ] Hero section với hiệu ứng 3D bánh tét (Three.js)
- [ ] Giới thiệu ngắn về thương hiệu
- [ ] Danh sách sản phẩm nổi bật
- [ ] **Schedule Calendar đặt hàng** (xem mục 3.6)
- [ ] CTA đặt hàng nổi bật
- [ ] Thông tin liên hệ nhanh *(lấy từ site_settings)*

### 3.2 Trang Sản Phẩm

- [ ] Grid/List view các loại bánh
- [ ] Hình ảnh sản phẩm chất lượng cao
- [ ] Thông tin chi tiết: tên, mô tả, trọng lượng
- [ ] Hiển thị giá theo ngày âm lịch hiện tại
- [ ] Bảng giá đầy đủ theo thời gian
- [ ] Nút thêm vào giỏ hàng

### 3.3 Giỏ Hàng (Cart)

- [ ] Hiển thị danh sách sản phẩm đã chọn
- [ ] Cho phép thay đổi số lượng
- [ ] Tính tổng tiền tự động
- [ ] Chọn ngày nhận hàng (ảnh hưởng đến giá)
- [ ] Nút tiến hành đặt hàng
- [ ] **Lưu giỏ hàng vào localStorage** (persist khi refresh/đóng tab)
- [ ] Cart drawer/slide-over UI

### 3.4 Form Đặt Hàng

- [ ] Nhập thông tin khách hàng
- [ ] Validation dữ liệu
- [ ] Xác nhận đơn hàng
- [ ] Gửi thông tin về Supabase

### 3.5 Trang Xác Nhận

- [ ] Hiển thị chi tiết đơn hàng
- [ ] Mã đơn hàng
- [ ] Thông tin liên hệ hỗ trợ *(lấy từ site_settings)*

### 3.6 Schedule Calendar (Trang Chủ)

**Mô tả:** Calendar hiển thị các ngày có thể đặt bánh, cho phép khách hàng click chọn ngày để bắt đầu đặt hàng.

**UI/UX:**
- [ ] Hiển thị lịch tháng (dương lịch)
- [ ] Mỗi ô ngày hiển thị: ngày dương + ngày âm lịch bên dưới
- [ ] **Color coding động từ cấu hình Admin:**
  - Màu sắc lấy từ `price_tiers.color` trong database
  - Mỗi ngày hiển thị màu theo tier được gán
  - Ví dụ mặc định: 🟢 Giá thấp | 🟡 Giá TB | 🔴 Giá cao
- [ ] **Trạng thái ngày từ Admin:**
  - Ngày không khả dụng (admin disable) = disabled/gray + ghi chú
  - Ngày quá khứ = disabled/gray
  - Ngày chưa được gán tier = không hiển thị hoặc gray
- [ ] Hover hiển thị tooltip: "Giá từ XXXk - Click để đặt" (hoặc "Tạm ngưng" nếu disabled)
- [ ] Click vào ngày → mở modal chọn sản phẩm hoặc scroll đến section sản phẩm

**Flow:**
```
[Khách xem Calendar] → [Hover xem giá] → [Click chọn ngày]
→ [Hiển thị danh sách bánh với giá của ngày đó] → [Add to Cart]
```

### 3.7 Date Picker với Âm Lịch (Checkout)

**Mô tả:** Khi chọn ngày nhận hàng trong checkout, hiển thị cả dương lịch và âm lịch.

- [ ] Date picker chọn ngày dương lịch
- [ ] Bên dưới date picker hiển thị: "Ngày XX tháng Chạp" (âm lịch)
- [ ] Hiển thị giai đoạn giá tương ứng
- [ ] Giá trong cart tự động cập nhật khi đổi ngày

---

## 4. Yêu Cầu Phi Chức Năng

### 4.1 Performance

- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- 3D elements không ảnh hưởng đến performance mobile

### 4.2 Responsive Design

- Mobile-first approach
- Breakpoints: 375px, 768px, 1024px, 1440px
- Touch-friendly (touch targets >= 44px)

### 4.3 SEO

- Meta tags đầy đủ
- Structured data (JSON-LD)
- Sitemap.xml
- Semantic HTML

### 4.4 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatible
- Color contrast ratio >= 4.5:1

---

## 5. Tech Stack

### 5.1 Frontend Framework

| Technology           | Version | Mục đích                  |
| -------------------- | ------- | ---------------------------- |
| **Next.js**    | 15.x    | React framework với SSR/SSG |
| **React**      | 19.x    | UI library                   |
| **TypeScript** | 5.x     | Type safety                  |

### 5.2 Styling

| Technology                    | Mục đích                 |
| ----------------------------- | --------------------------- |
| **Tailwind CSS**        | Utility-first CSS framework |
| **Framer Motion**       | Animation library           |
| **clsx/tailwind-merge** | Class name utilities        |

### 5.3 3D Graphics

| Technology                  | Mục đích                 |
| --------------------------- | --------------------------- |
| **Three.js**          | 3D rendering engine         |
| **React Three Fiber** | React renderer cho Three.js |
| **@react-three/drei** | Helpers cho R3F             |

### 5.4 Backend & Database

| Technology                   | Mục đích                |
| ---------------------------- | -------------------------- |
| **Supabase**           | PostgreSQL database + Auth |
| **Next.js API Routes** | Backend endpoints          |

### 5.5 UI Components

| Technology             | Mục đích            |
| ---------------------- | ---------------------- |
| **shadcn/ui**    | Component library      |
| **Radix UI**     | Headless UI primitives |
| **Lucide React** | Icon library           |

### 5.6 Development Tools

| Tool               | Mục đích     |
| ------------------ | --------------- |
| **ESLint**   | Linting         |
| **Prettier** | Code formatting |
| **pnpm**     | Package manager |

---

## 6. Cấu Trúc Thư Mục (Đề xuất)

```
banhtet/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Landing pages
│   │   ├── page.tsx          # Trang chủ
│   │   └── layout.tsx
│   ├── products/             # Trang sản phẩm
│   ├── cart/                 # Giỏ hàng
│   ├── checkout/             # Đặt hàng
│   ├── order-success/        # Xác nhận đơn
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── 3d/                   # Three.js components
│   ├── layout/               # Header, Footer, Navigation
│   └── features/             # Product cards, Cart, etc.
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── utils.ts              # Utility functions
│   └── pricing.ts            # Price calculation logic
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
├── public/
│   └── images/               # Static images
├── docs/                     # Documentation
└── styles/
    └── globals.css           # Global styles
```

---

## 7. Database Schema (Supabase)

### 7.1 Products Table

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    weight_grams INTEGER NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(50), -- 'tet' | 'u'
    is_vegetarian BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 Pricing Table

```sql
CREATE TABLE pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    lunar_date_start INTEGER NOT NULL, -- 18, 20, 23
    lunar_date_end INTEGER NOT NULL,   -- 19, 22, 29
    price_vnd INTEGER NOT NULL,
    year INTEGER NOT NULL
);
```

### 7.3 Orders Table

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),          -- Optional
    delivery_address TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_lunar_date VARCHAR(20),
    notes TEXT,
    total_amount INTEGER NOT NULL,
    status_code VARCHAR(30) DEFAULT 'pending' REFERENCES order_statuses(code),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.4 Order Items Table

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.5 Price Tiers Table (Admin Config)

```sql
-- Giai đoạn giá (Admin tạo/sửa)
CREATE TABLE price_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,           -- "Giá thấp", "Giá trung bình"
    name_en VARCHAR(50),                 -- "Low price", "Medium price"
    color VARCHAR(20) NOT NULL,          -- Hex color: "#22c55e"
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.6 Product Tier Prices Table

```sql
-- Giá sản phẩm theo từng tier
CREATE TABLE product_tier_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tier_id UUID REFERENCES price_tiers(id) ON DELETE CASCADE,
    price_vnd INTEGER NOT NULL,
    UNIQUE(product_id, tier_id)
);
```

### 7.7 Date Tier Assignments Table

```sql
-- Gán ngày vào tier (Admin config)
CREATE TABLE date_tier_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,           -- Ngày dương lịch
    tier_id UUID REFERENCES price_tiers(id),
    is_available BOOLEAN DEFAULT true,   -- Có thể đặt hàng không
    note VARCHAR(200),                   -- "Sold out", "Nghỉ lễ"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.8 Site Settings Table (Admin Config)

```sql
-- Cấu hình website (Admin thay đổi)
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(50) UNIQUE NOT NULL,     -- 'hotline', 'email', 'address', etc.
    value TEXT NOT NULL,
    value_en TEXT,                        -- English version (nếu có)
    description VARCHAR(200),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data mặc định
INSERT INTO site_settings (key, value, description) VALUES
('hotline', '0374027409', 'Số điện thoại liên hệ'),
('email', '', 'Email liên hệ'),
('address', '', 'Địa chỉ cửa hàng'),
('facebook', '', 'Link Facebook'),
('zalo', '', 'Link/Số Zalo'),
('brand_name', 'Bánh Tét Tết', 'Tên thương hiệu'),
('brand_name_en', 'Tet Cake', 'Brand name (English)'),
('brand_slogan', 'Hương vị Tết truyền thống', 'Slogan'),
('brand_slogan_en', 'Traditional Tet Flavor', 'Slogan (English)');
```

### 7.9 Order Statuses Table (Admin Config)

```sql
-- Trạng thái đơn hàng (Admin tạo/sửa)
CREATE TABLE order_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,    -- 'pending', 'confirmed', etc.
    name VARCHAR(50) NOT NULL,           -- "Chờ xác nhận"
    name_en VARCHAR(50),                 -- "Pending"
    color VARCHAR(20) DEFAULT '#6b7280', -- Badge color
    sort_order INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,    -- Trạng thái mặc định khi tạo đơn
    is_final BOOLEAN DEFAULT false,      -- Trạng thái kết thúc (delivered, cancelled)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data mặc định
INSERT INTO order_statuses (code, name, name_en, color, sort_order, is_default, is_final) VALUES
('pending', 'Chờ xác nhận', 'Pending', '#f59e0b', 1, true, false),
('confirmed', 'Đã xác nhận', 'Confirmed', '#3b82f6', 2, false, false),
('preparing', 'Đang chuẩn bị', 'Preparing', '#8b5cf6', 3, false, false),
('delivering', 'Đang giao', 'Delivering', '#06b6d4', 4, false, false),
('delivered', 'Đã giao', 'Delivered', '#22c55e', 5, false, true),
('cancelled', 'Đã hủy', 'Cancelled', '#ef4444', 6, false, true);
```

**Lưu ý:**
- Bảng `pricing` cũ (7.2) được thay thế bằng `product_tier_prices` + `date_tier_assignments`
- Bảng `orders.status` sẽ reference đến `order_statuses.code`

---

## 8. Assets

### 8.1 Hình Ảnh Sản Phẩm

CDN URL: `https://cdn.efl.vn/banhTetImg/`

Có 23 hình ảnh sẵn có để sử dụng cho sản phẩm.

### 8.2 Database Connection

```
Supabase PostgreSQL: Đã cấu hình trong .env
```

---

## 9. UI/UX Design Direction

### 9.1 Style Keywords

- **Traditional Modern** - Kết hợp truyền thống Việt Nam với thiết kế hiện đại
- **Warm & Festive** - Màu sắc ấm áp, không khí Tết
- **Clean & Minimal** - Giao diện sạch sẽ, dễ sử dụng
- **Premium Feel** - Cảm giác sản phẩm chất lượng cao

### 9.2 Color Palette (Đề xuất)

| Màu            | Hex     | Ý nghĩa                        |
| --------------- | ------- | -------------------------------- |
| Đỏ Tết       | #C41E3A | Màu chủ đạo, may mắn        |
| Vàng Ánh Kim  | #FFD700 | Accent, thịnh vượng           |
| Xanh Lá Chuối | #2E5339 | Secondary, lá chuối gói bánh |
| Trắng Ngà     | #FFFEF5 | Background                       |
| Nâu Đất      | #5D4037 | Text, earth tone                 |

### 9.3 Typography (Đề xuất)

- **Heading**: Be Vietnam Pro / Quicksand (hiện đại, Việt hóa)
- **Body**: Inter / Nunito Sans (dễ đọc)

### 9.4 3D Elements

- Hero: Mô hình 3D bánh tét xoay
- Product hover: Hiệu ứng 3D nhẹ
- Loading: Animation 3D đơn giản

---

## 10. Yêu Cầu Bổ Sung (Confirmed)

| Yêu cầu               | Quyết định                                   |
| ----------------------- | ----------------------------------------------- |
| **Hiệu ứng 3D** | Toàn trang - Hero, hover products, transitions |
| **Ngôn ngữ**    | Việt + English (i18n)                          |
| **Thanh toán**   | Chỉ đặt hàng - COD (không payment gateway) |
| **Admin**         | Làm theo phase riêng                          |

---

## 11. Development Phases

### Phase 1: Foundation & Setup

**Mục tiêu:** Khởi tạo project và cấu hình cơ bản

| Task | Mô tả                                       |
| ---- | --------------------------------------------- |
| 1.1  | Khởi tạo Next.js 15 + React 19 + TypeScript |
| 1.2  | Cấu hình Tailwind CSS + shadcn/ui           |
| 1.3  | Setup Three.js + React Three Fiber            |
| 1.4  | Cấu hình i18n (next-intl) cho Việt/English |
| 1.5  | Setup Supabase client + environment           |
| 1.6  | Tạo database schema + seed data              |
| 1.7  | Cấu hình ESLint, Prettier                   |

**Deliverables:**

- Project chạy được ở localhost
- Database có sẵn products + pricing
- i18n hoạt động cơ bản

---

### Phase 2: Landing Page & 3D Hero

**Mục tiêu:** Trang chủ ấn tượng với 3D

| Task | Mô tả                                         |
| ---- | ----------------------------------------------- |
| 2.1  | Layout chung: Header, Footer, Navigation        |
| 2.2  | Hero section với 3D bánh tét xoay            |
| 2.3  | Section giới thiệu thương hiệu             |
| 2.4  | Section sản phẩm nổi bật (3D hover effects) |
| 2.5  | Section bảng giá theo ngày                   |
| 2.6  | Section testimonials/reviews                    |
| 2.7  | CTA đặt hàng nổi bật                       |
| 2.8  | Responsive cho mobile/tablet                    |

**Deliverables:**

- Landing page hoàn chỉnh
- Hiệu ứng 3D mượt mà
- Đa ngôn ngữ Việt/English

---

### Phase 3: Product Catalog & Cart

**Mục tiêu:** Xem sản phẩm và quản lý giỏ hàng

| Task | Mô tả                                 |
| ---- | --------------------------------------- |
| 3.1  | Trang danh sách sản phẩm (grid view) |
| 3.2  | Product card với 3D hover effect       |
| 3.3  | Trang chi tiết sản phẩm              |
| 3.4  | Logic tính giá theo ngày âm lịch   |
| 3.5  | Cart state management (Zustand)         |
| 3.6  | Cart drawer/modal UI                    |
| 3.7  | Thêm/xóa/cập nhật số lượng       |
| 3.8  | Tổng tiền tự động theo ngày nhận |

**Deliverables:**

- Catalog sản phẩm đầy đủ
- Giỏ hàng hoạt động
- Giá tự động theo lịch

---

### Phase 4: Checkout & Order

**Mục tiêu:** Hoàn tất đặt hàng

| Task | Mô tả                                         |
| ---- | ----------------------------------------------- |
| 4.1  | Form thông tin khách hàng                    |
| 4.2  | Chọn ngày nhận hàng (date picker âm lịch) |
| 4.3  | Validation form                                 |
| 4.4  | API route lưu order vào Supabase              |
| 4.5  | Trang xác nhận đơn hàng                    |
| 4.6  | Email/SMS notification (optional)               |

**Deliverables:**

- Flow đặt hàng hoàn chỉnh
- Đơn hàng lưu vào database
- Mã đơn hàng cho khách

---

### Phase 5: Polish & Optimization

**Mục tiêu:** Hoàn thiện trải nghiệm

| Task | Mô tả                                  |
| ---- | ---------------------------------------- |
| 5.1  | Animation polish (page transitions)      |
| 5.2  | Loading states & skeleton                |
| 5.3  | Error handling & fallbacks               |
| 5.4  | SEO optimization (meta, sitemap, schema) |
| 5.5  | Performance optimization (lazy load 3D)  |
| 5.6  | Accessibility audit                      |
| 5.7  | Cross-browser testing                    |
| 5.8  | Mobile optimization                      |

**Deliverables:**

- Lighthouse score > 90
- Responsive hoàn hảo
- SEO ready

---

### Phase 6: Deployment

**Mục tiêu:** Đưa lên production

| Task | Mô tả                    |
| ---- | -------------------------- |
| 6.1  | Setup Vercel project       |
| 6.2  | Environment variables      |
| 6.3  | Domain configuration       |
| 6.4  | SSL certificate            |
| 6.5  | Analytics setup (optional) |

**Deliverables:**

- Website live trên domain
- HTTPS hoạt động

---

### Phase 7: Admin Dashboard (Future)

**Mục tiêu:** Quản lý đơn hàng với Schedule Calendar + Cấu hình giá/ngày

| Task | Mô tả                                                     |
| ---- | ----------------------------------------------------------- |
| 7.1  | Auth với Supabase (login admin)                            |
| 7.2  | Dashboard overview (tổng đơn, doanh thu)                  |
| 7.3  | **Schedule Calendar Admin** (xem chi tiết bên dưới)      |
| 7.4  | **Cấu hình giai đoạn giá** (xem chi tiết bên dưới)      |
| 7.5  | Danh sách đơn hàng (table view)                          |
| 7.6  | Chi tiết đơn hàng + cập nhật trạng thái               |
| 7.7  | Thống kê doanh thu theo ngày/tuần/tháng                 |
| 7.8  | **Quản lý sản phẩm** (CRUD products)                     |
| 7.9  | **Cài đặt website** (Site Settings)                       |
| 7.10 | **Quản lý trạng thái đơn** (Order Statuses)              |

---

#### Flow Hoạt Động Tổng Thể - Admin

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ADMIN WORKFLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║  BƯỚC 1: SETUP BAN ĐẦU (Chỉ làm 1 lần đầu hoặc khi cần thay đổi)        ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────┐
    │  1.1 LOGIN ADMIN │
    │  (Supabase Auth) │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  1.2 CÀI ĐẶT WEBSITE (Site Settings)                            │
    │  ┌────────────────────────────────────────────────────────────┐ │
    │  │ • Hotline: 0374027409                                      │ │
    │  │ • Email liên hệ                                            │ │
    │  │ • Địa chỉ, Facebook, Zalo                                  │ │
    │  │ • Tên thương hiệu + Slogan (VI/EN)                         │ │
    │  └────────────────────────────────────────────────────────────┘ │
    │  → Frontend tự động hiển thị thông tin này                      │
    └──────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  1.3 TẠO GIAI ĐOẠN GIÁ (Price Tiers)                            │
    │  ┌────────────────────────────────────────────────────────────┐ │
    │  │ 🟢 Giá thấp      │ Màu: #22c55e │ Sort: 1                  │ │
    │  │ 🟡 Giá trung bình │ Màu: #eab308 │ Sort: 2                  │ │
    │  │ 🔴 Giá cao       │ Màu: #ef4444 │ Sort: 3                  │ │
    │  └────────────────────────────────────────────────────────────┘ │
    │  → Có thể thêm/sửa/xóa tier bất kỳ lúc nào                      │
    └──────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  1.4 QUẢN LÝ SẢN PHẨM (Products)                                │
    │  ┌────────────────────────────────────────────────────────────┐ │
    │  │ + Thêm sản phẩm: Tên, mô tả, ảnh, cân nặng, category      │ │
    │  │ + Set giá cho TỪNG TIER:                                   │ │
    │  │   • Bánh Tét Thập Cẩm:                                     │ │
    │  │     - Giá thấp: 260k                                       │ │
    │  │     - Giá TB: 280k                                         │ │
    │  │     - Giá cao: 290k                                        │ │
    │  │ + Enable/Disable sản phẩm                                  │ │
    │  └────────────────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  1.5 TẠO TRẠNG THÁI ĐƠN HÀNG (Order Statuses)                   │
    │  ┌────────────────────────────────────────────────────────────┐ │
    │  │ 🟡 Chờ xác nhận  │ pending    │ [Mặc định]                 │ │
    │  │ 🔵 Đã xác nhận   │ confirmed  │                            │ │
    │  │ 🟣 Đang chuẩn bị │ preparing  │                            │ │
    │  │ 🔵 Đang giao     │ delivering │                            │ │
    │  │ 🟢 Đã giao       │ delivered  │ [Kết thúc]                 │ │
    │  │ 🔴 Đã hủy        │ cancelled  │ [Kết thúc]                 │ │
    │  └────────────────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║  BƯỚC 2: CẤU HÌNH MÙA BÁN (Làm mỗi năm/mùa Tết)                         ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────────────────────────────────────────────────────┐
    │  2.1 GÁN NGÀY VÀO TIER (Calendar Config)                        │
    │                                                                  │
    │  ┌─────────────────────────────────────────────────────────────┐│
    │  │            Tháng 2/2026                                     ││
    │  │  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐               ││
    │  │  │  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │               ││
    │  │  │ 18â │ 19â │ 20â │ 21â │ 22â │ 23â │ 24â │               ││
    │  │  │ 🟢  │ 🟢  │ 🟡  │ 🟡  │ 🟡  │ 🔴  │ 🔴  │               ││
    │  │  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘               ││
    │  │                                                             ││
    │  │  Click ngày → Chọn tier + Enable/Disable                   ││
    │  └─────────────────────────────────────────────────────────────┘│
    │                                                                  │
    │  Actions:                                                        │
    │  • Click từng ngày → Popup chọn tier                            │
    │  • Bulk select nhiều ngày → Gán cùng tier                       │
    │  • Disable ngày cụ thể + ghi chú ("Sold out", "Nghỉ")          │
    └──────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  → CUSTOMER THẤY:                                                │
    │  ┌─────────────────────────────────────────────────────────────┐│
    │  │  Schedule Calendar với màu sắc theo tier                    ││
    │  │  Click ngày → Xem giá sản phẩm của ngày đó                  ││
    │  │  Ngày disabled → Không cho đặt + hiện ghi chú               ││
    │  └─────────────────────────────────────────────────────────────┘│
    └──────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║  BƯỚC 3: QUẢN LÝ ĐƠN HÀNG (Làm hàng ngày khi có đơn)                    ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────────────────────────────────────────────────────┐
    │  3.1 XEM DASHBOARD TỔNG QUAN                                     │
    │  ┌────────────────────────────────────────────────────────────┐ │
    │  │  📊 Tổng đơn hôm nay: 15    │  💰 Doanh thu: 4,500,000đ   │ │
    │  │  📦 Chờ xác nhận: 5         │  🚚 Đang giao: 3            │ │
    │  └────────────────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  3.2 XEM SCHEDULE CALENDAR (Tổng hợp theo ngày)                  │
    │                                                                  │
    │  ┌─────────────────────────────────────────────────────────────┐│
    │  │  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐               ││
    │  │  │  5  │  6  │  7  │  8  │  9  │ 10  │ 11  │               ││
    │  │  │ 18â │ 19â │ 20â │ 21â │ 22â │ 23â │ 24â │               ││
    │  │  │15bánh│20bánh│25bánh│30bánh│45bánh│60bánh│55bánh│         ││
    │  │  │[===]│[====]│[====]│[====]│[====]│[====]│[====]│         ││
    │  │  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘               ││
    │  └─────────────────────────────────────────────────────────────┘│
    │                                                                  │
    │  Click vào ngày → Popup chi tiết:                               │
    │  ┌─────────────────────────────────────────────────────────────┐│
    │  │  📅 Ngày 10/02/2026 (23 tháng Chạp)                        ││
    │  │  ────────────────────────────────────────                   ││
    │  │  📦 Tổng đơn: 12 đơn                                        ││
    │  │  🎂 Tổng bánh: 60 cái                                       ││
    │  │     • Tét Thập Cẩm: 25 cái                                  ││
    │  │     • Tét 3 màu: 15 cái                                     ││
    │  │     • Tét Thịt trứng: 20 cái                                ││
    │  │  💰 Tổng doanh thu: 12,500,000đ                             ││
    │  │  ────────────────────────────────────────                   ││
    │  │  Danh sách đơn:                                             ││
    │  │  #BT001 - Nguyễn Văn A - 0901xxx - 3 bánh - 870k           ││
    │  │  #BT002 - Trần Thị B - 0902xxx - 5 bánh - 1,450k           ││
    │  │  ...                                                        ││
    │  └─────────────────────────────────────────────────────────────┘│
    └──────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  3.3 QUẢN LÝ ĐƠN HÀNG (Table View)                              │
    │                                                                  │
    │  ┌─────────────────────────────────────────────────────────────┐│
    │  │ [Search: ________] [Filter: Trạng thái ▼] [Ngày giao ▼]    ││
    │  │ ───────────────────────────────────────────────────────────││
    │  │ #BT001 │ Nguyễn Văn A │ 10/02 │ 870k   │ 🟡 Chờ xác nhận  ││
    │  │ #BT002 │ Trần Thị B   │ 10/02 │ 1,450k │ 🔵 Đã xác nhận   ││
    │  │ #BT003 │ Lê Văn C     │ 11/02 │ 520k   │ 🟣 Đang chuẩn bị ││
    │  └─────────────────────────────────────────────────────────────┘│
    └──────────────────────────────────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────────────────────────────────┐
    │  3.4 XỬ LÝ ĐƠN HÀNG (Chi tiết + Cập nhật)                       │
    │                                                                  │
    │  Click vào đơn → Chi tiết:                                       │
    │  ┌─────────────────────────────────────────────────────────────┐│
    │  │  📋 ĐƠN HÀNG #BT001                                         ││
    │  │  ────────────────────────────────────────                   ││
    │  │  👤 Khách hàng: Nguyễn Văn A                                ││
    │  │  📞 SĐT: 0901234567                                         ││
    │  │  📧 Email: nguyenvana@email.com                             ││
    │  │  📍 Địa chỉ: 123 Nguyễn Huệ, Q1, HCM                        ││
    │  │  📅 Ngày giao: 10/02/2026 (23 tháng Chạp)                   ││
    │  │  📝 Ghi chú: Giao trước 10h sáng                            ││
    │  │  ────────────────────────────────────────                   ││
    │  │  🛒 Chi tiết đơn:                                           ││
    │  │     • Tét Thập Cẩm (1.7kg) x 2 = 580k                       ││
    │  │     • Tét 3 màu (1.2kg) x 1 = 160k                          ││
    │  │     • Tét Chuối (800g) x 1 = 100k                           ││
    │  │  ────────────────────────────────────────                   ││
    │  │  💰 TỔNG: 870,000đ                                          ││
    │  │  ────────────────────────────────────────                   ││
    │  │  Trạng thái: [🟡 Chờ xác nhận ▼]                            ││
    │  │              ├─ 🔵 Đã xác nhận                              ││
    │  │              ├─ 🟣 Đang chuẩn bị                            ││
    │  │              ├─ 🔵 Đang giao                                ││
    │  │              ├─ 🟢 Đã giao                                  ││
    │  │              └─ 🔴 Đã hủy                                   ││
    │  │                                                             ││
    │  │  [Lưu thay đổi]                                             ││
    │  └─────────────────────────────────────────────────────────────┘│
    └──────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║  BƯỚC 4: XEM THỐNG KÊ (Khi cần báo cáo)                                 ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────────────────────────────────────────────────────┐
    │  4.1 THỐNG KÊ DOANH THU                                          │
    │                                                                  │
    │  ┌─────────────────────────────────────────────────────────────┐│
    │  │  [Theo ngày ▼] [Từ: 05/02] [Đến: 16/02]                    ││
    │  │  ───────────────────────────────────────────────────────── ││
    │  │  📊 Biểu đồ doanh thu theo ngày                            ││
    │  │  ───────────────────────────────────────────────────────── ││
    │  │  📈 Tổng doanh thu: 125,000,000đ                           ││
    │  │  📦 Tổng đơn hàng: 156 đơn                                 ││
    │  │  🎂 Tổng bánh: 520 cái                                     ││
    │  │  ───────────────────────────────────────────────────────── ││
    │  │  Top sản phẩm:                                             ││
    │  │  1. Tét Thập Cẩm: 180 cái (34.6%)                         ││
    │  │  2. Tét Thịt trứng Lớn: 120 cái (23.1%)                   ││
    │  │  3. Tét 3 màu: 100 cái (19.2%)                            ││
    │  └─────────────────────────────────────────────────────────────┘│
    └──────────────────────────────────────────────────────────────────┘
```

---

**Tóm tắt quyền Admin:**

| Chức năng | Mô tả | Tần suất |
|-----------|-------|----------|
| Site Settings | Hotline, email, brand... | Setup 1 lần |
| Price Tiers | Tạo giai đoạn giá + màu | Setup 1 lần, sửa khi cần |
| Products | CRUD sản phẩm + giá | Setup 1 lần, sửa khi cần |
| Order Statuses | Tạo trạng thái đơn | Setup 1 lần |
| Date Config | Gán ngày vào tier | Mỗi mùa Tết |
| Orders | Xem + cập nhật trạng thái | Hàng ngày |
| Statistics | Xem báo cáo doanh thu | Khi cần |

---

#### 7.3 Schedule Calendar Admin - Chi tiết

```
┌─────────────────────────────────────────────────────────┐
│                    Tháng 2/2026                         │
├───────┬───────┬───────┬───────┬───────┬───────┬───────┤
│  T2   │  T3   │  T4   │  T5   │  T6   │  T7   │  CN   │
├───────┼───────┼───────┼───────┼───────┼───────┼───────┤
│   5   │   6   │   7   │   8   │   9   │  10   │  11   │
│  18â  │  19â  │  20â  │  21â  │  22â  │  23â  │  24â  │
│ 15bánh│ 20bánh│ 25bánh│ 30bánh│ 45bánh│ 60bánh│ 55bánh│
│ [===] │ [====]│ [====]│ [====]│ [====]│ [====]│ [====]│
└───────┴───────┴───────┴───────┴───────┴───────┴───────┘
```

- [ ] Mỗi ô ngày hiển thị:
  - Ngày dương lịch (lớn)
  - Ngày âm lịch (nhỏ)
  - Tổng số bánh đặt trong ngày
  - Progress bar hoặc badge số lượng
  - **Màu nền theo giai đoạn giá (từ cấu hình admin)**
- [ ] Click vào ngày → **Popup chi tiết đơn hàng của ngày đó**
- [ ] Popup hiển thị:
  - Danh sách orders của ngày
  - Tổng số lượng từng loại bánh
  - Tổng doanh thu ngày
  - Nút xem chi tiết từng đơn

---

#### 7.4 Cấu Hình Giai Đoạn Giá (Price Tiers) - Admin

**Mô tả:** Admin có thể tạo/sửa/xóa các giai đoạn giá và gán ngày cho từng giai đoạn.

**Database Schema bổ sung:**

```sql
-- Bảng giai đoạn giá
CREATE TABLE price_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,           -- "Giá thấp", "Giá trung bình", "Giá cao"
    name_en VARCHAR(50),                 -- "Low price", "Medium price", "High price"
    color VARCHAR(20) NOT NULL,          -- "#22c55e" (green), "#eab308" (yellow), "#ef4444" (red)
    sort_order INTEGER DEFAULT 0,        -- Thứ tự hiển thị
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng giá theo tier và sản phẩm
CREATE TABLE product_tier_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    tier_id UUID REFERENCES price_tiers(id),
    price_vnd INTEGER NOT NULL,
    UNIQUE(product_id, tier_id)
);

-- Bảng gán ngày cho tier
CREATE TABLE date_tier_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,           -- Ngày dương lịch
    tier_id UUID REFERENCES price_tiers(id),
    is_available BOOLEAN DEFAULT true,   -- Có thể đặt hàng không
    note VARCHAR(200),                   -- "Sold out", "Nghỉ lễ", etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**UI Admin - Quản lý Price Tiers:**

```
┌─────────────────────────────────────────────────────────┐
│  Quản lý Giai Đoạn Giá                    [+ Thêm mới] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟢 Giá thấp                          [Sửa] [Xóa]│   │
│  │    Màu: #22c55e    Ngày: 05/02 - 06/02          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟡 Giá trung bình                    [Sửa] [Xóa]│   │
│  │    Màu: #eab308    Ngày: 07/02 - 09/02          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔴 Giá cao                           [Sửa] [Xóa]│   │
│  │    Màu: #ef4444    Ngày: 10/02 - 16/02          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**UI Admin - Gán Ngày vào Tier:**

```
┌─────────────────────────────────────────────────────────┐
│  Cấu hình ngày - Tháng 2/2026                          │
├───────┬───────┬───────┬───────┬───────┬───────┬───────┤
│  T2   │  T3   │  T4   │  T5   │  T6   │  T7   │  CN   │
├───────┼───────┼───────┼───────┼───────┼───────┼───────┤
│   5   │   6   │   7   │   8   │   9   │  10   │  11   │
│  🟢   │  🟢   │  🟡   │  🟡   │  🟡   │  🔴   │  🔴   │
│[Click]│[Click]│[Click]│[Click]│[Click]│[Click]│[Click]│
└───────┴───────┴───────┴───────┴───────┴───────┴───────┘

Click vào ngày → Popup:
┌─────────────────────────────┐
│  Ngày 05/02/2026 (18 Chạp) │
├─────────────────────────────┤
│  Chọn giai đoạn giá:       │
│  ○ Giá thấp      🟢        │
│  ○ Giá trung bình 🟡        │
│  ○ Giá cao       🔴        │
├─────────────────────────────┤
│  ☑ Cho phép đặt hàng       │
│  □ Tạm ngưng (ghi chú):    │
│    [________________]       │
├─────────────────────────────┤
│  [Hủy]           [Lưu]     │
└─────────────────────────────┘
```

**Tính năng Admin:**

- [ ] CRUD Price Tiers (tạo/sửa/xóa giai đoạn giá)
- [ ] Cấu hình màu sắc cho mỗi tier (color picker)
- [ ] Set giá sản phẩm theo từng tier
- [ ] Gán ngày vào tier (click calendar hoặc bulk assign)
- [ ] Enable/Disable ngày cụ thể (tạm ngưng nhận đơn)
- [ ] Thêm ghi chú cho ngày ("Sold out", "Nghỉ Tết", etc.)
- [ ] Bulk actions: chọn nhiều ngày → gán cùng tier

**Flow cấu hình:**

```
[Admin tạo Price Tiers] → [Set giá cho từng sản phẩm theo tier]
→ [Gán ngày vào tier trên calendar] → [Customer thấy màu + giá tương ứng]
```

---

---

#### 7.8 Quản Lý Sản Phẩm (Products) - Admin

**Tính năng:**
- [ ] Danh sách sản phẩm (table với search, filter)
- [ ] Thêm sản phẩm mới
- [ ] Sửa thông tin sản phẩm (tên, mô tả, ảnh, cân nặng)
- [ ] Set giá cho từng tier
- [ ] Enable/Disable sản phẩm
- [ ] Sắp xếp thứ tự hiển thị

---

#### 7.9 Cài Đặt Website (Site Settings) - Admin

```
┌─────────────────────────────────────────────────────────┐
│  Cài Đặt Website                              [Lưu]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Thông tin liên hệ                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Hotline:     [0374027409___________]            │   │
│  │ Email:       [_______________________]          │   │
│  │ Địa chỉ:    [_______________________]          │   │
│  │ Facebook:    [_______________________]          │   │
│  │ Zalo:        [_______________________]          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Thương hiệu                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Tên (VI):    [Bánh Tét Tết___________]          │   │
│  │ Tên (EN):    [Tet Cake________________]          │   │
│  │ Slogan (VI): [Hương vị Tết truyền thống]        │   │
│  │ Slogan (EN): [Traditional Tet Flavor__]          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Tính năng:**
- [ ] Sửa thông tin liên hệ (hotline, email, address, socials)
- [ ] Sửa tên thương hiệu + slogan (VI/EN)
- [ ] Tất cả settings lấy từ database → hiển thị động trên frontend

---

#### 7.10 Quản Lý Trạng Thái Đơn (Order Statuses) - Admin

```
┌─────────────────────────────────────────────────────────┐
│  Quản lý Trạng Thái Đơn Hàng              [+ Thêm mới] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟡 Chờ xác nhận (pending)       [Mặc định]     │   │
│  │    Màu: #f59e0b                   [Sửa] [Xóa]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔵 Đã xác nhận (confirmed)                      │   │
│  │    Màu: #3b82f6                   [Sửa] [Xóa]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟢 Đã giao (delivered)          [Kết thúc]     │   │
│  │    Màu: #22c55e                   [Sửa] [Xóa]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔴 Đã hủy (cancelled)           [Kết thúc]     │   │
│  │    Màu: #ef4444                   [Sửa] [Xóa]  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Tính năng:**
- [ ] CRUD trạng thái đơn hàng
- [ ] Cấu hình màu badge cho mỗi status
- [ ] Đánh dấu status mặc định (khi tạo đơn mới)
- [ ] Đánh dấu status kết thúc (delivered, cancelled)
- [ ] Sắp xếp thứ tự hiển thị
- [ ] Hỗ trợ đa ngôn ngữ (VI/EN)

---

**Deliverables Phase 7:**

- Admin panel hoàn chỉnh
- Schedule Calendar với tổng số bánh/ngày
- Popup chi tiết đơn hàng theo ngày
- **Quản lý Price Tiers (CRUD)**
- **Gán ngày vào tier (calendar UI)**
- **Enable/Disable ngày + ghi chú**
- **Quản lý sản phẩm (CRUD)**
- **Cài đặt website (Site Settings)**
- **Quản lý trạng thái đơn (Order Statuses)**
- Quản lý orders real-time

---

## 12. Research - Packages & Libraries

### 12.1 Calendar Components

| Package | Mô tả | Phù hợp cho |
| ------- | ----- | ----------- |
| **[@fullcalendar/react](https://fullcalendar.io/)** | Full-featured calendar, drag-drop, nhiều view | Admin Schedule |
| **[react-big-calendar](https://www.npmjs.com/package/react-big-calendar)** | Google Calendar-like, event management | Admin Schedule |
| **[react-day-picker](https://react-day-picker.js.org/)** | Lightweight, customizable date picker | Checkout date picker |
| **[Schedule-X](https://schedule-x.dev/)** | Material design, modern, responsive | Cả 2 |

**Recommendation:** `react-day-picker` cho customer + `@fullcalendar/react` cho admin

### 12.2 Vietnamese Lunar Calendar

| Package | Mô tả |
| ------- | ----- |
| **[@dqcai/vn-lunar](https://www.npmjs.com/package/@dqcai/vn-lunar)** | TypeScript, accurate 1200-2199, Can Chi |
| **[vietnamese-lunar-calendar](https://www.npmjs.com/package/vietnamese-lunar-calendar)** | Simple, based on Hồ Ngọc Đức |
| **[lunar-calendar-ts-vi](https://www.npmjs.com/package/lunar-calendar-ts-vi)** | TypeScript, Vietnamese specific |

**Recommendation:** `@dqcai/vn-lunar` - TypeScript support, comprehensive features

### 12.3 State Management & Persistence

| Package | Mô tả |
| ------- | ----- |
| **[zustand](https://zustand.docs.pmnd.rs/)** | Lightweight state management |
| **[zustand/middleware/persist](https://zustand.docs.pmnd.rs/middlewares/persist)** | Built-in localStorage persistence |

**Cart Store Example:**
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      deliveryDate: null,
      addItem: (item) => set({ items: [...get().items, item] }),
      // ...
    }),
    { name: 'banhtet-cart' }
  )
)
```

### 12.4 Email Notification

| Package | Mô tả |
| ------- | ----- |
| **[Resend](https://resend.com/)** | Modern email API, React Email support |
| **[@react-email/components](https://react.email/)** | Build emails with React |
| **Supabase Edge Functions** | Serverless functions for email triggers |

### 12.5 Form & Validation

| Package | Mô tả |
| ------- | ----- |
| **[react-hook-form](https://react-hook-form.com/)** | Performance-focused forms |
| **[zod](https://zod.dev/)** | TypeScript-first schema validation |
| **[@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers)** | Zod + react-hook-form integration |

### 12.6 Internationalization (i18n)

| Package | Mô tả |
| ------- | ----- |
| **[next-intl](https://next-intl-docs.vercel.app/)** | Next.js App Router i18n |

### 12.7 Complete Tech Stack Summary

```
Frontend:
├── next@15           # Framework
├── react@19          # UI Library
├── typescript@5      # Type safety
├── tailwindcss@4     # Styling
├── framer-motion     # Animations
├── @react-three/fiber + drei  # 3D Graphics
├── shadcn/ui         # UI Components
├── lucide-react      # Icons
├── zustand + persist # State + localStorage
├── react-hook-form + zod  # Forms
├── next-intl         # i18n
├── react-day-picker  # Date selection
├── @dqcai/vn-lunar   # Lunar calendar
└── @fullcalendar/react  # Admin calendar

Backend:
├── supabase          # Database + Auth
├── next.js api routes # API endpoints
└── resend            # Email (optional)
```

---

## 13. Tổng Kết - Dynamic vs Static

### 13.1 Những gì Admin quản lý động (không hardcode)

| Dữ liệu | Bảng DB | Admin UI |
|---------|---------|----------|
| Sản phẩm | `products` | CRUD sản phẩm |
| Giai đoạn giá | `price_tiers` | Tạo/sửa tier + màu sắc |
| Giá sản phẩm theo tier | `product_tier_prices` | Set giá cho từng tier |
| Gán ngày vào tier | `date_tier_assignments` | Calendar config |
| Enable/Disable ngày | `date_tier_assignments.is_available` | Calendar config |
| Trạng thái đơn hàng | `order_statuses` | CRUD statuses |
| Thông tin liên hệ | `site_settings` | Settings page |
| Tên thương hiệu/Slogan | `site_settings` | Settings page |

### 13.2 Seed Data & Auto-Initialization

**Mô tả:** Khi database mới (chưa có data), hệ thống tự động tạo seed data cơ bản để Admin không phải setup từ đầu.

#### Environment Config

```env
# Seed Data Configuration
SEED_DATA_ON_EMPTY=true          # Tự động seed khi DB trống (true/false)
SEED_PRODUCTS=true               # Seed sản phẩm mẫu
SEED_PRICE_TIERS=true            # Seed giai đoạn giá mẫu
SEED_ORDER_STATUSES=true         # Seed trạng thái đơn hàng
SEED_SITE_SETTINGS=true          # Seed cài đặt website
SEED_DATE_ASSIGNMENTS=false      # Seed gán ngày (thường để false, admin tự config)
```

#### Seed Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    APP STARTUP                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │ Check SEED_DATA_ON_ │
                   │ EMPTY = true?       │
                   └──────────┬──────────┘
                              │
              ┌───────────────┴───────────────┐
              │ YES                           │ NO
              ▼                               ▼
   ┌──────────────────────┐        ┌──────────────────┐
   │ Check each table     │        │ Skip seeding     │
   │ is empty?            │        │ (use existing)   │
   └──────────┬───────────┘        └──────────────────┘
              │
              ▼
   ┌──────────────────────────────────────────────────┐
   │  For each SEED_* = true AND table is empty:     │
   │  ┌────────────────────────────────────────────┐ │
   │  │ 1. order_statuses → 6 status mặc định     │ │
   │  │ 2. site_settings → Hotline, brand info    │ │
   │  │ 3. price_tiers → 3 tier (thấp, TB, cao)   │ │
   │  │ 4. products → 8 sản phẩm mẫu             │ │
   │  │ 5. product_tier_prices → Giá cho mỗi tier │ │
   │  │ 6. date_assignments → (nếu enabled)       │ │
   │  └────────────────────────────────────────────┘ │
   └──────────────────────────────────────────────────┘
              │
              ▼
   ┌──────────────────────────────────────────────────┐
   │  ✅ Admin có thể sử dụng ngay hoặc sửa đổi     │
   └──────────────────────────────────────────────────┘
```

#### Seed Data Contents

| Bảng | Seed Data | Điều kiện |
|------|-----------|-----------|
| `order_statuses` | 6 status: pending, confirmed, preparing, delivering, delivered, cancelled | `SEED_ORDER_STATUSES=true` AND table empty |
| `site_settings` | Hotline, brand name, slogan (VI/EN) | `SEED_SITE_SETTINGS=true` AND table empty |
| `price_tiers` | 3 tiers: Giá thấp (🟢), Giá TB (🟡), Giá cao (🔴) | `SEED_PRICE_TIERS=true` AND table empty |
| `products` | 8 sản phẩm bánh tét/ú từ requirement | `SEED_PRODUCTS=true` AND table empty |
| `product_tier_prices` | Giá cho 8 SP x 3 tiers = 24 records | Sau khi seed products + price_tiers |
| `date_tier_assignments` | (Optional) Gán ngày mẫu cho Tết 2026 | `SEED_DATE_ASSIGNMENTS=true` AND table empty |

#### Logic Check Empty

```typescript
// lib/seed.ts
async function shouldSeed(tableName: string): Promise<boolean> {
  const envKey = `SEED_${tableName.toUpperCase()}`
  const isEnabled = process.env[envKey] === 'true'

  if (!isEnabled) return false

  const { count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })

  return count === 0 // Only seed if table is empty
}

// Gọi khi app startup (middleware hoặc API route)
async function initSeedData() {
  if (process.env.SEED_DATA_ON_EMPTY !== 'true') return

  // Seed theo thứ tự dependency
  if (await shouldSeed('order_statuses')) await seedOrderStatuses()
  if (await shouldSeed('site_settings')) await seedSiteSettings()
  if (await shouldSeed('price_tiers')) await seedPriceTiers()
  if (await shouldSeed('products')) await seedProducts()
  // product_tier_prices depends on products + price_tiers
  if (await shouldSeed('product_tier_prices')) await seedProductTierPrices()
  if (await shouldSeed('date_tier_assignments')) await seedDateAssignments()
}
```

#### Khi nào KHÔNG seed

- `SEED_DATA_ON_EMPTY=false` → Không seed gì cả
- Table đã có data → Không overwrite
- Production với data thật → Set `SEED_DATA_ON_EMPTY=false`

#### Recommended Settings

| Environment | SEED_DATA_ON_EMPTY | Các SEED_* khác |
|-------------|-------------------|-----------------|
| **Development** | `true` | Tất cả `true` |
| **Staging** | `true` | Tất cả `true` trừ `SEED_DATE_ASSIGNMENTS` |
| **Production** | `false` | Tất cả `false` (hoặc không set) |

---

### 13.3 Ghi Chú Kỹ Thuật

1. **Lunar Date Calculation**: Sử dụng `@dqcai/vn-lunar` để convert dương → âm lịch
2. **Real-time Price**: Giá tự động theo ngày nhận hàng được chọn
3. **Order Notification**: Email qua Resend (nếu khách cung cấp email)
4. **Cart Persistence**: Zustand persist middleware với localStorage
5. **Schedule Calendar**: Customer chọn ngày → Admin xem tổng hợp
6. **Site Settings**: Frontend lấy settings từ API, không hardcode
7. **Auto Seed**: Database tự tạo data mẫu khi trống (configurable via env)

---

*Document created: 2026-01-26*
*Last updated: 2026-01-26*
