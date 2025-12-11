import * as referenceService from "../services/referenceService.js";

// GET reference data (varieties, farms, methods, levels)
export const getVarieties = async (req, res) => {
    try {
        const varieties = await referenceService.getVarieties();
        res.status(200).json(varieties);
    } catch (error) {
        console.error('Error fetching varieties:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getFarms = async (req, res) => {
    try {
        const farms = await referenceService.getFarms();
        res.status(200).json(farms);
    } catch (error) {
        console.error('Error fetching farms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getProcessingMethods = async (req, res) => {
    try {
        const methods = await referenceService.getProcessingMethods();
        res.status(200).json(methods);
    } catch (error) {
        console.error('Error fetching processing methods:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getRoastLevels = async (req, res) => {
    try {
        const levels = await referenceService.getRoastLevels();
        res.status(200).json(levels);
    } catch (error) {
        console.error('Error fetching roast levels:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// CREATE reference data
export const createVariety = async (req, res) => {
    try {
        const variety = await referenceService.createVariety(req.body);
        res.status(201).json(variety);
    } catch (error) {
        console.error('Error creating variety:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createFarm = async (req, res) => {
    try {
        const farm = await referenceService.createFarm(req.body);
        res.status(201).json(farm);
    } catch (error) {
        console.error('Error creating farm:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createProcessingMethod = async (req, res) => {
    try {
        const method = await referenceService.createProcessingMethod(req.body);
        res.status(201).json(method);
    } catch (error) {
        console.error('Error creating processing method:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createRoastLevel = async (req, res) => {
    try {
        const level = await referenceService.createRoastLevel(req.body);
        res.status(201).json(level);
    } catch (error) {
        console.error('Error creating roast level:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
