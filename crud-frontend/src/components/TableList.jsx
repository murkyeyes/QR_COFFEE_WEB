import axios from "axios";
import { useEffect, useState } from "react";

export default function TableList({ handleOpen, searchTerm, refreshKey }) {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/batches');
            const sorted = Array.isArray(response.data) 
                ? response.data.sort((a, b) => b.batch_id - a.batch_id) 
                : [];
            setTableData(sorted);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching batches:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc muốn xóa lô sản phẩm này?');
        if (!confirmDelete) return;
        try {
            await axios.delete(`http://localhost:3000/api/batches/${id}`);
            setTableData(prevData => prevData.filter(batch => batch.batch_id !== id));
        } catch (err) {
            setError(err.message);
            console.error('Error deleting batch:', err);
        }
    };

    const filteredData = tableData.filter(batch =>
        (batch.variety_name && batch.variety_name.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
        (batch.farm_name && batch.farm_name.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
        (batch.farm_region && batch.farm_region.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
        (batch.processing_method && batch.processing_method.toLowerCase().includes((searchTerm || '').toLowerCase()))
    );

    return (
        <>
        {/* ... (phần <thead> ... <tbody> của bạn không thay đổi) ... */}
        {error && <div className="alert alert-error mb-4">{error}</div>}
        <div className="overflow-x-auto mt-10">
            <table className="table table-zebra">
                <thead>
                <tr>
                    <th>Batch ID</th>
                    <th>Giống cà phê</th>
                    <th>Trang trại</th>
                    <th>Vùng</th>
                    <th>Phương pháp</th>
                    <th>Mức rang</th>
                    <th>Ngày thu hoạch</th>
                    <th>HSD</th>
                    <th>Giá bán</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {filteredData.map((batch) => (
                        <tr key={batch.batch_id} className="hover">
                            <th>{batch.batch_id}</th>
                            <td><strong>{batch.variety_name}</strong></td>
                            <td>{batch.farm_name}</td>
                            <td>{batch.farm_region || '-'}</td>
                            <td><span className="badge badge-sm">{batch.processing_method || '-'}</span></td>
                            <td><span className="badge badge-sm badge-neutral">{batch.roast_level || '-'}</span></td>
                            <td>{batch.harvest_date ? new Date(batch.harvest_date).toLocaleDateString('vi-VN') : '-'}</td>
                            <td>{batch.expiry_date ? new Date(batch.expiry_date).toLocaleDateString('vi-VN') : '-'}</td>
                            <td>{batch.price_sell ? Number(batch.price_sell).toLocaleString('vi-VN') + ' VNĐ' : '-'}</td>
                            <td>
                                <button className="btn btn-sm btn-secondary" onClick={() => handleOpen('edit', batch)}>
                                    Update
                                </button>
                            </td>
                            <td>
                                <button className="btn btn-sm btn-accent" onClick={() => handleDelete(batch.batch_id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </>
    )
}