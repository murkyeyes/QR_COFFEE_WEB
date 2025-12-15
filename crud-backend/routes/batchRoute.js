import express from 'express';
import * as batchController from '../controllers/batchController.js';
import { checkPricePermission } from '../middleware/checkPermission.js';

const router = express.Router();

router.get('/', batchController.getBatches);
router.get('/search', batchController.searchBatches);
router.get('/:id', batchController.getBatchById);
router.post('/', checkPricePermission, batchController.createBatch);
router.put('/:id', checkPricePermission, batchController.updateBatch);
router.delete('/:id', batchController.deleteBatch);

export default router;
