# 🚀 HƯỚNG DẪN SETUP DỰ ÁN COFFEE QR

## 📋 YÊU CẦU HỆ THỐNG

- **Node.js** >= 16.x
- **PostgreSQL** >= 12.x
- **pgAdmin** (hoặc bất kỳ PostgreSQL client nào)
- **Git** (để clone project)

---

## 📦 BƯỚC 1: SETUP DATABASE

### 1.1. Tạo Database trong PostgreSQL

Mở **pgAdmin** hoặc sử dụng **psql**:

```sql
CREATE DATABASE coffee_qr;
```

### 1.2. Chạy Script Tạo Database

1. Mở **pgAdmin** → Kết nối đến database `coffee_qr`
2. Mở **Query Tool** (Tools → Query Tool)
3. Copy toàn bộ nội dung file `DB_COFFEE_COMPLETE.sql`
4. Paste vào Query Tool và nhấn **Execute/Run** (F5)

✅ **Kết quả:** Database sẽ có sẵn:
- 10 tables (product, variety, farm, batch, coffee_profile, qrcode, price_history, users...)
- 5 varieties: Robusta, Arabica, Liberica, Excelsa, Kopi Luwak
- 4 farms: Trung Nguyên, Cầu Đất, VN Coffee, Mít Coffee
- 5 batches với đầy đủ thông tin
- 6 QR codes
- 2 tài khoản: `admin/12345`, `manager/12345`

---

## 🔧 BƯỚC 2: SETUP BACKEND

### 2.1. Cấu hình Database Connection

1. Mở file `crud-backend/.env`
2. Cập nhật thông tin kết nối database:

```env
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=coffee_qr
PG_PASSWORD=your_password_here
PG_PORT=5432
```

> ⚠️ **Lưu ý:** Thay `your_password_here` bằng password PostgreSQL của bạn

### 2.2. Cài đặt Dependencies

Mở **PowerShell** hoặc **Terminal**, di chuyển vào thư mục backend:

```powershell
cd crud-backend
npm install
```

### 2.3. Chạy Backend Server

```powershell
npm run dev
```

✅ **Kết quả:** Server chạy tại `http://localhost:3000`

**API Endpoints:**
- `POST /api/login` - Đăng nhập
- `GET /api/batches` - Lấy danh sách batches
- `POST /api/batches` - Thêm batch mới
- `PUT /api/batches/:id` - Cập nhật batch
- `DELETE /api/batches/:id` - Xóa batch
- `GET /api/reference/varieties` - Lấy danh sách varieties
- `GET /api/reference/farms` - Lấy danh sách farms
- `GET /api/reference/processing-methods` - Lấy processing methods
- `GET /api/reference/roast-levels` - Lấy roast levels

---

## 🎨 BƯỚC 3: SETUP FRONTEND

### 3.1. Cài đặt Dependencies

Mở terminal mới, di chuyển vào thư mục frontend:

```powershell
cd crud-frontend
npm install
```

### 3.2. Chạy Frontend Server

```powershell
npm run dev
```

✅ **Kết quả:** Frontend chạy tại `http://localhost:5173`

---

## 🧪 BƯỚC 4: TEST HỆ THỐNG

### 4.1. Đăng nhập Admin

1. Mở trình duyệt: `http://localhost:5173`
2. Đăng nhập với:
   - **Username:** `admin`
   - **Password:** `12345`

### 4.2. Kiểm tra các chức năng

✅ **Xem danh sách batches**
- Bạn sẽ thấy 5 batches mẫu hiển thị trong bảng
- Các cột: Batch ID, Giống cà phê, Trang trại, Vùng, Phương pháp, Mức rang, Ngày thu hoạch, HSD, Giá bán

✅ **Thêm batch mới**
- Click nút "Add Product"
- Điền thông tin:
  - Chọn giống cà phê từ dropdown (hoặc nhấn + để thêm mới)
  - Chọn farm từ dropdown (hoặc nhấn + để thêm mới)
  - Chọn processing method
  - Chọn roast level
  - Nhập ngày thu hoạch, rang, hạn sử dụng
  - Nhập thông tin tasting notes, acidity, body, sweetness, aftertaste
  - Nhập giá gốc và giá bán
- Click "Submit"

✅ **Cập nhật batch**
- Click nút "Update" trên batch bất kỳ
- Sửa thông tin
- Click "Submit"

✅ **Xóa batch**
- Click nút "Delete"
- Xác nhận xóa

✅ **Tìm kiếm batch**
- Gõ từ khóa vào ô "Tìm kiếm sản phẩm..."
- Hệ thống tự động lọc theo: tên giống, tên farm, vùng, phương pháp

✅ **Quét QR Code**
- Click nút "QR Scanner"
- Cho phép quyền truy cập camera
- Quét mã QR có sẵn:
  - `QR-COFFEE-ROB-20251115-0001` (Robusta)
  - `QR-COFFEE-ARA-20251015-0001` (Arabica)
  - `QR-COFFEE-KOP-20250801-0001` (Kopi Luwak)

---

## 📊 CẤU TRÚC DATABASE

### Tables:
```
coffee.product             → Dòng sản phẩm (Coffee)
coffee.variety             → Giống cà phê (Robusta, Arabica...)
coffee.farm                → Trang trại cung cấp
coffee.processing_method   → Phương pháp chế biến (Washed, Natural...)
coffee.roast_level         → Mức độ rang (Light, Medium, Dark)
coffee.batch               → Lô sản phẩm (kết nối variety + farm + method + level)
coffee.coffee_profile      → Hồ sơ hương vị (tasting notes, acidity, body...)
coffee.qrcode              → Mã QR cho từng batch
coffee.price_history       → Lịch sử giá (original, selling, promo)
coffee.users               → Tài khoản admin/manager
```

### Views:
```
coffee.v_qr_public         → View công khai để tra cứu QR (JOIN toàn bộ thông tin)
```

---

## 🐛 TROUBLESHOOTING

### ❌ Backend không kết nối được database

**Lỗi:** `Error: connect ECONNREFUSED` hoặc `password authentication failed`

**Giải pháp:**
1. Kiểm tra PostgreSQL đã chạy chưa (Services → PostgreSQL)
2. Kiểm tra file `.env` có đúng password không
3. Kiểm tra port 5432 có bị block không

### ❌ Frontend không gọi được API

**Lỗi:** `Network Error` hoặc `CORS error`

**Giải pháp:**
1. Kiểm tra backend đã chạy tại `http://localhost:3000`
2. Kiểm tra CORS đã được enable trong `index.js`

### ❌ Lỗi khi Insert batch

**Lỗi:** `Foreign key violation`

**Giải pháp:**
1. Đảm bảo đã chạy `DB_COFFEE_COMPLETE.sql` để có dữ liệu varieties, farms, methods, levels
2. Kiểm tra variety_id, farm_id có tồn tại trong database không

### ❌ QR Scanner không hoạt động

**Lỗi:** `Camera not found` hoặc `Permission denied`

**Giải pháp:**
1. Cho phép quyền truy cập camera trong trình duyệt
2. Sử dụng HTTPS hoặc localhost (HTTP chỉ hoạt động trên localhost)
3. Kiểm tra camera có được kết nối không

---

## 📝 LƯU Ý

### Tài khoản mặc định:
- **Admin:** `admin/12345`
- **Manager:** `manager/12345`

> ⚠️ **Bảo mật:** Đổi password trong production!

### Port mặc định:
- **Backend:** `3000`
- **Frontend:** `5173`
- **PostgreSQL:** `5432`

### Dữ liệu mẫu:
- Tất cả dữ liệu mẫu được tạo sẵn khi chạy `DB_COFFEE_COMPLETE.sql`
- Bạn có thể thêm/sửa/xóa dữ liệu qua Admin Panel

---

## 🎉 HOÀN TẤT!

Hệ thống đã sẵn sàng sử dụng! 🚀

**Liên hệ hỗ trợ:**
- Email: admin@coffee.vn
- GitHub: [Link repository]

---

**Copyright © 2025 Coffee QR System**
