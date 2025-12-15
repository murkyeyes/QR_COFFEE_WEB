import { query } from "../db.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
    const { username, password } = req.body; 

    try {
        // 1. Tìm user trong database
        const { rows } = await query('SELECT * FROM coffee.users WHERE username = $1', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Tên đăng nhập không đúng!' });
        }
        
        const user = rows[0]; 

        // 2. So sánh password với bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        
        if (isPasswordValid) {
            res.status(200).json({ message: 'Đăng nhập thành công', role: user.role });
        } else {
            return res.status(401).json({ error: 'Mật khẩu không đúng!' });
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};