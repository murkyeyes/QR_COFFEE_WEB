import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetailPage() {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const placeholderImage = 'https://placehold.co/600x400/5C3A2F/FFFFFF?text=No+Image';

    useEffect(() => {
        axios.get(`http://localhost:3000/api/products/${id}`)
            .then(response => {
                console.log("ĐÃ NHẬN DỮ LIỆU TỪ API:", response.data); 
                setProduct(response.data);
            })
            .catch(err => {
                console.error("Error fetching product", err);
                setError(`Không tìm thấy sản phẩm với ID: ${id}`);
            });
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center text-center p-4">
                <div>
                    <h2 className="text-2xl text-error mb-4">{error}</h2>
                    <button className="btn btn-ghost" onClick={() => navigate('/scan')}>Quét lại</button>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div className="min-h-screen bg-base-200 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="card lg:card-side bg-base-100 shadow-xl max-w-4xl mx-auto">
                
                {/* Phần hình ảnh */}
                <figure className="lg:w-1/2 bg-gray-100">
                    <img 
                        src={product.image_url || placeholderImage} 
                        alt={product.name} 
                        className="w-full h-96 lg:h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                    />
                </figure>
                
                {/* Phần thông tin */}
                <div className="card-body lg:w-1/2">
                    <h1 className="card-title text-3xl lg:text-4xl font-bold">{product.name}</h1>
                    <p className="mt-2 text-lg"><span className="font-bold">Loại:</span> {product.category || 'N/A'}</p>
                    <p className="text-lg"><span className="font-bold">Xuất xứ:</span> {product.origin || 'N/A'}</p>
                    <p className="text-lg"><span className="font-bold">Nông trại:</span> {product.farm || 'N/A'}</p>
                    
                    {product.expire_date && (
                         <p className="text-lg"><span className="font-bold">Hạn sử dụng:</span> {new Date(product.expire_date).toLocaleDateString('vi-VN')}</p>
                    )}
                    
                    {product.website && (
                        <a href={product.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 link link-hover">
                            Xem website
                        </a>
                    )}
                    
                    {/* ===== ĐÂY LÀ PHẦN "COFFEE PROFILE" ===== */}
                    {(product.tasting_notes || product.roast_level) && (
                        <>
                            <div className="divider my-2">Hồ sơ hương vị</div>
                            <ul className="list-disc list-inside">
                                {product.roast_level && <li><span className="font-bold">Mức rang:</span> {product.roast_level}</li>}
                                {product.tasting_notes && <li><span className="font-bold">Hương vị:</span> {product.tasting_notes}</li>}
                                {product.acidity && <li><span className="font-bold">Độ chua:</span> {product.acidity}</li>}
                                {product.body && <li><span className="font-bold">Độ đậm:</span> {product.body}</li>}
                                {product.processing_method && <li><span className="font-bold">Sơ chế:</span> {product.processing_method}</li>}
                            </ul>
                        </>
                    )}
                    {/* =========================================== */}

                    <div className="divider my-4"></div>

                    {/* Phần giá bán và nút */}
                    <p className="text-4xl font-bold text-primary">
                        {Number(product.price_sell).toLocaleString('vi-VN')} VNĐ
                    </p>
                    {/* {product.price_original > 0 && (
                        <p className="line-through text-gray-500">
                            Giá gốc: {Number(product.price_original).toLocaleString('vi-VN')} VNĐ
                        </p>
                    )} */}

                    <div className="card-actions justify-end mt-6">
                        <button 
                            className="btn btn-ghost" 
                            onClick={() => navigate('/scan')}
                        >
                            Quét mã khác
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}