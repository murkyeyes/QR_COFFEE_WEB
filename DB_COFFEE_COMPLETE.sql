-- ============================================
-- COFFEE QR DATABASE - COMPLETE WITH SAMPLE DATA
-- Chạy file này để tạo database hoàn chỉnh với dữ liệu mẫu
-- ============================================

-- (0) Drop and create schema
DROP VIEW  IF EXISTS coffee.v_qr_lookup;
DROP VIEW  IF EXISTS coffee.v_qr_public;
DROP TABLE IF EXISTS coffee.qrcode           CASCADE;
DROP TABLE IF EXISTS coffee.price_history    CASCADE;
DROP TABLE IF EXISTS coffee.coffee_profile   CASCADE;
DROP TABLE IF EXISTS coffee.batch            CASCADE;
DROP TABLE IF EXISTS coffee.roast_level      CASCADE;
DROP TABLE IF EXISTS coffee.processing_method CASCADE;
DROP TABLE IF EXISTS coffee.farm             CASCADE;
DROP TABLE IF EXISTS coffee.variety          CASCADE;
DROP TABLE IF EXISTS coffee.product          CASCADE;
DROP TABLE IF EXISTS coffee.users            CASCADE;
CREATE SCHEMA IF NOT EXISTS coffee;

-- (1) Product Line
CREATE TABLE coffee.product (
  product_id   SERIAL PRIMARY KEY,
  name         VARCHAR(80) NOT NULL,
  category     VARCHAR(40) NOT NULL DEFAULT 'beverage',
  description  TEXT
);

-- (2) Coffee Variety
CREATE TABLE coffee.variety (
  variety_id        SERIAL PRIMARY KEY,
  product_id        INT NOT NULL REFERENCES coffee.product(product_id),
  name              VARCHAR(120) NOT NULL,
  species           VARCHAR(60),
  characteristics   TEXT,
  origin_country    VARCHAR(120),
  image_url         VARCHAR(255)
);

-- (3) Farm / Supplier
CREATE TABLE coffee.farm (
  farm_id       SERIAL PRIMARY KEY,
  name          VARCHAR(160) NOT NULL,
  address       VARCHAR(255),
  region        VARCHAR(120),
  phone         VARCHAR(30),
  website       VARCHAR(255),
  certification VARCHAR(160)
);

-- (4) Processing Methods
CREATE TABLE coffee.processing_method (
  method_id     SERIAL PRIMARY KEY,
  name          VARCHAR(80) NOT NULL UNIQUE,
  description   TEXT
);

-- (5) Roast Levels
CREATE TABLE coffee.roast_level (
  level_id      SERIAL PRIMARY KEY,
  name          VARCHAR(80) NOT NULL UNIQUE,
  description   TEXT,
  color_value   VARCHAR(20)
);

-- (6) Batch / Production Lot
CREATE TABLE coffee.batch (
  batch_id       SERIAL PRIMARY KEY,
  variety_id     INT NOT NULL REFERENCES coffee.variety(variety_id),
  farm_id        INT NOT NULL REFERENCES coffee.farm(farm_id),
  method_id      INT REFERENCES coffee.processing_method(method_id),
  level_id       INT REFERENCES coffee.roast_level(level_id),
  harvest_date   DATE NOT NULL,
  roast_date     DATE,
  expiry_date    DATE NOT NULL,
  grade          VARCHAR(2)  CHECK (grade IN ('A','B','C')),
  altitude_m     INT,
  weight_kg      NUMERIC(10,2) CHECK (weight_kg >= 0),
  certification_code VARCHAR(120)
);

-- (7) Coffee Profile
CREATE TABLE coffee.coffee_profile (
  profile_id         SERIAL PRIMARY KEY,
  batch_id           INT NOT NULL REFERENCES coffee.batch(batch_id) ON DELETE CASCADE,
  tasting_notes      VARCHAR(255),
  acidity            VARCHAR(50),
  body               VARCHAR(50),
  sweetness          VARCHAR(50),
  aftertaste         VARCHAR(100),
  brix               NUMERIC(4,1),
  cupping_score      NUMERIC(4,2)
);

-- (8) QR Code
CREATE TABLE coffee.qrcode (
  qr_id          SERIAL PRIMARY KEY,
  batch_id       INT NOT NULL REFERENCES coffee.batch(batch_id),
  code           VARCHAR(128) NOT NULL UNIQUE,
  status         VARCHAR(16) NOT NULL DEFAULT 'active',
  scan_count     INT DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_scanned   TIMESTAMPTZ
);

-- (9) Price History
CREATE TABLE coffee.price_history (
  price_id       SERIAL PRIMARY KEY,
  variety_id     INT NOT NULL REFERENCES coffee.variety(variety_id),
  price_type     VARCHAR(16) NOT NULL CHECK (price_type IN ('original','selling','promo')),
  currency       VARCHAR(8)  NOT NULL DEFAULT 'VND',
  amount         NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  valid_from     DATE NOT NULL,
  valid_to       DATE,
  CONSTRAINT ck_valid_range CHECK (valid_to IS NULL OR valid_to >= valid_from)
);

-- (10) Users
CREATE TABLE coffee.users (
  user_id        SERIAL PRIMARY KEY,
  username       VARCHAR(50) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  email          VARCHAR(120),
  role           VARCHAR(20) DEFAULT 'admin',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_qrcode_code ON coffee.qrcode(code);
CREATE INDEX idx_batch_variety ON coffee.batch(variety_id, harvest_date DESC);
CREATE INDEX idx_batch_farm ON coffee.batch(farm_id, harvest_date DESC);
CREATE INDEX idx_price_variety_type_from ON coffee.price_history(variety_id, price_type, valid_from DESC);
CREATE INDEX idx_coffee_profile_batch ON coffee.coffee_profile(batch_id);

-- ============================================
-- VIEW FOR PUBLIC QR LOOKUP
-- ============================================
CREATE OR REPLACE VIEW coffee.v_qr_public AS
SELECT
  q.code,
  p.name           AS product_name,
  v.name           AS variety_name,
  v.species        AS variety_species,
  f.name           AS farm_name,
  f.region         AS farm_region,
  f.address        AS farm_address,
  f.certification  AS farm_certification,
  pm.name          AS processing_method,
  rl.name          AS roast_level,
  b.harvest_date,
  b.roast_date,
  b.expiry_date,
  b.grade,
  b.altitude_m,
  cp.tasting_notes,
  cp.acidity,
  cp.body,
  cp.sweetness,
  cp.aftertaste,
  cp.cupping_score,
  ph.amount        AS current_price,
  ph.currency,
  q.scan_count,
  q.last_scanned
FROM coffee.qrcode q
JOIN coffee.batch b              ON b.batch_id = q.batch_id
JOIN coffee.variety v            ON v.variety_id = b.variety_id
JOIN coffee.product p            ON p.product_id = v.product_id
JOIN coffee.farm f               ON f.farm_id = b.farm_id
LEFT JOIN coffee.processing_method pm ON pm.method_id = b.method_id
LEFT JOIN coffee.roast_level rl       ON rl.level_id = b.level_id
LEFT JOIN coffee.coffee_profile cp    ON cp.batch_id = b.batch_id
LEFT JOIN LATERAL (
  SELECT amount, currency
  FROM coffee.price_history
  WHERE variety_id = v.variety_id
    AND price_type = 'selling'
    AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
  ORDER BY valid_from DESC
  LIMIT 1
) ph ON TRUE;

-- ============================================
-- SAMPLE DATA - ĐẦY ĐỦ DỮ LIỆU MẪU
-- ============================================

-- Products
INSERT INTO coffee.product (product_id, name, category, description) VALUES
(1, 'Coffee', 'Đồ uống', 'Sản phẩm cà phê các loại tại Việt Nam');

-- Varieties
INSERT INTO coffee.variety (product_id, name, species, characteristics, origin_country, image_url) VALUES
(1, 'Robusta', 'Coffea canephora', 'Hương đậm đắng, caffeine cao, dễ trồng', 'Việt Nam', '/robusta.png'),
(1, 'Arabica', 'Coffea arabica', 'Hương hoa trái, chua thanh, caffeine thấp hơn', 'Ethiopia', '/arabica.png'),
(1, 'Liberica', 'Coffea liberica', 'Hạt to, hương trái cây nhiệt đới, thân gỗ', 'Liberia', '/liberica.jpg'),
(1, 'Excelsa', 'Coffea excelsa', 'Hương trái cây, rượu vang, độc đáo', 'Trung Phi', '/excelsa.jpg'),
(1, 'Cà phê Chồn', 'Coffea arabica', 'Cà phê đặc biệt qua hệ tiêu hóa của chồn hương, hương vị êm mượt, không đắng', 'Việt Nam', '/chon.jpg');

-- Farms
INSERT INTO coffee.farm (name, address, region, phone, website, certification) VALUES
('Trung Nguyên Legend', 'Buôn Ma Thuột', 'Đắk Lắk', '0901234567', 'https://trungnguyenlegend.com/', 'UTZ Certified'),
('Cầu Đất Farm', 'Cầu Đất', 'Lâm Đồng', '0909876543', 'https://caudatfarm.com/', 'Organic'),
('VN Coffee Farm', 'Pleiku', 'Gia Lai', '0987654321', 'https://vncoffee.vn/', 'VietGAP'),
('Mít Coffee Farm', 'Đông Hà', 'Quảng Trị', '0912345678', 'https://mitcoffee.vn/', 'Rainforest Alliance');

-- Processing Methods
INSERT INTO coffee.processing_method (name, description) VALUES
('Washed', 'Xử lý ướt - loại bỏ hoàn toàn lớp thịt quả trước khi phơi'),
('Natural', 'Xử lý khô - phơi nguyên quả, hương đậm, ngọt'),
('Honey', 'Xử lý mật ong - giữ lại một phần nhớt, cân bằng giữa Washed và Natural'),
('Special', 'Xử lý đặc biệt - qua động vật, lên men đặc biệt...');

-- Roast Levels
INSERT INTO coffee.roast_level (name, description, color_value) VALUES
('Light', 'Rang sáng - giữ được hương vị trái cây, chua nhẹ', '#D2691E'),
('Medium', 'Rang vừa - cân bằng giữa chua và đắng', '#8B4513'),
('Dark', 'Rang đậm - hương sô-cô-la, khói, đắng đậm', '#3E2723');

-- Batches
INSERT INTO coffee.batch (variety_id, farm_id, method_id, level_id, harvest_date, roast_date, 
                          expiry_date, grade, altitude_m, weight_kg, certification_code) VALUES
(1, 1, 2, 3, '2025-10-15', '2025-11-01', '2026-12-12', 'A', 600, 1200, 'TN-ROB-2025-001'),
(2, 2, 1, 2, '2025-09-20', '2025-10-15', '2026-10-01', 'A', 1500, 900, 'CD-ARA-2025-002'),
(5, 1, 4, 2, '2025-07-10', '2025-08-01', '2026-08-05', 'A', 800, 50, 'TN-CHON-2025-003'),
(4, 3, 2, 1, '2025-08-25', '2025-09-10', '2026-09-01', 'B', 700, 500, 'VN-EXC-2025-004'),
(3, 4, 3, 2, '2025-08-30', '2025-09-15', '2026-09-01', 'A', 400, 600, 'MIT-LIB-2025-005');

-- Coffee Profiles
INSERT INTO coffee.coffee_profile (batch_id, tasting_notes, acidity, body, sweetness, aftertaste, cupping_score) VALUES
(1, 'Đậm đắng, sô-cô-la đen, khói', 'Thấp', 'Dày (Full)', 'Thấp', 'Đắng kéo dài', 78.5),
(2, 'Hương hoa, cam quýt, trà, mật ong', 'Cao', 'Vừa (Medium)', 'Cao', 'Ngọt thanh, kéo dài', 86.0),
(3, 'Hương êm dịu, mượt mà, hương chocolate, caramel, không đắng, vị ngọt tự nhiên', 'Rất thấp', 'Mượt (Smooth)', 'Cao', 'Ngọt kéo dài, thanh thoát', 92.5),
(4, 'Trái cây chín, hương rượu vang, chua thanh', 'Cao', 'Vừa (Medium)', 'Vừa', 'Chua nhẹ, sảng khoái', 82.0),
(5, 'Hương mít, trái cây nhiệt đới, thảo mộc', 'Vừa', 'Dày (Full)', 'Vừa', 'Vị trái cây kéo dài', 80.5);

-- QR Codes
INSERT INTO coffee.qrcode (batch_id, code, status) VALUES
(1, 'QR-COFFEE-ROB-20251115-0001', 'active'),
(1, 'QR-COFFEE-ROB-20251115-0002', 'active'),
(2, 'QR-COFFEE-ARA-20251015-0001', 'active'),
(3, 'QR-COFFEE-CHON-20250801-0001', 'active'),
(4, 'QR-COFFEE-EXC-20250910-0001', 'active'),
(5, 'QR-COFFEE-LIB-20250915-0001', 'active');

-- Price History
INSERT INTO coffee.price_history (variety_id, price_type, currency, amount, valid_from, valid_to) VALUES
-- Robusta
(1, 'original', 'VND', 100000, '2025-11-01', NULL),
(1, 'selling', 'VND', 150000, '2025-11-15', NULL),
-- Arabica
(2, 'original', 'VND', 180000, '2025-10-01', NULL),
(2, 'selling', 'VND', 250000, '2025-10-15', NULL),
-- Kopi Luwak
(5, 'original', 'VND', 900000, '2025-08-01', NULL),
(5, 'selling', 'VND', 1200000, '2025-08-05', NULL),
(5, 'promo', 'VND', 1000000, '2025-12-01', '2025-12-31'),
-- Excelsa
(4, 'original', 'VND', 150000, '2025-09-01', NULL),
(4, 'selling', 'VND', 200000, '2025-09-10', NULL),
-- Liberica
(3, 'original', 'VND', 180000, '2025-09-01', NULL),
(3, 'selling', 'VND', 220000, '2025-09-15', NULL);

-- Users (Tài khoản admin với bcrypt hash)
INSERT INTO coffee.users (username, password_hash, email, role) VALUES
('admin', '$2b$10$Try.C6J.QQNyyOGBrsF.1OLTGp8/.9Aa5/wWutq1Z40L3sBYOiYgm', 'admin@coffee.vn', 'admin'),
('manager', '$2b$10$jfeHAFabgOR0H9voxUfQROXkszgnTAsblL9eIiskYZSYCUzuZVGoK', 'manager@coffee.vn', 'manager');

-- ============================================
-- DATABASE ROLES & PERMISSIONS
-- ============================================

-- Tạo role cho Admin (quyền đầy đủ)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'coffee_admin_role') THEN
        CREATE ROLE coffee_admin_role;
    END IF;
END
$$;

-- Tạo role cho Manager (không được sửa giá)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'coffee_manager_role') THEN
        CREATE ROLE coffee_manager_role;
    END IF;
END
$$;

-- GRANT toàn bộ quyền cho Admin
GRANT ALL PRIVILEGES ON SCHEMA coffee TO coffee_admin_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA coffee TO coffee_admin_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA coffee TO coffee_admin_role;

-- GRANT quyền cho Manager (TẤT CẢ trừ price_history)
GRANT USAGE ON SCHEMA coffee TO coffee_manager_role;

-- Manager có quyền đọc tất cả tables
GRANT SELECT ON ALL TABLES IN SCHEMA coffee TO coffee_manager_role;

-- Manager có quyền CRUD trên các bảng KHÔNG liên quan đến giá
GRANT INSERT, UPDATE, DELETE ON coffee.product TO coffee_manager_role;
GRANT INSERT, UPDATE, DELETE ON coffee.variety TO coffee_manager_role;
GRANT INSERT, UPDATE, DELETE ON coffee.farm TO coffee_manager_role;
GRANT INSERT, UPDATE, DELETE ON coffee.processing_method TO coffee_manager_role;
GRANT INSERT, UPDATE, DELETE ON coffee.roast_level TO coffee_manager_role;
GRANT INSERT, UPDATE, DELETE ON coffee.batch TO coffee_manager_role;
GRANT INSERT, UPDATE, DELETE ON coffee.coffee_profile TO coffee_manager_role;
GRANT INSERT, UPDATE, DELETE ON coffee.qrcode TO coffee_manager_role;

-- Manager CHỈ được SELECT trên price_history (KHÔNG được INSERT, UPDATE, DELETE)
-- (Đã grant SELECT ALL ở trên rồi, nên không cần thêm)

-- Manager có quyền sử dụng sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA coffee TO coffee_manager_role;

-- Đảm bảo quyền cho future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA coffee GRANT ALL ON TABLES TO coffee_admin_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA coffee GRANT ALL ON SEQUENCES TO coffee_admin_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA coffee GRANT SELECT ON TABLES TO coffee_manager_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA coffee GRANT USAGE, SELECT ON SEQUENCES TO coffee_manager_role;

-- ============================================
-- RESET SEQUENCES
-- ============================================
SELECT setval('coffee.product_product_id_seq',     (SELECT max(product_id)  FROM coffee.product));
SELECT setval('coffee.variety_variety_id_seq',     (SELECT max(variety_id)  FROM coffee.variety));
SELECT setval('coffee.farm_farm_id_seq',           (SELECT max(farm_id)     FROM coffee.farm));
SELECT setval('coffee.processing_method_method_id_seq', (SELECT max(method_id) FROM coffee.processing_method));
SELECT setval('coffee.roast_level_level_id_seq',   (SELECT max(level_id)    FROM coffee.roast_level));
SELECT setval('coffee.batch_batch_id_seq',         (SELECT max(batch_id)    FROM coffee.batch));
SELECT setval('coffee.coffee_profile_profile_id_seq', (SELECT max(profile_id) FROM coffee.coffee_profile));
SELECT setval('coffee.qrcode_qr_id_seq',           (SELECT max(qr_id)       FROM coffee.qrcode));
SELECT setval('coffee.price_history_price_id_seq', (SELECT max(price_id)    FROM coffee.price_history));
SELECT setval('coffee.users_user_id_seq',          (SELECT max(user_id)     FROM coffee.users));

-- ============================================
-- ENABLE FULL-TEXT SEARCH
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS trgm_idx_variety_name 
ON coffee.variety USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS trgm_idx_farm_name 
ON coffee.farm USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS trgm_idx_farm_region 
ON coffee.farm USING gin (region gin_trgm_ops);

-- ============================================
-- VERIFICATION
-- ============================================
SELECT '✅ Database created successfully!' as status;
SELECT 'Products:' as table_name, COUNT(*) as count FROM coffee.product
UNION ALL
SELECT 'Varieties:', COUNT(*) FROM coffee.variety
UNION ALL
SELECT 'Farms:', COUNT(*) FROM coffee.farm
UNION ALL
SELECT 'Processing Methods:', COUNT(*) FROM coffee.processing_method
UNION ALL
SELECT 'Roast Levels:', COUNT(*) FROM coffee.roast_level
UNION ALL
SELECT 'Batches:', COUNT(*) FROM coffee.batch
UNION ALL
SELECT 'Coffee Profiles:', COUNT(*) FROM coffee.coffee_profile
UNION ALL
SELECT 'QR Codes:', COUNT(*) FROM coffee.qrcode
UNION ALL
SELECT 'Price History:', COUNT(*) FROM coffee.price_history
UNION ALL
SELECT 'Users:', COUNT(*) FROM coffee.users;
