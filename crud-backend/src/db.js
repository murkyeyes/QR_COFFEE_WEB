import pg from 'pg';
import env from 'dotenv';  

env.config();

const db = new pg.Client({
     user: "postgres", // Thay vì process.env.PG_USER
    host: "localhost", // Thay vì process.env.PG_HOST
    database: "coffee_db", // Thay vì process.env.PG_NAME
    password: "Bleach2005", // Truyền mật khẩu trực tiếp
    port: 5432, // Thay vì process.env.PG_PORT
});
db.connect();

db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
    }
);

export const query = (text, params) => db.query(text, params);
