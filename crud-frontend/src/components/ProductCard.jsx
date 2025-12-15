import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const placeholderImage = 'https://placehold.co/300x300/5C3A2F/FFFFFF?text=No+Image';

  const handleViewDetails = () => {
    navigate(`/product/${product.batch_id}`);
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl transition-transform hover:scale-105">
      <figure className="px-4 pt-4">
        <img
          src={product.image_url || placeholderImage}
          alt={product.variety_name || 'Coffee'}
          className="rounded-xl h-48 w-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title h-14 overflow-hidden">{product.variety_name}</h2>
        <p className="text-sm text-gray-600">{product.farm_name} - {product.farm_region}</p>
        <p className="text-lg font-bold text-primary">
          {product.price_sell ? Number(product.price_sell).toLocaleString('vi-VN') + ' VNĐ' : 'Liên hệ'}
        </p>
        <div className="card-actions">
          <button 
            className="btn btn-primary"
            onClick={handleViewDetails}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}