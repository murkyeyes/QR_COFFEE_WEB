// src/components/TableList.jsx (Code ĐÃ SỬA LỖI)

import axios from "axios";
import { useEffect, useState } from "react";

export default function TableList({ handleOpen, searchTerm, refreshKey }) {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);

    const placeholderImage = 'https://placehold.co/100x100/5C3A2F/FFFFFF?text=No+Image';

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/products');
            
            // === SỬA LỖI 1: Đảm bảo 'sorted' luôn là một mảng ===
            const sorted = Array.isArray(response.data) ? response.data.sort((a, b) => a.product_id - b.product_id) : response.data;
            setTableData(sorted || []); // <-- THÊM "|| []" ĐỂ TRÁNH BỊ NULL
            // ==================================================

        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:3000/api/products/${id}`);
            setTableData(prevData => prevData.filter(product => product.product_id !== id));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting product:', err);
        }
    };

    // === SỬA LỖI 2: Đảm bảo 'searchTerm' không bị undefined === 
    const filteredData = tableData.filter(product =>
        // THÊM "(searchTerm || '')" để tránh lỗi'toLowerCase'
        product.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
        (product.origin && product.origin.toLowerCase().includes((searchTerm || '').toLowerCase()))
    );
    // =======================================================

    return (
        <>
        {/* ... (phần <thead> ... <tbody> của bạn không thay đổi) ... */}
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <div className="overflow-x-auto mt-10">
            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Ảnh</th> 
                    <th>Name</th>
                    <th>Category</th>
                    <th>Origin</th>
                    <th>Price (Sell)</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {filteredData.map((product) => (
                        <tr key={product.product_id} className="hover">
                            <th>{product.product_id}</th>
                            <td>
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <img 
                                            src={product.image_url || placeholderImage} 
                                            alt={product.name} 
                                            onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage; }}
                                        />
                                    </div>
                                </div>
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.origin}</td>
                            <td>{Number(product.price_sell).toLocaleString('vi-VN')} VNĐ</td>
                            <td>
                                <button className="btn btn-secondary " onClick={() => handleOpen('edit', product)}>Update</button>
                            </td>
                            <td>
                                <button className="btn btn-accent" onClick={() => handleDelete(product.product_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            </div>
        </>
    )
}