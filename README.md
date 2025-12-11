# **Hệ thống Quản lý Cà phê & Quét QR**

Đây là một dự án full-stack CRUD (Tạo, Đọc, Cập nhật, Xóa) quản lý sản phẩm cà phê.  
Dự án được xây dựng với React cho Frontend và Node.js/Express/PostgreSQL cho Backend.

## **Tính năng chính**

* **Trang chủ:** Cho phép người dùng chọn vai trò (Khách hàng hoặc Quản trị viên).  
* **Trang Khách hàng (/scan):**  
  * Chỉ hiển thị camera để quét mã QR.  
  * Sau khi quét, tự động chuyển hướng đến trang chi tiết sản phẩm (/product/:id).  
* **Trang Quản trị viên (/admin):**  
  * Được bảo vệ bằng trang đăng nhập (Tài khoản: admin / Mật khẩu: 12345).  
  * Hiển thị, Thêm, Sửa, Xóa sản phẩm.  
  * Tích hợp tính năng quét QR để tìm và sửa sản phẩm.  
* **API Backend:** Cung cấp đầy đủ các endpoint RESTful cho việc quản lý sản phẩm.

## **💻 Công nghệ sử dụng**

* **Frontend:**  
  * React (với Vite)  
  * Tailwind CSS  
  * DaisyUI (với theme coffee)  
  * react-router-dom (để điều hướng)  
  * axios (để gọi API)  
  * html5-qrcode (để quét mã QR)  
* **Backend:**  
  * Node.js  
  * Express.js  
  * pg (node-postgres)  
* **Database:**  
  * PostgreSQL

## **🚀 Hướng dẫn Cài đặt & Khởi chạy**

### **1\. Yêu cầu**

* [Node.js](https://nodejs.org/) (phiên bản v18+)  
* [PostgreSQL](https://www.postgresql.org/download/) đã được cài đặt và đang chạy.

### **2\. Cài đặt Database (PostgreSQL)**

1. Mở **pgAdmin** (hoặc psql).  
2. Tạo một database mới với tên là coffee\_db.  
3. Mở **Query Tool** (công cụ truy vấn) cho coffee\_db.  
4. Copy và dán toàn bộ nội dung của file SQL (bắt đầu bằng DROP TABLE...) vào và thực thi để tạo bảng (products, coffee_profile, users) và thêm dữ liệu mẫu.

### **3\. Cài đặt Backend (Terminal 1\)**

1. Mở một terminal mới và di chuyển vào thư mục backend:  
   cd crud-backend

2. Cài đặt các gói phụ thuộc:  
   npm install

3. *Lưu ý: Đảm bảo thông tin kết nối database (password, port) trong file db.js là chính xác.*

### **4\. Cài đặt Frontend (Terminal 2\)**

1. Mở một terminal **thứ hai** và di chuyển vào thư mục frontend:  
   cd crud-frontend

2. Cài đặt các gói phụ thuộc (bao gồm react-router-dom):  
   npm install

## **🏃 Khởi chạy Ứng dụng**

Bạn cần chạy **cả hai terminal** cùng một lúc.

### **Terminal 1: Chạy Backend**

Di chuyển đúng vào thư mục crud-backend và chạy:

npx nodemon index.js

ℹ️ Server backend sẽ chạy tại: http://localhost:3000

### **Terminal 2: Chạy Frontend**

Di chuyển đúng vào thư mục crud-frontend-v1 và chạy:

npm run dev

ℹ️ Ứng dụng frontend sẽ tự động mở và chạy tại: http://localhost:5173 (hoặc một cổng khác do Vite chọn).

## **🔐 Tài khoản Đăng nhập**

Sử dụng tài khoản này để truy cập trang /admin:

* **Tên đăng nhập:** admin  
* **Mật khẩu:** 12345