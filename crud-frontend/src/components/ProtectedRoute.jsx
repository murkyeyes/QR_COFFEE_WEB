// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Kiểm tra cờ trong localStorage
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn');

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, "đá" về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép hiển thị trang Admin
  return children;
}