import * as batchService from "../services/batchService.js";

export const getBatches = async (req, res) => {
    try {
        const batches = await batchService.getBatches();
        res.status(200).json(batches);
    } catch (error) {
        console.error('Error fetching batches:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getBatchById = async (req, res) => {
    try {
        const batchId = req.params.id;
        const batch = await batchService.getBatchById(batchId);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        res.status(200).json(batch);
    } catch (error) {
        console.error('Error fetching batch by id:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createBatch = async (req, res) => {
    try {
        const batchData = req.body;
        const newBatch = await batchService.createBatch(batchData);
        res.status(201).json(newBatch);
    } catch (error) {
        console.error('Error creating batch:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateBatch = async (req, res) => {
    try {
        const batchId = req.params.id;
        const batchData = req.body;
        const updatedBatch = await batchService.updateBatch(batchData, batchId);
        if (!updatedBatch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        res.status(200).json(updatedBatch);
    } catch (error) {
        console.error('Error updating batch:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteBatch = async (req, res) => {
    try {
        const batchId = req.params.id;
        const deleted = await batchService.deleteBatch(batchId);
        if (!deleted) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        res.status(200).json({ message: 'Batch deleted successfully' });
    } catch (error) {
        console.error('Error deleting batch:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const searchBatches = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const batches = await batchService.searchBatches(searchTerm);
        res.status(200).json(batches);
    } catch (error) {
        console.error('Error searching batches:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
