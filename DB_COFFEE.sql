-- =============================================================
-- 💾 COFFEE DATABASE SCHEMA (PostgreSQL Version)
-- =============================================================
-- =============================================================
-- File này dùng để thiết lập database cho dự án.
-- CÁCH DÙNG (cho người tải dự án):
-- 1. Tạo một database rỗng tên là "coffee_db" trong PostgreSQL.
-- 2. Chạy toàn bộ nội dung file này trong Query Tool của "coffee_db".
-- =============================================================
-- =============================
-- RESET DATABASE (Xóa nếu tồn tại)
-- =============================
-- =============================================================
-- 💾 COFFEE DATABASE SCHEMA (PostgreSQL Version)
-- =============================================================

-- =============================
-- RESET DATABASE (Xóa nếu tồn tại)
-- =============================

--DROP TABLE IF EXISTS orders CASCADE;
--DROP TABLE IF EXISTS nutrition CASCADE;
--DROP TABLE IF EXISTS products CASCADE;

-- =============================
-- TẠO BẢNG MỚI
-- =============================


=============================
THÊM DỮ LIỆU MẪU
=============================
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

CREATE TABLE nutrition (
    nutrition_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    calories INT,
    caffeine_content VARCHAR(50),
    sugar NUMERIC(5,2),
    fat NUMERIC(5,2)
);



INSERT INTO products (product_id, name, category, origin, farm, website, expire_date, price_original, price_sell, image_url) VALUES
(1, 'Cà phê rang xay Robusta', 'Đồ uống', 'Buôn Ma Thuột, Đắk Lắk', 'Trung Nguyên',
 'https://trungnguyenlegend.com/', '2026-12-12', 120000, 150000,
 '/images/robusta.png'), -- <-- ĐỊA CHỈ ẢNH
(2, 'Cà phê hạt Arabica', 'Đồ uống', 'Cầu Đất, Lâm Đồng', 'Cầu Đất Farm',
 'https://caudatfarm.com/', '2026-10-01', 200000, 250000,
 '/images/arabica.png'), -- <-- ĐỊA CHỈ ẢNH
(3, 'Cà phê Chồn (Kopi Luwak)', 'Đồ uống cao cấp', 'Tây Nguyên, Việt Nam', 'Trung Nguyên Legend',
 'https://trungnguyenlegend.com/', '2026-08-05', 1000000, 1200000,
 '/images/chon.jpg'), -- <-- ĐỊA CHỈ ẢNH
(4, 'Cà phê Excelsa (Chari)', 'Đồ uống', 'Gia Lai', 'VN Coffee Farm',
 'https://vncoffee.vn/', '2026-09-01', 180000, 200000,
 '/images/excelsa.jpg'), -- <-- ĐỊA CHỈ ẢNH
(5, 'Cà phê Liberica (Mít)', 'Đồ uống', 'Quảng Trị, Nghệ An', 'Cà phê Mít Việt Nam',
 'https://vncoffee.vn/', '2026-09-01', 200000, 220000,
 '/images/iberica.jpg'); -- <-- ĐỊA CHỈ ẢNH (iberica.jpg theo tên file của bạn)

INSERT INTO nutrition (nutrition_id, product_id, calories, caffeine_content, sugar, fat) VALUES
(1, 1, 40, '2.0%', 0.5, 0.2),
(2, 2, 35, '1.5%', 0.3, 0.1),
(3, 3, 60, '1.0%', 2.5, 0.5),
(4, 4, 45, '1.8%', 0.6, 0.3),
(5, 5, 50, '1.6%', 0.8, 0.4);



---




--SELECT * FROM products ORDER BY product_id;


--SELECT * FROM nutrition ORDER BY product_id;