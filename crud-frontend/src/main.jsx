// src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'; // <-- 1. IMPORT

createRoot(document.getElementById('root')).render(
  // Tắt StrictMode nếu vẫn lỗi 2 camera
  // <StrictMode> 
    <BrowserRouter> {/* <-- 2. BỌC Ở ĐÂY */}
      <App />
    </BrowserRouter>
  // </StrictMode>,
)
