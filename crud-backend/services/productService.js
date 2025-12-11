import { query } from "../db.js";

// GET ALL
export const getProducts = async () => {
    const {rows} = await query(
        `SELECT p.*, cp.tasting_notes, cp.acidity, cp.body, cp.processing_method, cp.roast_level
         FROM products p
         LEFT JOIN coffee_profile cp ON p.product_id = cp.product_id
         ORDER BY p.product_id ASC`
    );
    return rows;
}

// GET ONE BY ID
export const getProductById = async (productId) => {
    const {rows} = await query(
        `SELECT p.*, cp.tasting_notes, cp.acidity, cp.body, cp.processing_method, cp.roast_level
         FROM products p
         LEFT JOIN coffee_profile cp ON p.product_id = cp.product_id
         WHERE p.product_id = $1`,
        [productId]
    );
    return rows[0];
}

// POST (Tạo mới - Có xử lý dữ liệu an toàn)
export const createProduct = async (productData) => {
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url,
            tasting_notes, acidity, body, processing_method, roast_level } = productData;
    
    // Insert vào bảng products
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
            expire_date || null,
            price_original || null, 
            price_sell || null, 
            image_url || null
        ]
    );
    
    const newProduct = rows[0];
    
    // Insert vào bảng coffee_profile (nếu có dữ liệu profile)
    if (tasting_notes || acidity || body || processing_method || roast_level) {
        await query(
            `INSERT INTO coffee_profile (product_id, tasting_notes, acidity, body, processing_method, roast_level)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                newProduct.product_id,
                tasting_notes || null,
                acidity || null,
                body || null,
                processing_method || null,
                roast_level || null
            ]
        );
    }
    
    return newProduct;
}

// PUT (Cập nhật - Có xử lý dữ liệu an toàn)
export const updateProduct = async (productData, productId) => {
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url,
            tasting_notes, acidity, body, processing_method, roast_level } = productData;
    
    // Update bảng products
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
            expire_date || null,
            price_original || null, 
            price_sell || null, 
            image_url || null,
            productId
        ]
    );
    
    // Update bảng coffee_profile (nếu có dữ liệu profile)
    if (tasting_notes !== undefined || acidity !== undefined || body !== undefined || 
        processing_method !== undefined || roast_level !== undefined) {
        await query(
            `UPDATE coffee_profile 
             SET tasting_notes = $1, acidity = $2, body = $3, processing_method = $4, roast_level = $5
             WHERE product_id = $6`,
            [
                tasting_notes || null,
                acidity || null,
                body || null,
                processing_method || null,
                roast_level || null,
                productId
            ]
        );
    }
    
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
        `SELECT p.*, cp.tasting_notes, cp.acidity, cp.body, cp.processing_method, cp.roast_level
         FROM products p
         LEFT JOIN coffee_profile cp ON p.product_id = cp.product_id
         WHERE p.name ILIKE $1 OR p.category ILIKE $1 OR p.origin ILIKE $1 
         ORDER BY p.product_id ASC`,
        [`%${searchTerm}%`]
    );
    return rows;
}