# Phase 4: Checkout & Order

## Mục tiêu
Hoàn thiện flow đặt hàng từ giỏ hàng đến xác nhận đơn hàng.

## Trạng thái: `[x]` Completed

## Dependencies: Phase 3 hoàn thành

---

## Tasks

### Task 4.1: Form thông tin khách hàng
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/checkout`
- [x] Install `react-hook-form` và `zod`
- [x] Tạo form schema với validation:
  ```typescript
  const checkoutSchema = z.object({
    customerName: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
    customerPhone: z.string().min(1, "Vui lòng nhập SĐT"),
    customerEmail: z.string().email().optional().or(z.literal("")),
    deliveryAddress: z.string().min(10, "Địa chỉ quá ngắn"),
    notes: z.string().optional(),
  })
  ```
- [x] Form layout với labels và error messages
- [x] Auto-focus first field
- [ ] Persistent draft (save to localStorage) - optional (skipped)

#### Files Created:
- `src/app/[locale]/checkout/page.tsx`
- `src/app/[locale]/checkout/CheckoutPageClient.tsx`
- `src/lib/validations/checkout.ts`

---

### Task 4.2: Chọn ngày nhận hàng (Date picker âm lịch)
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo date picker cho checkout với react-day-picker
- [x] Hiển thị calendar với ngày dương lịch
- [x] Pre-select ngày từ cart (nếu đã chọn)
- [x] Hiển thị rõ:
  - "Ngày nhận: DD/MM/YYYY"
  - "Ngày âm lịch" display
- [x] Disable ngày quá khứ
- [x] Update giá khi đổi ngày

#### Files Created:
- `src/components/ui/calendar.tsx`
- `src/components/ui/popover.tsx`

---

### Task 4.3: Validation form
**Status:** `[x]` Completed

#### To-Do:
- [x] Real-time validation khi blur/change
- [x] Phone number: required (không validate format)
- [x] Email format (nếu có)
- [x] Address minimum length
- [x] Required fields highlight
- [x] Error messages hiển thị
- [x] Disable submit button khi invalid hoặc cart rỗng

---

### Task 4.4: API route lưu order vào Supabase
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo API route `POST /api/orders`
- [x] Generate order code: `BT-YYMMDD-XXXX` (random 4 chars)
- [x] Request body validation với zod (orderApiSchema)
- [x] Transaction:
  1. Insert vào `orders` table
  2. Insert vào `order_items` table (foreach cart item)
- [x] Return order data với order_code
- [x] Error handling:
  - Invalid data → 400
  - DB error → 500

#### Files Created:
- `src/app/api/orders/route.ts`
- `src/lib/utils.ts` (thêm generateOrderCode function)

#### Issues & Notes:
- TypeScript issue với Supabase types: Đã fix bằng type assertions cho insert operations

---

### Task 4.5: Trang xác nhận đơn hàng
**Status:** `[x]` Completed

#### To-Do:
- [x] Tạo route `/order-success`
- [x] Nhận order_code từ query params
- [x] Hiển thị:
  - Mã đơn hàng (lớn, nổi bật) với nút copy
  - Thông tin next steps
  - Thông tin liên hệ hỗ trợ
- [x] Nút "Quay về trang chủ"
- [x] Nút "Đặt thêm"
- [x] Clear cart sau khi checkout thành công
- [x] Confetti animation với canvas-confetti

#### Files Created:
- `src/app/[locale]/order-success/page.tsx`
- `src/app/[locale]/order-success/OrderSuccessClient.tsx`

#### Dependencies Installed:
- `canvas-confetti`
- `@types/canvas-confetti`

---

### Task 4.6: Email/SMS notification (Optional)
**Status:** `[ ]` Pending (Skipped for now)

#### Notes:
- Có thể implement sau trong Phase 5 hoặc Phase 7
- Sẽ cần setup Resend account và email templates

---

## Checkout Flow Summary

```
[Cart] → [Click "Đặt hàng"]
   ↓
[Checkout Page]
   ├── Order Summary (readonly)
   │   ├── Danh sách items
   │   ├── Ngày nhận (có thể đổi)
   │   └── Tổng tiền
   │
   └── Customer Form
       ├── Họ tên *
       ├── SĐT *
       ├── Email
       ├── Địa chỉ *
       └── Ghi chú
   ↓
[Click "Xác nhận đơn hàng"]
   ↓
[API: Create Order]
   ↓
[Success Page]
   ├── Mã đơn hàng: BT-260127-XXXX
   ├── Next steps info
   └── Clear cart
```

---

## Deliverables Checklist

- [x] Form checkout hoàn chỉnh với validation
- [x] Date picker cho ngày nhận hàng
- [x] API tạo order hoạt động
- [x] Đơn hàng lưu vào database
- [x] Trang success hiển thị mã đơn
- [x] Cart được clear sau checkout
- [x] Confetti animation

---

## Files Created/Modified

```
src/app/[locale]/
├── checkout/
│   ├── page.tsx                 # Server component
│   └── CheckoutPageClient.tsx   # Client component với form
├── order-success/
│   ├── page.tsx                 # Server component
│   └── OrderSuccessClient.tsx   # Client component với confetti

src/app/api/
└── orders/
    └── route.ts                 # POST create order

src/components/ui/
├── calendar.tsx                 # react-day-picker v9
└── popover.tsx                  # Radix popover

src/lib/
├── validations/
│   └── checkout.ts              # Zod schemas
├── utils.ts                     # generateOrderCode function
└── supabase/
    └── types.ts                 # Updated with order_code field
```

---

*Created: 2026-01-26*
*Completed: 2026-01-27*
