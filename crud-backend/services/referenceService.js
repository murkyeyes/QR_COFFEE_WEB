import { query } from "../db.js";

// GET ALL VARIETIES
export const getVarieties = async () => {
    const { rows } = await query('SELECT * FROM coffee.variety ORDER BY variety_id ASC');
    return rows;
};

// GET ALL FARMS
export const getFarms = async () => {
    const { rows } = await query('SELECT * FROM coffee.farm ORDER BY farm_id ASC');
    return rows;
};

// GET ALL PROCESSING METHODS
export const getProcessingMethods = async () => {
    const { rows } = await query('SELECT * FROM coffee.processing_method ORDER BY method_id ASC');
    return rows;
};

// GET ALL ROAST LEVELS
export const getRoastLevels = async () => {
    const { rows } = await query('SELECT * FROM coffee.roast_level ORDER BY level_id ASC');
    return rows;
};

// CREATE VARIETY
export const createVariety = async (data) => {
    const { product_id = 1, name, species, characteristics, origin_country } = data;
    const { rows } = await query(
        `INSERT INTO coffee.variety (product_id, name, species, characteristics, origin_country)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [product_id, name, species || null, characteristics || null, origin_country || null]
    );
    return rows[0];
};

// CREATE FARM
export const createFarm = async (data) => {
    const { name, address, region, phone, website, certification } = data;
    const { rows } = await query(
        `INSERT INTO coffee.farm (name, address, region, phone, website, certification)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, address || null, region || null, phone || null, website || null, certification || null]
    );
    return rows[0];
};

// CREATE PROCESSING METHOD
export const createProcessingMethod = async (data) => {
    const { name, description } = data;
    const { rows } = await query(
        `INSERT INTO coffee.processing_method (name, description)
         VALUES ($1, $2) RETURNING *`,
        [name, description || null]
    );
    return rows[0];
};

// CREATE ROAST LEVEL
export const createRoastLevel = async (data) => {
    const { name, description, color_value } = data;
    const { rows } = await query(
        `INSERT INTO coffee.roast_level (name, description, color_value)
         VALUES ($1, $2, $3) RETURNING *`,
        [name, description || null, color_value || null]
    );
    return rows[0];
};
