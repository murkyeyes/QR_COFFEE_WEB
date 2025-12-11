import express from 'express';
import * as batchController from '../controllers/batchController.js';

const router = express.Router();

router.get('/', batchController.getBatches);
router.get('/search', batchController.searchBatches);
router.get('/:id', batchController.getBatchById);
router.post('/', batchController.createBatch);
router.put('/:id', batchController.updateBatch);
router.delete('/:id', batchController.deleteBatch);

export default router;
