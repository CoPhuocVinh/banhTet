# Kịch Bản Test Thủ Công - Bánh Tét Tết

## Mục lục
1. [Test Chức Năng Chính](#1-test-chức-năng-chính)
2. [Test Accessibility (5.6)](#2-test-accessibility-56)
3. [Test Cross-browser (5.7)](#3-test-cross-browser-57)
4. [Test Mobile (5.8)](#4-test-mobile-58)

---

## 1. Test Chức Năng Chính

### 1.1 Landing Page
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Load trang chủ | Mở `/{locale}` | Trang load, 3D hiển thị | [ ] |
| 2 | 3D interaction | Di chuột qua bánh tét 3D | Bánh xoay theo chuột | [ ] |
| 3 | Navigation | Click menu items | Scroll đến section tương ứng | [ ] |
| 4 | Language switch | Click VI/EN | UI đổi ngôn ngữ | [ ] |
| 5 | CTA button | Click "Đặt hàng ngay" | Chuyển đến /products | [ ] |

### 1.2 Products Page
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Load products | Mở `/products` | Danh sách sản phẩm hiển thị | [ ] |
| 2 | Search | Nhập "chuối" vào search | Filter sản phẩm có "chuối" | [ ] |
| 3 | Sort | Chọn sort option | Sản phẩm sắp xếp đúng | [ ] |
| 4 | Card hover | Hover product card | 3D tilt effect | [ ] |
| 5 | Add to cart | Click icon giỏ hàng | Toast "Đã thêm", cart count +1 | [ ] |
| 6 | View detail | Click vào card | Chuyển đến product detail | [ ] |

### 1.3 Product Detail Page
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Load detail | Mở `/products/{slug}` | Chi tiết sản phẩm hiển thị | [ ] |
| 2 | Image display | Kiểm tra hình ảnh | Hình hiển thị đúng | [ ] |
| 3 | Price tiers | Kiểm tra bảng giá | 3 tiers hiển thị đúng | [ ] |
| 4 | Quantity +/- | Click +/- buttons | Số lượng thay đổi (1-99) | [ ] |
| 5 | Add to cart | Click "Thêm vào giỏ" | Toast + button đổi thành "Đã thêm" | [ ] |
| 6 | Related products | Scroll xuống | Sản phẩm liên quan hiển thị | [ ] |

### 1.4 Cart
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Open cart | Click icon giỏ hàng | Cart drawer mở từ phải | [ ] |
| 2 | View items | Kiểm tra items | Sản phẩm đã thêm hiển thị | [ ] |
| 3 | Change quantity | Click +/- | Số lượng & tổng tiền update | [ ] |
| 4 | Remove item | Click nút xóa | Item bị xóa | [ ] |
| 5 | Select date | Chọn ngày nhận | Giá update theo tier | [ ] |
| 6 | Checkout button | Click "Đặt hàng" | Chuyển đến /checkout | [ ] |
| 7 | Persist | Refresh trang | Cart vẫn còn data | [ ] |

### 1.5 Checkout
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Load checkout | Mở `/checkout` | Form và order summary hiển thị | [ ] |
| 2 | Empty cart | Vào checkout với cart rỗng | Redirect về products | [ ] |
| 3 | Form validation | Submit form rỗng | Hiển thị lỗi validation | [ ] |
| 4 | Phone input | Nhập SĐT | Chấp nhận mọi format | [ ] |
| 5 | Date picker | Click chọn ngày | Calendar mở, chọn được ngày | [ ] |
| 6 | Submit order | Điền đầy đủ, submit | Loading → redirect success | [ ] |

### 1.6 Order Success
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Success page | Sau khi đặt hàng | Confetti + mã đơn hàng | [ ] |
| 2 | Copy code | Click nút copy | Copy mã, icon đổi thành ✓ | [ ] |
| 3 | Cart cleared | Kiểm tra giỏ hàng | Cart đã trống | [ ] |
| 4 | Navigation | Click buttons | Về trang chủ / products | [ ] |

### 1.7 Error Pages
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | 404 page | Mở `/vi/abc123` | Trang 404 hiển thị | [ ] |
| 2 | 404 buttons | Click buttons | Navigation hoạt động | [ ] |

---

## 2. Test Accessibility (5.6)

### 2.1 Keyboard Navigation
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Tab order | Press Tab liên tục | Focus di chuyển logic | [ ] |
| 2 | Focus visible | Tab qua elements | Focus indicator rõ ràng | [ ] |
| 3 | Enter/Space | Focus button, press Enter | Button activate | [ ] |
| 4 | Escape | Mở cart, press Esc | Cart đóng | [ ] |
| 5 | Form navigation | Tab qua form fields | Tất cả fields accessible | [ ] |

### 2.2 Screen Reader (NVDA/VoiceOver)
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Page title | Load page | Đọc title đúng | [ ] |
| 2 | Headings | Navigate by headings | H1-H6 hierarchy đúng | [ ] |
| 3 | Images | Navigate to images | Alt text được đọc | [ ] |
| 4 | Buttons | Focus buttons | Label được đọc | [ ] |
| 5 | Form labels | Focus form fields | Label được đọc | [ ] |
| 6 | Error messages | Submit invalid form | Errors được announce | [ ] |

### 2.3 Visual
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Color contrast | Dùng contrast checker | Ratio >= 4.5:1 | [ ] |
| 2 | Zoom 200% | Zoom browser 200% | Content không bị cắt | [ ] |
| 3 | Text resize | Tăng font size | Layout không vỡ | [ ] |

### 2.4 Tools để test
- **axe DevTools**: Chrome extension
- **WAVE**: Chrome extension
- **Lighthouse**: DevTools > Lighthouse > Accessibility
- **Color Contrast Checker**: webaim.org/resources/contrastchecker

---

## 3. Test Cross-browser (5.7)

### 3.1 Browsers cần test
| Browser | Version | Windows | macOS | Pass |
|---------|---------|---------|-------|------|
| Chrome | Latest | [ ] | [ ] | |
| Firefox | Latest | [ ] | [ ] | |
| Edge | Latest | [ ] | [ ] | |
| Safari | Latest | N/A | [ ] | |

### 3.2 Checklist mỗi browser
| # | Test Case | Expected | Pass |
|---|-----------|----------|------|
| 1 | Page load | Trang load đầy đủ | [ ] |
| 2 | 3D render | WebGL hoạt động | [ ] |
| 3 | Animations | Framer Motion smooth | [ ] |
| 4 | Forms | Input/select hoạt động | [ ] |
| 5 | Cart drawer | Mở/đóng smooth | [ ] |
| 6 | Date picker | Calendar hiển thị đúng | [ ] |
| 7 | Responsive | Resize window | [ ] |
| 8 | Fonts | Vietnamese text đúng | [ ] |

### 3.3 Known Issues Log
| Browser | Issue | Severity | Workaround |
|---------|-------|----------|------------|
| | | | |

---

## 4. Test Mobile (5.8)

### 4.1 Devices cần test
| Device | Screen | OS | Pass |
|--------|--------|-----|------|
| iPhone SE | 375x667 | iOS | [ ] |
| iPhone 14 Pro | 393x852 | iOS | [ ] |
| Samsung Galaxy | 360x800 | Android | [ ] |
| iPad | 768x1024 | iPadOS | [ ] |

### 4.2 Responsive Breakpoints
| Breakpoint | Width | Test |
|------------|-------|------|
| Mobile | < 640px | [ ] |
| Tablet | 640-1024px | [ ] |
| Desktop | > 1024px | [ ] |

### 4.3 Mobile-specific Tests
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Touch targets | Tap buttons | Dễ tap, >= 44px | [ ] |
| 2 | Mobile menu | Tap hamburger | Menu mở đúng | [ ] |
| 3 | Scroll | Scroll page | Smooth, no jank | [ ] |
| 4 | 3D on mobile | View 3D section | Hiển thị hoặc fallback | [ ] |
| 5 | Form input | Tap input fields | Keyboard mở, không zoom | [ ] |
| 6 | Date picker | Tap date field | Touch-friendly calendar | [ ] |
| 7 | Cart drawer | Tap cart icon | Drawer mở full width | [ ] |
| 8 | Orientation | Xoay device | Layout adapt đúng | [ ] |

### 4.4 Performance Mobile
| # | Test Case | Steps | Expected | Pass |
|---|-----------|-------|----------|------|
| 1 | Initial load | Load trang đầu | < 3s trên 4G | [ ] |
| 2 | 3D performance | Interact với 3D | Không lag/jank | [ ] |
| 3 | Scroll performance | Scroll nhanh | 60fps | [ ] |
| 4 | Memory | Dùng 5 phút | Không crash | [ ] |

### 4.5 Network Conditions (DevTools)
| Condition | Test | Pass |
|-----------|------|------|
| Fast 3G | Page vẫn load | [ ] |
| Slow 3G | Page load (có thể chậm) | [ ] |
| Offline | Hiển thị error phù hợp | [ ] |

---

## 5. Lighthouse Audit

### Run Lighthouse
1. Mở Chrome DevTools (F12)
2. Tab "Lighthouse"
3. Chọn: Performance, Accessibility, Best Practices, SEO
4. Chọn: Mobile & Desktop
5. Click "Analyze page load"

### Target Scores
| Category | Target | Mobile | Desktop |
|----------|--------|--------|---------|
| Performance | > 90 | [ ] | [ ] |
| Accessibility | > 90 | [ ] | [ ] |
| Best Practices | > 90 | [ ] | [ ] |
| SEO | > 90 | [ ] | [ ] |

### Pages cần audit
- [ ] Home page (`/vi`)
- [ ] Products page (`/vi/products`)
- [ ] Product detail (`/vi/products/{slug}`)
- [ ] Checkout (`/vi/checkout`)

---

## 6. Bug Report Template

```markdown
### Bug Title
[Mô tả ngắn gọn]

### Environment
- Browser:
- Device:
- OS:
- URL:

### Steps to Reproduce
1.
2.
3.

### Expected Behavior
[Mong đợi gì]

### Actual Behavior
[Thực tế xảy ra gì]

### Screenshots
[Đính kèm nếu có]

### Severity
- [ ] Critical (không dùng được)
- [ ] High (ảnh hưởng lớn)
- [ ] Medium (có workaround)
- [ ] Low (cosmetic)
```

---

*Created: 2026-01-27*
