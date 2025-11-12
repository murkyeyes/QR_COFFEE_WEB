import express from 'express';
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.get('/products', productController.getProducts);
router.post('/products', productController.createProduct);
router.get('/products/search', productController.searchProduct); // Đặt search lên trước

// === THÊM ROUTE MỚI NÀY ===
router.get('/products/:id', productController.getProductById); 
// ==========================

router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

export default router;