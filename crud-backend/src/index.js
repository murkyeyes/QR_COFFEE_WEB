import express from 'express';
import cors from 'cors'; 
import productRoutes from './routes/productRoute.js'; // <-- THAY ĐỔI

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

app.use('/api', productRoutes); // <-- THAY ĐỔI

app.listen(port, () => {
    console.log(`Server is running on port 3000`);
});