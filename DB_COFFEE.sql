DROP TABLE IF EXISTS coffee_profile CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================
-- TẠO BẢNG MỚI
-- =============================

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    origin VARCHAR(100),
    farm VARCHAR(100),
    website VARCHAR(150),
    expire_date DATE,
    price_original NUMERIC(12,2),
    price_sell NUMERIC(12,2),
    image_url VARCHAR(300) 
);

CREATE TABLE coffee_profile (
    profile_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    tasting_notes VARCHAR(255),
    acidity VARCHAR(50),
    body VARCHAR(50),
    processing_method VARCHAR(100),
    roast_level VARCHAR(50)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);

-- =============================
-- THÊM DỮ LIỆU MẪU
-- =============================

INSERT INTO products (product_id, name, category, origin, farm, website, expire_date, price_original, price_sell, image_url) VALUES
(1, 'Cà phê rang xay Robusta', 'Đồ uống', 'Buôn Ma Thuột, Đắk Lắk', 'Trung Nguyên',
 'https://trungnguyenlegend.com/', '2026-12-12', 120000, 150000,
 '/robusta.png'),
(2, 'Cà phê hạt Arabica', 'Đồ uống', 'Cầu Đất, Lâm Đồng', 'Cầu Đất Farm',
 'https://caudatfarm.com/', '2026-10-01', 200000, 250000,
 '/arabica.png'),
(3, 'Cà phê Chồn (Kopi Luwak)', 'Đồ uống cao cấp', 'Tây Nguyên, Việt Nam', 'Trung Nguyên Legend',
 'https://trungnguyenlegend.com/', '2026-08-05', 1000000, 1200000,
 '/chon.jpg'),
(4, 'Cà phê Excelsa (Chari)', 'Đồ uống', 'Gia Lai', 'VN Coffee Farm',
 'https://vncoffee.vn/', '2026-09-01', 180000, 200000,
 '/excelsa.jpg'),
(5, 'Cà phê Liberica (Mít)', 'Đồ uống', 'Quảng Trị, Nghệ An', 'Cà phê Mít Việt Nam',
 'https://vncoffee.vn/', '2026-09-01', 200000, 220000,
 '/liberica.jpg');

INSERT INTO coffee_profile (profile_id, product_id, tasting_notes, acidity, body, processing_method, roast_level) VALUES
(1, 1, 'Đậm đắng, sô cô la đen, khói', 'Thấp', 'Dày (Full body)', 'Natural (Khô)', 'Đậm (Dark)'),
(2, 2, 'Hương hoa, cam quýt, trà, mật ong', 'Cao (Sáng)', 'Vừa (Medium body)', 'Washed (Ướt)', 'Vừa (Medium)'),
(3, 3, 'Êm dịu, sô cô la sữa, ít đắng, hậu vị ngọt', 'Rất thấp', 'Dày (Full body)', 'Tự nhiên (Qua xử lý của chồn)', 'Vừa (Medium)'),
(4, 4, 'Trái cây chín, hương rượu vang, chua thanh', 'Vừa-Cao', 'Vừa (Medium body)', 'Natural (Khô)', 'Sáng (Light-Medium)'),
(5, 5, 'Hương mít, trái cây nhiệt đới, thảo mộc', 'Vừa', 'Dày (Full body)', 'Honey (Mật ong)', 'Vừa (Medium)');

-- Thêm 1 tài khoản admin mẫu
-- Mật khẩu là: '12345' (văn bản thuần)

INSERT INTO users (username, password_hash, role) 
VALUES ('admin', '12345', 'admin'); 



-- mở 1 query khác pass cái này vào
-- Kích hoạt extension pg_trgm (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

/* Tạo GIN index cho cột 'name' sử dụng trigram.
 'gin_trgm_ops' là "phương pháp" để index
*/
CREATE INDEX IF NOT EXISTS trgm_idx_products_name 
ON products 
USING gin (name gin_trgm_ops);

-- Làm tương tự cho 'category'
CREATE INDEX IF NOT EXISTS trgm_idx_products_category 
ON products 
USING gin (category gin_trgm_ops);

-- Và cho 'origin'
CREATE INDEX IF NOT EXISTS trgm_idx_products_origin 
ON products 
USING gin (origin gin_trgm_ops);