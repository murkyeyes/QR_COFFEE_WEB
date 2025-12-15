// src/components/ProductScanner.jsx

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

// Hàm này sẽ được gọi khi quét thành công
// Hàm này sẽ được gọi khi quét thất bại (bỏ qua)
const qrcodeRegionId = "qr-code-full-region";

const ProductScanner = (props) => {

    useEffect(() => {
        // Tạo scanner mới với cấu hình tối ưu CỰC MẠNH
        const html5QrcodeScanner = new Html5QrcodeScanner(
            qrcodeRegionId, 
            { 
                fps: 60, // Tăng lên 60 fps - cực nhanh
                qrbox: 250, // Để số nguyên thay vì object - hiệu năng tốt hơn
                aspectRatio: 1.0,
                disableFlip: false,
                rememberLastUsedCamera: true, // Nhớ camera đã chọn
                // Thêm cấu hình camera để ưu tiên camera sau (tốt hơn cho quét)
                videoConstraints: {
                    facingMode: { ideal: "environment" } // Ưu tiên camera sau
                },
                formatsToSupport: [0] // Chỉ QR code
            },
            /* verbose= */ false
        );

        // Hàm xử lý khi quét thành công
        const onScanSuccess = (decodedText, decodedResult) => {
            console.log("QR Scanned:", decodedText); // Debug
            html5QrcodeScanner.clear(); // Dừng camera
            props.onScanSuccess(decodedText);
        };
        
        // Render camera
        html5QrcodeScanner.render(onScanSuccess, (error) => {
            // Chỉ log lỗi nghiêm trọng, bỏ qua lỗi quét thường
            // console.warn("QR scan error:", error);
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