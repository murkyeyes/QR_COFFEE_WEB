// src/AdminPage.jsx (Code KHÔI PHỤC)

import './App.css'
import Navbar from './components/Navbar'
import TableList from './components/TableList' // Import file "con"
import ModalForm from './components/ModalForm';
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

  const handleSubmit = async (newProductData) => {
    if (modalMode === 'add') {
      try {
        const response = await axios.post('http://localhost:3000/api/products', newProductData);
        setRefreshKey(k => k + 1);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      try {
        const id = clientData?.product_id; 
        if (!id) throw new Error('Missing product id for edit');
        const response = await axios.put(`http://localhost:3000/api/products/${id}`, newProductData);
        setRefreshKey(k => k + 1);
      } catch (err) {
        console.error('Error editing product:', err);
      }
    }
    setIsOpen(false);
  };

  const handleScanSuccess = async (productId) => {
    setIsScannerOpen(false); 
    try {
      const response = await axios.get(`http://localhost:3000/api/products/${productId}`);
      handleOpen('edit', response.data); 
    } catch (err) {
      console.error('Error fetching scanned product:', err);
      alert(`Error: Product with ID ${productId} not found!`);
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

      <ModalForm 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={modalMode}
        productData={clientData} 
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