import pg from 'pg';
import env from 'dotenv';  

env.config(); 

// 1. THAY THẾ pg.Client bằng pg.Pool
const db = new pg.Pool({
     user: process.env.PG_USER,
     host: process.env.PG_HOST,
     database: process.env.PG_DATABASE,
     password: process.env.PG_PASSWORD, 
     port: process.env.PG_PORT, 
     // Thêm các cài đặt pool (tùy chọn nhưng nên có)
     max: 20, // Tối đa 20 kết nối
     idleTimeoutMillis: 30000, // 30 giây
     connectionTimeoutMillis: 2000, // 2 giây
});

db.on('error', (err) => {
    console.error('Lỗi Pool DB không mong muốn', err);
    process.exit(-1);
    }
);

// 2. EXPORT cả hàm query và pool client
export const query = (text, params) => db.query(text, params);
export default db; // <-- Export pool để dùng cho transaction