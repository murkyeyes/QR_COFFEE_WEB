import { query } from "../db.js";

export const login = async (req, res) => {
    // 'password' là chuỗi '12345' bạn nhập từ web
    const { username, password } = req.body; 

    try {
        // 1. Tìm user 'admin'
        const { rows } = await query('SELECT * FROM users WHERE username = $1', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Tên đăng nhập không đúng!' });
        }
        
        const user = rows[0]; 
        // user.password_hash bây giờ là chuỗi '12345' (từ database)

        // 2. So sánh chuỗi '12345' (từ web) với chuỗi '12345' (từ DB)
        if (password === user.password_hash) {
            
            // Khớp!
            res.status(200).json({ message: 'Đăng nhập thành công', role: user.role });

        } else {
            // Không khớp
            return res.status(401).json({ error: 'Mật khẩu không đúng!' });
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};