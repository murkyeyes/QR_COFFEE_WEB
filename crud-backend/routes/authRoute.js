// routes/authRoute.js
import express from 'express';
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Định nghĩa route POST /api/login
router.post('/login', authController.login);

export default router;