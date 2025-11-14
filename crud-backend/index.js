// index.js
import express from 'express';
import cors from 'cors'; 
import productRoutes from './routes/productRoute.js';
import authRoutes from './routes/authRoute.js'; // <-- 1. IMPORT FILE MỚI

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', authRoutes); // <-- 2. SỬ DỤNG FILE MỚI

app.listen(port, () => {
    console.log(`Server is running on port 3000`);
});