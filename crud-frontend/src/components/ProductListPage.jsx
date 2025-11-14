import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Header from './Header.jsx'; // Dùng lại Header
import ProductCard from './ProductCard.jsx'; // Dùng lại Thẻ Sản phẩm

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm này sẽ gọi API (hoặc tìm kiếm hoặc lấy tất cả)
  const fetchProducts = (query = '') => {
    setLoading(true);
    setError(null);

    // Quyết định URL: nếu có 'query' thì tìm kiếm, không thì lấy tất cả
    const url = query 
      ? `http://localhost:3000/api/products/search?q=${query}`
      : 'http://localhost:3000/api/products';

    axios.get(url)
      .then(response => {
        setProducts(response.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Tải tất cả sản phẩm khi trang được mở lần đầu
  useEffect(() => {
    fetchProducts(); 
  }, []);

  // Hàm xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    fetchProducts(searchTerm);
  };

  // Hàm xử lý khi gõ Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Hàm xóa tìm kiếm và tải lại tất cả
  const handleClearSearch = () => {
    setSearchTerm('');
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* 1. Header */}
      <Header />

      {/* 2. Tiêu đề và Thanh tìm kiếm */}
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Tất cả sản phẩm
        </h1>

        {/* Thanh tìm kiếm */}
        <div className="flex justify-center gap-2 mb-12">
          <input
            type="text"
            placeholder="Tìm theo tên, loại, xuất xứ..."
            className="input input-bordered w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Tìm kiếm
          </button>
          <button className="btn btn-ghost" onClick={handleClearSearch}>
            Xóa
          </button>
        </div>

        {/* 3. Lưới hiển thị sản phẩm */}
        {loading ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="text-center text-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center">Không tìm thấy sản phẩm nào.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-16">
        <div>
          <p>Copyright © 2025 - All right reserved by Coffee Trace</p>
        </div>
      </footer>
    </div>
  );
}