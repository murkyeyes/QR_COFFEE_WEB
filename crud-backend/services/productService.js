// 1. SỬA LẠI IMPORT (thêm 'db' default)
import db, { query } from "../db.js";

// 2. SỬA LẠI HÀM getProducts (để JOIN)
export const getProducts = async () => {
    // Lấy tất cả data, JOIN cả coffee_profile
    const {rows} = await query(`
        SELECT 
            p.*, 
            cp.tasting_notes, 
            cp.acidity, 
            cp.body,
            cp.processing_method,
            cp.roast_level
        FROM 
            products p
        LEFT JOIN 
            coffee_profile cp ON p.product_id = cp.product_id
        ORDER BY 
            p.product_id ASC;
    `);
    return rows;
}

// Hàm getProductById không đổi (vì đã JOIN rồi)
export const getProductById = async (productId) => {
    const queryText = `
        SELECT 
            p.*, 
            cp.tasting_notes, 
            cp.acidity, 
            cp.body,
            cp.processing_method,
            cp.roast_level
        FROM 
            products p
        LEFT JOIN 
            coffee_profile cp ON p.product_id = cp.product_id
        WHERE 
            p.product_id = $1;
    `;
    const {rows} = await query(queryText, [productId]);
    return rows[0]; 
}

// 3. SỬA LẠI HÀM createProduct (dùng Transaction)
export const createProduct = async (productData) => {
    // Tách data product và profile
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url,
            tasting_notes, acidity, body, processing_method, roast_level } = productData;
    
    const client = await db.connect(); // Lấy 1 client từ pool

    try {
        await client.query('BEGIN'); // Bắt đầu transaction

        // 1. INSERT vào products
        const productQuery = `
            INSERT INTO products (name, category, origin, farm, website, expire_date, price_original, price_sell, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
        `;
        const productResult = await client.query(productQuery, 
            [name, category, origin, farm, website, expire_date, price_original, price_sell, image_url]);
        const newProduct = productResult.rows[0];

        // 2. INSERT vào coffee_profile
        const profileQuery = `
            INSERT INTO coffee_profile (product_id, tasting_notes, acidity, body, processing_method, roast_level)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(profileQuery, 
            [newProduct.product_id, tasting_notes, acidity, body, processing_method, roast_level]);

        await client.query('COMMIT'); // Hoàn tất transaction
        return newProduct;

    } catch (e) {
        await client.query('ROLLBACK'); // Hoàn tác nếu có lỗi
        console.error('Lỗi khi tạo sản phẩm (transaction):', e);
        throw e;
    } finally {
        client.release(); // Luôn trả client về pool
    }
}

// 4. SỬA LẠI HÀM updateProduct (dùng Transaction)
export const updateProduct = async (productData, productId) => {
    // Tách data
    const { name, category, origin, farm, website, expire_date, price_original, price_sell, image_url,
            tasting_notes, acidity, body, processing_method, roast_level } = productData;
    
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        // 1. UPDATE products
        const productQuery = `
            UPDATE products 
            SET name = $1, category = $2, origin = $3, farm = $4, website = $5, 
                expire_date = $6, price_original = $7, price_sell = $8, image_url = $9
            WHERE product_id = $10 
            RETURNING *
        `;
        const productResult = await client.query(productQuery, 
            [name, category, origin, farm, website, expire_date, price_original, price_sell, image_url, productId]);
        
        if (productResult.rowCount === 0) {
            throw new Error('Không tìm thấy sản phẩm để cập nhật');
        }

        // 2. UPDATE coffee_profile (dùng "UPSERT")
        // Nó sẽ thử INSERT, nếu product_id đã tồn tại (ON CONFLICT) thì nó sẽ UPDATE
        const profileQuery = `
            INSERT INTO coffee_profile (product_id, tasting_notes, acidity, body, processing_method, roast_level)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (product_id) 
            DO UPDATE SET
                tasting_notes = $2,
                acidity = $3,
                body = $4,
                processing_method = $5,
                roast_level = $6
        `;
        await client.query(profileQuery, 
            [productId, tasting_notes, acidity, body, processing_method, roast_level]);

        await client.query('COMMIT');
        return productResult.rows[0];

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Lỗi khi cập nhật sản phẩm (transaction):', e);
        throw e;
    } finally {
        client.release();
    }
}


// Hàm deleteProduct không đổi
export const deleteProduct = async (productId) => {
    // Xóa ở bảng products, bảng coffee_profile sẽ tự động xóa theo (ON DELETE CASCADE)
    const {rowCount} = await query( 'DELETE FROM products WHERE product_id = $1 RETURNING *', [productId] );
    return rowCount > 0;
}

// Hàm searchProducts không đổi
export const searchProducts = async (searchTerm) => {
    const { rows } = await query(
        // Cần JOIN để tìm kiếm cả trong profile nếu muốn, nhưng hiện tại giữ nguyên
        'SELECT p.*, cp.tasting_notes, cp.acidity, cp.body, cp.processing_method, cp.roast_level ' +
        'FROM products p ' +
        'LEFT JOIN coffee_profile cp ON p.product_id = cp.product_id ' +
        'WHERE p.name ILIKE $1 OR p.category ILIKE $1 OR p.origin ILIKE $1 ' +
        'ORDER BY p.product_id ASC',
        [`%${searchTerm}%`]
    );
    return rows;
}