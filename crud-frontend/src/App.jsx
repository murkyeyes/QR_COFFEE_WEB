import { Routes, Route } from 'react-router-dom';

// Import các trang
import HomePage from './components/HomePage.jsx';
import ScannerPage from './components/ScannerPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import AdminPage from './AdminPage.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProductDetailPage from './components/ProductDetailPage.jsx';

// 1. IMPORT TRANG SẢN PHẨM MỚI
import ProductListPage from './components/ProductListPage.jsx';

function App() {
    
  return (
    <div>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />
        
        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />

        {/* Trang quét của khách */}
        <Route path="/scan" element={<ScannerPage />} />

        {/* Trang chi tiết (khi bấm vào 1 sản phẩm) */}
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* 2. THÊM ROUTE MỚI CHO TRANG DANH SÁCH SẢN PHẨM */}
        <Route path="/products" element={<ProductListPage />} />

        {/* Trang Admin (ĐƯỢC BẢO VỆ) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;