// Middleware kiểm tra quyền sửa giá cho manager
export const checkPricePermission = (req, res, next) => {
    const userRole = req.headers['x-user-role']; // Frontend sẽ gửi role qua header
    const { price_original, price_sell } = req.body;
    
    // Nếu là manager và cố gắng sửa giá
    if (userRole === 'manager' && (price_original !== undefined || price_sell !== undefined)) {
        return res.status(403).json({ 
            error: '🚫 Bạn không có quyền thực hiện thao tác này!',
            details: 'Manager không được phép sửa đổi giá sản phẩm.\n\nVui lòng liên hệ Admin để thay đổi giá.' 
        });
    }
    
    next();
};
