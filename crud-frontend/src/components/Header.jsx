import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        {/* Logo của bạn (từ /public/Logo-coffee.jpg) */}
        <a className="btn btn-ghost" onClick={() => navigate('/')}>
          <img src="/Logo-coffee.jpg" alt="Coffee Logo" className="h-8 w-auto" />
          <span className="ml-2 text-xl font-bold hidden sm:inline">Coffee Trace</span>
        </a>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a onClick={() => navigate('/')}>Trang chủ</a></li>
          
          {/* SỬA LẠI LINK NÀY */}
          <li><a onClick={() => navigate('/products')}>Sản phẩm</a></li>
          
          <li><a onClick={() => navigate('/scan')}>Quét QR</a></li>
        </ul>
      </div>

      <div className="navbar-end">
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/login')}
        >
          Đăng nhập Quản lý
        </button>
      </div>
    </div>
  );
}