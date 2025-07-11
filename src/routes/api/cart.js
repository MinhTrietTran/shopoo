const express = require('express');
const router = express.Router();

// Cart API endpoints - sẽ implement sau khi có controllers

// GET /api/cart - Lấy giỏ hàng
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API chưa được implement',
    data: {
      items: [],
      totalItems: 0,
      totalAmount: 0
    }
  });
});

// POST /api/cart/add - Thêm sản phẩm vào giỏ hàng
router.post('/add', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// PUT /api/cart/update - Cập nhật số lượng trong giỏ hàng
router.put('/update', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// DELETE /api/cart/remove/:productId - Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove/:productId', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// DELETE /api/cart/clear - Xóa toàn bộ giỏ hàng
router.delete('/clear', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

module.exports = router;
