import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';

const qrcodeRegionId = "qr-scanner-region";

function ScannerPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Hàm quét thành công
    const onScanSuccess = (decodedText, decodedResult) => {
      console.log(`Scan result: ${decodedText}`);
      
      // === VIỆC DUY NHẤT: CHUYỂN TRANG ===
      // Tự động dừng camera khi chuyển trang
      navigate(`/product/${decodedText}`);
    };

    // Hàm quét thất bại (bỏ qua)
    const onScanFailure = (error) => {
      // Bỏ qua
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    // Dọn dẹp
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear scanner.", error);
      });
    };
  }, [navigate]); // Chỉ chạy 1 lần

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl justify-center mb-4">
            Quét mã QR sản phẩm
          </h2>
          
          {/* Vùng hiển thị camera */}
          <div id={qrcodeRegionId} className="w-full" />

          <div className="card-actions justify-center mt-4">
             <button 
              className="btn btn-ghost"
              onClick={() => navigate('/')} // Về trang chủ
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScannerPage;