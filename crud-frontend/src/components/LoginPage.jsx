// src/components/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Xóa lỗi cũ
    
    try {
      // Gọi API backend
      const response = await axios.post('http://localhost:3000/api/login', { 
        username, 
        password 
      });
      
      // Đăng nhập thành công (backend trả về status 200)
      localStorage.setItem('isAdminLoggedIn', 'true'); // Đặt cờ
      localStorage.setItem('userRole', response.data.role); // Lưu role (admin hoặc manager)
      localStorage.setItem('username', username); // Lưu username
      navigate('/admin'); // Chuyển hướng đến trang quản trị

    } catch (err) {
      // Đăng nhập thất bại (backend trả về lỗi 401 hoặc 500)
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Lấy thông báo lỗi từ backend
      } else {
        setError('Không thể kết nối đến server.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="card-title text-2xl justify-center">Đăng nhập Admin</h2>
          
          {/* Báo lỗi */}
          {error && (
            <div role="alert" className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tên đăng nhập</span>
            </label>
            <input 
              type="text" 
              placeholder="admin" 
              className="input input-bordered" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Mật khẩu</span>
            </label>
            <input 
              type="password" 
              placeholder="12345" 
              className="input input-bordered" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">Đăng nhập</button>
          </div>
          <div className="text-center mt-2">
            <a 
              href="#" 
              onClick={() => navigate('/')} 
              className="label-text-alt link link-hover"
            >
              Quay về trang chủ
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}