import { query } from "../db.js";

// GET ALL
export const getProducts = async () => {
    const {rows} = await query('SELECT * FROM products ORDER BY product_id ASC');
    return rows;
}

// GET ONE BY ID
export const getProductById = async (productId) => {
    const {rows} = await query('SELECT * FROM products WHERE product_id = $1', [productId]);
    return rows[0];
}

// POST (Tạo mới - Có xử lý dữ liệu an toàn)
export const createProduct = async (productData) => {
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url } = productData;
    const {rows} = await query(
        `INSERT INTO products (name, category, origin, farm, website, expire_date, price_original, price_sell, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [
            name, 
            category || null, 
            origin || null, 
            farm || null, 
            website || null, 
            expire_date || null, // <--- SỬA LỖI: Nếu rỗng thì chuyển thành NULL
            price_original || null, 
            price_sell || null, 
            image_url || null
        ]
    );
    return rows[0];
}

// PUT (Cập nhật - Có xử lý dữ liệu an toàn)
export const updateProduct = async (productData, productId) => {
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url } = productData;
    const {rows} = await query(
        `UPDATE products 
         SET name = $1, category = $2, origin = $3, farm = $4, website = $5, 
             expire_date = $6, price_original = $7, price_sell = $8, image_url = $9
         WHERE product_id = $10 
         RETURNING *`,
        [
            name, 
            category || null, 
            origin || null, 
            farm || null, 
            website || null, 
            expire_date || null, // <--- SỬA LỖI: Nếu rỗng thì chuyển thành NULL
            price_original || null, 
            price_sell || null, 
            image_url || null
        ]
    );
    return rows[0];
}

// DELETE
export const deleteProduct = async (productId) => {
    const {rowCount} = await query( 'DELETE FROM products WHERE product_id = $1 RETURNING *', [productId] );
    return rowCount > 0;
}

// SEARCH
export const searchProducts = async (searchTerm) => {
    const { rows } = await query(
        'SELECT * FROM products WHERE name ILIKE $1 OR category ILIKE $1 OR origin ILIKE $1 ORDER BY product_id ASC',
        [`%${searchTerm}%`]
    );
    return rows;
}