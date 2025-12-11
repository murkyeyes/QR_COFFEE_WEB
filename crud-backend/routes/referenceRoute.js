import express from 'express';
import * as referenceController from '../controllers/referenceController.js';

const router = express.Router();

// GET endpoints
router.get('/varieties', referenceController.getVarieties);
router.get('/farms', referenceController.getFarms);
router.get('/processing-methods', referenceController.getProcessingMethods);
router.get('/roast-levels', referenceController.getRoastLevels);

// POST endpoints
router.post('/varieties', referenceController.createVariety);
router.post('/farms', referenceController.createFarm);
router.post('/processing-methods', referenceController.createProcessingMethod);
router.post('/roast-levels', referenceController.createRoastLevel);

export default router;
