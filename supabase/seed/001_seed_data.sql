-- Bánh Tét Tết - Seed Data
-- Run this after the initial schema migration

-- ============================================
-- Price Tiers (3 tiers)
-- ============================================
INSERT INTO price_tiers (id, name, description, color) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ngày thường', 'Giá ngày thường', '#22C55E'),
  ('00000000-0000-0000-0000-000000000002', 'Ngày cao điểm', 'Giá ngày cao điểm (25-28 Tết)', '#F59E0B'),
  ('00000000-0000-0000-0000-000000000003', 'Ngày Tết', 'Giá ngày Tết (29-30 và mùng 1-3)', '#EF4444')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Order Statuses
-- ============================================
INSERT INTO order_statuses (id, name, color, display_order) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Chờ xác nhận', '#F59E0B', 1),
  ('10000000-0000-0000-0000-000000000002', 'Đã xác nhận', '#3B82F6', 2),
  ('10000000-0000-0000-0000-000000000003', 'Đang chuẩn bị', '#8B5CF6', 3),
  ('10000000-0000-0000-0000-000000000004', 'Đang giao', '#06B6D4', 4),
  ('10000000-0000-0000-0000-000000000005', 'Hoàn thành', '#22C55E', 5),
  ('10000000-0000-0000-0000-000000000006', 'Đã hủy', '#EF4444', 6)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Products (7 sản phẩm)
-- ============================================
INSERT INTO products (id, name, slug, description, image_url, weight_grams, is_available, display_order) VALUES
  (
    '20000000-0000-0000-0000-000000000002',
    'Nhân đậu + thịt + trứng muối + tam sắc',
    'nhan-dau-thit-trung-muoi-tam-sac',
    'Bánh tét nhân đậu + thịt + trứng muối + tam sắc.',
    'https://cdn.efl.vn/banhTetImg/1282848398419000646%20(10).jpg',
    1200,
    true,
    2
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Nhân đậu + thịt + trứng muối - Loại lớn',
    'tet-thit-trung-lon',
    'Bánh tét nhân đậu + thịt + trứng muối - Loại lớn.',
    'https://cdn.efl.vn/banhTetImg/1282848398419000646%20(13).jpg',
    1200,
    true,
    3
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Nhân đậu + thịt + trứng muối - Loại nhỏ',
    'tet-thit-trung-nho',
    'Bánh tét nhân đậu + thịt + trứng muối - Loại nhỏ.',
    'https://cdn.efl.vn/banhTetImg/b7e848f3eeaa60f439bb.jpg',
    1000,
    true,
    4
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'Nhân chay đậu xanh tam sắc',
    'nhan-chay-dau-xanh-tam-sac',
    'Bánh tét nhân chay đậu xanh tam sắc.',
    'https://cdn.efl.vn/banhTetImg/1282848398419000646%20(9).jpg',
    1000,
    true,
    5
  ),
  (
    '20000000-0000-0000-0000-000000000006',
    'Nhân chuối',
    'tet-chuoi',
    'Bánh tét nhân chuối.',
    'https://cdn.efl.vn/banhTetImg/0fdf15c6b39f3dc1648e.jpg',
    800,
    true,
    6
  ),
  (
    '20000000-0000-0000-0000-000000000007',
    'Bánh ú nhân đậu + thịt + trứng muối + tôm khô',
    'u-thap-cam-tom-kho',
    'Bánh ú nhân đậu + thịt + trứng muối + tôm khô.',
    'https://cdn.efl.vn/banhTetImg/1282848398419000646%20(15).jpg',
    900,
    true,
    7
  ),
  (
    '20000000-0000-0000-0000-000000000008',
    'Bánh ú nhân đậu + thịt + trứng muối',
    'u-thap-cam',
    'Bánh ú nhân đậu + thịt + trứng muối.',
    'https://cdn.efl.vn/banhTetImg/1282848398419000646%20(6).jpg',
    500,
    true,
    8
  )
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  weight_grams = EXCLUDED.weight_grams;

-- ============================================
-- Product Tier Prices
-- ============================================

-- Tét - 3 màu (1.2kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 150000),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 160000),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 165000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Thịt trứng (Lớn - 1.2kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 140000),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 150000),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 160000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Thịt trứng (Nhỏ - 1.0kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 120000),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 130000),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', 140000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Đậu mỡ & Chay (1.0kg)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 100000),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 120000),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000003', 130000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Tét - Chuối (800g)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 80000),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000002', 90000),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 100000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Ú - Thập cẩm Tôm Khô (900g)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 130000),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 140000),
  ('20000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 145000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- Ú - Thập cẩm (500g)
INSERT INTO product_tier_prices (product_id, tier_id, price) VALUES
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 75000),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000002', 80000),
  ('20000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000003', 85000)
ON CONFLICT (product_id, tier_id) DO NOTHING;

-- ============================================
-- Site Settings
-- ============================================
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'Bánh Tét Tết'),
  ('site_description', 'Đặt bánh tét Tết chất lượng cao, giao hàng tận nơi'),
  ('contact_phone', '0374027409'),
  ('contact_email', 'cophuocvinh@banhtet.vn'),
  ('contact_address', '70 Lữ Gia TP. Hồ Chí Minh, Việt Nam'),
  ('facebook_url', 'https://www.facebook.com/phuocvinh.co'),
  ('zalo_url', 'https://zalo.me/0374027409'),
  ('min_order_amount', '100000'),
  ('delivery_fee', '30000'),
  ('free_delivery_threshold', '500000'),
  -- About Section Settings
  ('about_section_label', 'Về chúng tôi'),
  ('about_title', 'Hương vị truyền thống,'),
  ('about_title_highlight', 'chất lượng hiện đại'),
  ('about_description1', 'Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những chiếc bánh tét thơm ngon, được làm từ nguyên liệu tươi sạch và công thức gia truyền. Mỗi chiếc bánh là tâm huyết của người thợ làm bánh, gói trọn hương vị Tết Việt.'),
  ('about_description2', 'Từ lá chuối tươi đến nếp thơm, đậu xanh bùi béo - tất cả đều được chọn lọc kỹ càng. Chúng tôi cam kết mang đến cho bạn những chiếc bánh tét ngon nhất, an toàn nhất.'),
  ('about_image_url', 'https://cdn.efl.vn/banhTetImg/brand-story.jpg'),
  ('about_badge_value', '10+'),
  ('about_badge_label', 'Năm kinh nghiệm'),
  ('about_stat1_value', '8+'),
  ('about_stat1_label', 'Loại bánh'),
  ('about_stat2_value', '1000+'),
  ('about_stat2_label', 'Khách hàng'),
  ('about_stat3_value', '10+'),
  ('about_stat3_label', 'Năm kinh nghiệm'),
  ('about_stat4_value', '100%'),
  ('about_stat4_label', 'Hài lòng')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- Date Tier Assignments (Tết 2026)
-- ============================================
-- Ngày thường: 02-06/02/2026
-- Ngày cao điểm: 07-09/02/2026  
-- Ngày Tết: 10-12/02/2026

INSERT INTO date_tier_assignments (date, tier_id) VALUES
  -- Ngày thường (02-06/02)
  ('2026-02-02', '00000000-0000-0000-0000-000000000001'),
  ('2026-02-03', '00000000-0000-0000-0000-000000000001'),
  ('2026-02-04', '00000000-0000-0000-0000-000000000001'),
  ('2026-02-05', '00000000-0000-0000-0000-000000000001'),
  ('2026-02-06', '00000000-0000-0000-0000-000000000001'),
  -- Ngày cao điểm (07-09/02)
  ('2026-02-07', '00000000-0000-0000-0000-000000000002'),
  ('2026-02-08', '00000000-0000-0000-0000-000000000002'),
  ('2026-02-09', '00000000-0000-0000-0000-000000000002'),
  -- Ngày Tết (10-12/02)
  ('2026-02-10', '00000000-0000-0000-0000-000000000003'),
  ('2026-02-11', '00000000-0000-0000-0000-000000000003'),
  ('2026-02-12', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (date) DO UPDATE SET tier_id = EXCLUDED.tier_id;
