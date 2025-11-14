// src/components/ProductScanner.jsx

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

// Hàm này sẽ được gọi khi quét thành công
// Hàm này sẽ được gọi khi quét thất bại (bỏ qua)
const qrcodeRegionId = "qr-code-full-region";

const ProductScanner = (props) => {

    useEffect(() => {
        // Tạo scanner mới
        const html5QrcodeScanner = new Html5QrcodeScanner(
            qrcodeRegionId, 
            { 
                fps: 10, // Tốc độ quét
                qrbox: { width: 250, height: 250 } // Kích thước hộp quét
            },
            /* verbose= */ false
        );

        // Hàm xử lý khi quét thành công
        const onScanSuccess = (decodedText, decodedResult) => {
            // decodedText là kết quả (ví dụ: "1", "2", "3" - là product_id)
            html5QrcodeScanner.clear(); // Dừng camera
            props.onScanSuccess(decodedText); // Gửi kết quả về App.jsx
        };
        
        // Render camera
        html5QrcodeScanner.render(onScanSuccess, (error) => {
            // Bỏ qua lỗi, không làm gì cả
        });

        // Hàm dọn dẹp khi component unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner.", error);
            });
        };
    }, []);

    return (
        <div className="modal bg-black/40" open={props.isOpen}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Scan Product QR Code</h3>
                <div id={qrcodeRegionId} /> 
                <div className="modal-action">
                    <button className="btn" onClick={props.onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ProductScanner;