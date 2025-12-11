import { query } from "../db.js";

// ========================================
// GET ALL BATCHES (với thông tin đầy đủ)
// ========================================
export const getBatches = async () => {
    const { rows } = await query(`
        SELECT 
            b.batch_id,
            b.harvest_date,
            b.roast_date,
            b.expiry_date,
            b.grade,
            b.altitude_m,
            b.weight_kg,
            b.certification_code,
            -- Variety info
            v.variety_id,
            v.name AS variety_name,
            v.species,
            -- Farm info
            f.farm_id,
            f.name AS farm_name,
            f.region AS farm_region,
            f.website AS farm_website,
            -- Processing method
            pm.method_id,
            pm.name AS processing_method,
            -- Roast level
            rl.level_id,
            rl.name AS roast_level,
            -- Coffee profile
            cp.profile_id,
            cp.tasting_notes,
            cp.acidity,
            cp.body,
            cp.sweetness,
            cp.aftertaste,
            cp.cupping_score,
            -- Price (latest selling price)
            ph.amount AS price_sell,
            ph_orig.amount AS price_original
        FROM coffee.batch b
        JOIN coffee.variety v ON v.variety_id = b.variety_id
        JOIN coffee.farm f ON f.farm_id = b.farm_id
        LEFT JOIN coffee.processing_method pm ON pm.method_id = b.method_id
        LEFT JOIN coffee.roast_level rl ON rl.level_id = b.level_id
        LEFT JOIN coffee.coffee_profile cp ON cp.batch_id = b.batch_id
        LEFT JOIN LATERAL (
            SELECT amount FROM coffee.price_history
            WHERE variety_id = v.variety_id AND price_type = 'selling'
            AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
            ORDER BY valid_from DESC LIMIT 1
        ) ph ON TRUE
        LEFT JOIN LATERAL (
            SELECT amount FROM coffee.price_history
            WHERE variety_id = v.variety_id AND price_type = 'original'
            AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
            ORDER BY valid_from DESC LIMIT 1
        ) ph_orig ON TRUE
        ORDER BY b.batch_id DESC
    `);
    return rows;
};

// ========================================
// GET ONE BATCH BY ID
// ========================================
export const getBatchById = async (batchId) => {
    const { rows } = await query(`
        SELECT 
            b.*,
            v.name AS variety_name,
            f.name AS farm_name,
            f.region AS farm_region,
            pm.name AS processing_method,
            rl.name AS roast_level,
            cp.*
        FROM coffee.batch b
        JOIN coffee.variety v ON v.variety_id = b.variety_id
        JOIN coffee.farm f ON f.farm_id = b.farm_id
        LEFT JOIN coffee.processing_method pm ON pm.method_id = b.method_id
        LEFT JOIN coffee.roast_level rl ON rl.level_id = b.level_id
        LEFT JOIN coffee.coffee_profile cp ON cp.batch_id = b.batch_id
        WHERE b.batch_id = $1
    `, [batchId]);
    return rows[0];
};

// ========================================
// CREATE NEW BATCH
// ========================================
export const createBatch = async (batchData) => {
    const {
        variety_id, farm_id, method_id, level_id,
        harvest_date, roast_date, expiry_date, grade,
        altitude_m, weight_kg, certification_code,
        // Coffee profile
        tasting_notes, acidity, body, sweetness, aftertaste, cupping_score,
        // Prices
        price_original, price_sell
    } = batchData;

    // Insert batch
    const { rows } = await query(`
        INSERT INTO coffee.batch 
        (variety_id, farm_id, method_id, level_id, harvest_date, roast_date, 
         expiry_date, grade, altitude_m, weight_kg, certification_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `, [
        variety_id, farm_id || null, method_id || null, level_id || null,
        harvest_date, roast_date || null, expiry_date, grade || null,
        altitude_m || null, weight_kg || null, certification_code || null
    ]);

    const newBatch = rows[0];

    // Insert coffee profile if data provided
    if (tasting_notes || acidity || body || sweetness || aftertaste || cupping_score) {
        await query(`
            INSERT INTO coffee.coffee_profile 
            (batch_id, tasting_notes, acidity, body, sweetness, aftertaste, cupping_score)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            newBatch.batch_id,
            tasting_notes || null,
            acidity || null,
            body || null,
            sweetness || null,
            aftertaste || null,
            cupping_score || null
        ]);
    }
    
    // Insert price history if provided
    const today = new Date().toISOString().split('T')[0];
    if (price_original) {
        await query(`
            INSERT INTO coffee.price_history (variety_id, price_type, currency, amount, valid_from)
            VALUES ($1, 'original', 'VND', $2, $3)
        `, [variety_id, price_original, today]);
    }
    if (price_sell) {
        await query(`
            INSERT INTO coffee.price_history (variety_id, price_type, currency, amount, valid_from)
            VALUES ($1, 'selling', 'VND', $2, $3)
        `, [variety_id, price_sell, today]);
    }

    return newBatch;
};

// ========================================
// UPDATE BATCH
// ========================================
export const updateBatch = async (batchData, batchId) => {
    const {
        variety_id, farm_id, method_id, level_id,
        harvest_date, roast_date, expiry_date, grade,
        altitude_m, weight_kg, certification_code,
        // Coffee profile
        tasting_notes, acidity, body, sweetness, aftertaste, cupping_score,
        // Prices
        price_original, price_sell
    } = batchData;

    // Update batch
    const { rows } = await query(`
        UPDATE coffee.batch
        SET variety_id = $1, farm_id = $2, method_id = $3, level_id = $4,
            harvest_date = $5, roast_date = $6, expiry_date = $7, grade = $8,
            altitude_m = $9, weight_kg = $10, certification_code = $11
        WHERE batch_id = $12
        RETURNING *
    `, [
        variety_id, farm_id || null, method_id || null, level_id || null,
        harvest_date, roast_date || null, expiry_date, grade || null,
        altitude_m || null, weight_kg || null, certification_code || null,
        batchId
    ]);

    // Update or insert coffee profile
    if (tasting_notes !== undefined || acidity !== undefined || body !== undefined ||
        sweetness !== undefined || aftertaste !== undefined || cupping_score !== undefined) {
        
        const existingProfile = await query(
            'SELECT profile_id FROM coffee.coffee_profile WHERE batch_id = $1',
            [batchId]
        );

        if (existingProfile.rows.length > 0) {
            // Update existing profile
            await query(`
                UPDATE coffee.coffee_profile
                SET tasting_notes = $1, acidity = $2, body = $3, 
                    sweetness = $4, aftertaste = $5, cupping_score = $6
                WHERE batch_id = $7
            `, [
                tasting_notes || null, acidity || null, body || null,
                sweetness || null, aftertaste || null, cupping_score || null,
                batchId
            ]);
        } else {
            // Insert new profile
            await query(`
                INSERT INTO coffee.coffee_profile 
                (batch_id, tasting_notes, acidity, body, sweetness, aftertaste, cupping_score)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                batchId,
                tasting_notes || null, acidity || null, body || null,
                sweetness || null, aftertaste || null, cupping_score || null
            ]);
        }
    }
    
    // Update price history if provided
    const today = new Date().toISOString().split('T')[0];
    if (price_original !== undefined && price_original !== null) {
        // Close old price and insert new
        await query(`
            UPDATE coffee.price_history 
            SET valid_to = $1 
            WHERE variety_id = $2 AND price_type = 'original' AND valid_to IS NULL
        `, [today, variety_id]);
        
        await query(`
            INSERT INTO coffee.price_history (variety_id, price_type, currency, amount, valid_from)
            VALUES ($1, 'original', 'VND', $2, $3)
        `, [variety_id, price_original, today]);
    }
    
    if (price_sell !== undefined && price_sell !== null) {
        await query(`
            UPDATE coffee.price_history 
            SET valid_to = $1 
            WHERE variety_id = $2 AND price_type = 'selling' AND valid_to IS NULL
        `, [today, variety_id]);
        
        await query(`
            INSERT INTO coffee.price_history (variety_id, price_type, currency, amount, valid_from)
            VALUES ($1, 'selling', 'VND', $2, $3)
        `, [variety_id, price_sell, today]);
    }

    return rows[0];
};

// ========================================
// DELETE BATCH
// ========================================
export const deleteBatch = async (batchId) => {
    const { rowCount } = await query(
        'DELETE FROM coffee.batch WHERE batch_id = $1',
        [batchId]
    );
    return rowCount > 0;
};

// ========================================
// SEARCH BATCHES
// ========================================
export const searchBatches = async (searchTerm) => {
    const { rows } = await query(`
        SELECT 
            b.batch_id,
            b.harvest_date,
            b.expiry_date,
            v.name AS variety_name,
            f.name AS farm_name,
            f.region AS farm_region,
            pm.name AS processing_method,
            rl.name AS roast_level
        FROM coffee.batch b
        JOIN coffee.variety v ON v.variety_id = b.variety_id
        JOIN coffee.farm f ON f.farm_id = b.farm_id
        LEFT JOIN coffee.processing_method pm ON pm.method_id = b.method_id
        LEFT JOIN coffee.roast_level rl ON rl.level_id = b.level_id
        WHERE 
            v.name ILIKE $1 OR 
            f.name ILIKE $1 OR 
            f.region ILIKE $1 OR
            pm.name ILIKE $1
        ORDER BY b.batch_id DESC
    `, [`%${searchTerm}%`]);
    return rows;
};
