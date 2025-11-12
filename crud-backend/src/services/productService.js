import { query } from "../db.js";

// GET ALL
export const getProducts = async () => {
    // SELECT * sẽ tự động lấy cột image_url mới
    const {rows} = await query('SELECT * FROM products ORDER BY product_id ASC');
    return rows;
}

// GET ONE BY ID (Cho trang chi tiết và QR scan)
export const getProductById = async (productId) => {
    // SELECT * sẽ tự động lấy cột image_url mới
    const {rows} = await query('SELECT * FROM products WHERE product_id = $1', [productId]);
    return rows[0]; // Trả về 1 object
}

// POST (CẬP NHẬT)
export const createProduct = async (productData) => {
    // Thêm image_url vào danh sách
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url } = productData;
    const {rows} = await query(
        // Thêm cột image_url và tham số $9
        `INSERT INTO products (name, category, origin, farm, website, expire_date, price_original, price_sell, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [name, category, origin, farm, website, expire_date, price_original, price_sell, image_url]
    );
    return rows[0];
}

// PUT (CẬP NHẬT)
export const updateProduct = async (productData, productId) => {
    // Thêm image_url vào danh sách
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url } = productData;
    const {rows} = await query(
        // Thêm image_url = $9 và đổi WHERE thành $10
        `UPDATE products 
         SET name = $1, category = $2, origin = $3, farm = $4, website = $5, 
             expire_date = $6, price_original = $7, price_sell = $8, image_url = $9
         WHERE product_id = $10 
         RETURNING *`,
        [name, category, origin, farm, website, expire_date, price_original, price_sell, image_url, productId]
    );
    return rows[0];
}

// DELETE (Không đổi)
export const deleteProduct = async (productId) => {
    const {rowCount} = await query( 'DELETE FROM products WHERE product_id = $1 RETURNING *', [productId] );
    return rowCount > 0;
}

// SEARCH (Không đổi)
export const searchProducts = async (searchTerm) => {
    const { rows } = await query(
        'SELECT * FROM products WHERE name ILIKE $1 OR category ILIKE $1 OR origin ILIKE $1 ORDER BY product_id ASC',
        [`%${searchTerm}%`]
    );
    return rows;
}