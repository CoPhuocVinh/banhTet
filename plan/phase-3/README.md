# Phase 3: Product Catalog & Cart

## Mục tiêu
Xây dựng trang danh sách sản phẩm đầy đủ và hệ thống giỏ hàng với tính năng persist qua localStorage.

## Trạng thái: `[x]` Completed

## Dependencies: Phase 2 hoàn thành

---

## Tasks

### Task 3.1: Trang danh sách sản phẩm (Grid view)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/products`
- [x] Fetch tất cả products có is_available = true
- [x] Grid layout responsive (1/2/3/4 columns)
- [x] Filter theo category (tét/ú) - optional → Implemented search filter
- [x] Sort theo giá/tên - optional
- [x] SEO meta tags cho trang products

#### Files Created:
- `src/app/[locale]/products/page.tsx`
- `src/app/[locale]/products/ProductsPageClient.tsx`

---

### Task 3.2: Product card với 3D hover effect
**Status:** `[x]` Completed

#### To-Do:
- [x] Nâng cấp ProductCard component từ Phase 2
- [x] 3D tilt effect khi hover (perspective transform)
- [x] Glow effect theo màu theme
- [x] Image hover zoom
- [x] Quick add to cart button
- [x] Badge cho sản phẩm vegetarian
- [x] Animation khi mount

#### Files Created:
- `src/components/features/ProductCard.tsx`
- `src/components/features/index.ts`

---

### Task 3.3: Trang chi tiết sản phẩm
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/products/[slug]`
- [x] Fetch product by slug
- [x] Layout:
  - Hình ảnh lớn (có thể có gallery)
  - Tên, mô tả chi tiết
  - Trọng lượng
  - Bảng giá theo tất cả tiers
  - Badge category, vegetarian
- [x] Add to cart với quantity selector
- [x] Related products section
- [x] SEO: meta, structured data

#### Files Created:
- `src/app/[locale]/products/[slug]/page.tsx`
- `src/app/[locale]/products/[slug]/ProductDetailClient.tsx`

---

### Task 3.4: Logic tính giá theo ngày âm lịch
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo utility function `getPriceForDate(productId, date)`
- [x] Logic:
  1. Nhận ngày dương lịch
  2. Lookup date_tier_assignments để tìm tier_id
  3. Lookup product_tier_prices để tìm giá
  4. Return giá hoặc null nếu ngày không available
- [x] Tích hợp `@dqcai/vn-lunar` để hiển thị âm lịch → Dùng trong ScheduleCalendar (Phase 2)
- [x] Handle edge cases: ngày không có tier, product không có giá

#### Files Created:
- `src/lib/pricing.ts`

---

### Task 3.5: Cart state management (Zustand)
**Status:** `[x]` Completed

#### To-Do:
- [x] Install `zustand`
- [x] Tạo cart store với state:
  - items: CartItem[]
  - deliveryDate: string | null
  - deliveryTierId: string | null
  - Actions: addItem, removeItem, updateQuantity, setDeliveryDate, clearCart
  - Selectors: getItemCount, getItem
- [x] Setup persist middleware với localStorage
- [x] Key: `banhtet-cart`
- [x] Test persist qua page refresh

#### Files Created:
- `src/lib/stores/cart-store.ts`

---

### Task 3.6: Cart drawer/modal UI
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo CartDrawer component (slide từ phải)
- [x] Trigger từ Header cart icon
- [x] Hiển thị:
  - Danh sách items với thumbnail
  - Quantity controls (+/-)
  - Xóa item button
  - Subtotal mỗi item
  - Total
- [x] Empty state khi cart trống
- [x] Animation open/close

#### Files Created:
- `src/components/features/CartDrawer.tsx`
- `src/components/ui/sheet.tsx`

---

### Task 3.7: Thêm/xóa/cập nhật số lượng
**Status:** `[x]` Completed

#### To-Do:
- [x] Add to cart flow:
  - Click button → toast notification
  - Update cart icon badge
- [x] Quantity selector component
  - Min: 1
  - Max: 99 hoặc configurable
- [x] Quantity controls in cart drawer

#### Notes:
- Toast notifications sử dụng Sonner
- Cart badge hiển thị số lượng realtime

---

### Task 3.8: Tổng tiền tự động theo ngày nhận
**Status:** `[x]` Completed

#### To-Do:
- [x] Pricing calculation based on tier
- [x] Show minimum price with "from" indicator
- [x] Price breakdown note in cart

#### Notes:
- Giá hiển thị là giá thấp nhất (minPrice)
- Giá cuối cùng sẽ được tính trong checkout page dựa trên ngày nhận hàng

---

## Deliverables Checklist

- [x] Catalog sản phẩm đầy đủ với grid view
- [x] Product detail page hoàn chỉnh
- [x] Giỏ hàng hoạt động (add/remove/update)
- [x] Cart persist qua localStorage
- [x] Giá tự động theo lịch nhận hàng
- [x] 3D hover effects mượt

---

## Files Created/Modified

```
src/app/[locale]/
├── products/
│   ├── page.tsx                    # Product listing (server)
│   ├── ProductsPageClient.tsx      # Product listing (client)
│   └── [slug]/
│       ├── page.tsx                # Product detail (server)
│       └── ProductDetailClient.tsx # Product detail (client)

src/components/
├── features/
│   ├── index.ts                    # Feature exports
│   ├── ProductCard.tsx             # Enhanced with 3D effects
│   └── CartDrawer.tsx              # Cart slide drawer
├── ui/
│   └── sheet.tsx                   # Sheet component for drawer
└── layout/
    └── Header.tsx                  # Updated with CartDrawer

src/lib/
├── stores/
│   └── cart-store.ts               # Zustand cart store
└── pricing.ts                      # Price calculation logic
```

---

*Last Updated: 2026-01-27*
