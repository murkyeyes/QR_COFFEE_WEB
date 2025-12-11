import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import 2 component mới
import Header from './Header.jsx';
import ProductCard from './ProductCard.jsx';

// Chúng ta dùng nền màu, không cần biến heroImage

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tải danh sách sản phẩm từ backend
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/api/products')
      .then(response => {
        setProducts(response.data.slice(0, 3)); // Chỉ lấy 3 sản phẩm
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      {/* 1. Header mới */}
      <Header />

      {/* 2. Hero Banner (Dùng nền màu 'bg-neutral') */}
      <div 
        className="hero h-[500px] bg-neutral"
      >
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            {/* Logo của bạn */}
            <img 
              src="/Logo-coffee.jpg" 
              alt="Coffee Logo" 
              className="w-40 h-auto mx-auto mb-6 bg-white rounded-full p-2 shadow-lg" 
            />
            <h1 className="mb-5 text-5xl font-bold">Truy xuất Nguồn gốc Cà phê</h1>
            <p className="mb-5">Quét mã QR trên bao bì để xem toàn bộ thông tin về hạt cà phê của bạn, từ nông trại đến ly cà phê.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/scan')}
            >
              Quét mã QR ngay
            </button>
          </div>
        </div>
      </div>

      {/* 3. Phần sản phẩm nổi bật */}
      <div id="products-section" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Sản phẩm nổi bật
        </h2>
        
        {loading ? (
          <div className="text-center">Đang tải sản phẩm...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}

        {/* 4. NÚT "XEM TẤT CẢ" */}
        <div className="text-center mt-12">
          <button 
            className="btn btn-primary btn-outline"
            onClick={() => navigate('/products')}
          >
            Xem tất cả sản phẩm
          </button>
        </div>

      </div>

      {/* 5. Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © 2025 - All right reserved by Khải Phạm và Huy Trần</p>
        </div>
      </footer>
    </div>
  );
}