# API ENDPOINTS - Coffee Management System (Updated)

## Authentication
```
POST /api/login
- Body: { username, password }
- Table: coffee.users
```

## Batches (Lô sản phẩm)
```
GET    /api/batches          - Lấy tất cả batches
GET    /api/batches/:id      - Lấy 1 batch theo ID
POST   /api/batches          - Tạo batch mới
PUT    /api/batches/:id      - Cập nhật batch
DELETE /api/batches/:id      - Xóa batch
GET    /api/batches/search?q=... - Tìm kiếm batch

Tables used:
- coffee.batch
- coffee.variety
- coffee.farm
- coffee.processing_method
- coffee.roast_level
- coffee.coffee_profile
- coffee.price_history
```

## Reference Data (Dữ liệu tham chiếu)
```
GET  /api/reference/varieties          - Lấy danh sách giống cà phê
POST /api/reference/varieties          - Thêm giống mới
GET  /api/reference/farms              - Lấy danh sách trang trại
POST /api/reference/farms              - Thêm trang trại mới
GET  /api/reference/processing-methods - Lấy phương pháp chế biến
POST /api/reference/processing-methods - Thêm phương pháp mới
GET  /api/reference/roast-levels       - Lấy mức rang
POST /api/reference/roast-levels       - Thêm mức rang mới

Tables used:
- coffee.variety
- coffee.farm
- coffee.processing_method
- coffee.roast_level
```

## Deprecated (Không dùng nữa)
```
❌ /api/products/* - Đã thay thế bằng /api/batches
```

## Database Schema
All tables are in schema: `coffee`

Tables:
1. coffee.product
2. coffee.variety
3. coffee.farm
4. coffee.processing_method
5. coffee.roast_level
6. coffee.batch
7. coffee.coffee_profile
8. coffee.qrcode
9. coffee.price_history
10. coffee.users
