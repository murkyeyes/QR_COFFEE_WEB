// index.js
import express from 'express';
import cors from 'cors'; 
// import productRoutes from './routes/productRoute.js'; // COMMENT: Không dùng nữa, đã chuyển sang batches
import authRoutes from './routes/authRoute.js';
import batchRoutes from './routes/batchRoute.js';
import referenceRoutes from './routes/referenceRoute.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// app.use('/api', productRoutes); // COMMENT: Không dùng nữa
app.use('/api', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/reference', referenceRoutes);

app.listen(port, () => {
    console.log(`Server is running on port 3000`);
});