

import './App.css'
import Navbar from './components/Navbar'
import TableList from './components/TableList'
import ModalFormBatch from './components/ModalFormBatch';
import { useState } from 'react';
import axios from 'axios';
import ProductScanner from './components/ProductScanner';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  // === STATE CHO MODAL VÀ BẢNG ===
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState(''); // <-- State 'searchTerm' nằm ở đây
  const [clientData, setClientData] = useState(null); 
  const [refreshKey, setRefreshKey] = useState(0);

  // === STATE CHO SCANNER ===
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  const navigate = useNavigate(); 

  const handleOpen = (mode, data = null) => {
    setModalMode(mode);
    setClientData(data);
    setIsOpen(true);
  };

  const handleSubmit = async (newBatchData) => {
    if (modalMode === 'add') {
      try {
        const response = await axios.post('http://localhost:3000/api/batches', newBatchData);
        setRefreshKey(k => k + 1);
      } catch (error) {
        console.error('Error adding batch:', error);
        alert('Lỗi khi thêm lô sản phẩm: ' + error.message);
      }
    } else {
      try {
        const id = clientData?.batch_id; 
        if (!id) throw new Error('Missing batch id for edit');
        const response = await axios.put(`http://localhost:3000/api/batches/${id}`, newBatchData);
        setRefreshKey(k => k + 1);
      } catch (err) {
        console.error('Error editing batch:', err);
        alert('Lỗi khi cập nhật lô sản phẩm: ' + err.message);
      }
    }
    setIsOpen(false);
  };

  const handleScanSuccess = async (batchId) => {
    setIsScannerOpen(false); 
    try {
      const response = await axios.get(`http://localhost:3000/api/batches/${batchId}`);
      handleOpen('edit', response.data); 
    } catch (err) {
      console.error('Error fetching scanned batch:', err);
      alert(`Error: Batch with ID ${batchId} not found!`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn'); 
    navigate('/login'); 
  };

  return (
    <>
    <div className="py-5 px-5 ">
      <Navbar 
        onOpen={() => handleOpen('add')} 
        onSearch={setSearchTerm} // <-- Truyền 'setSearchTerm'
        onScan={() => setIsScannerOpen(true)}
      />

      <div className="flex justify-end mt-4">
        <button onClick={handleLogout} className="btn btn-sm btn-outline btn-error">
          Đăng xuất Admin
        </button>
      </div>

      {/* Truyền 'searchTerm' vào TableList */}
      <TableList 
        handleOpen={handleOpen} 
        searchTerm={searchTerm} // <-- 'searchTerm' được truyền vào đây
        refreshKey={refreshKey} 
      />

      <ModalFormBatch 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={modalMode}
        batchData={clientData} 
        onSubmit={handleSubmit}
      />
      
      {isScannerOpen && (
        <ProductScanner 
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
    </>
  )
}

export default AdminPage;