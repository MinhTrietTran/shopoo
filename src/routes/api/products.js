const express = require('express');
const router = express.Router();

// Products API endpoints - sẽ implement sau khi có controllers

// GET /api/products - Lấy danh sách sản phẩm
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API chưa được implement',
    data: {
      products: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      }
    }
  });
});

// GET /api/products/:id - Lấy chi tiết sản phẩm
router.get('/:id', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// POST /api/products - Tạo sản phẩm mới (Admin only)
router.post('/', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// PUT /api/products/:id - Cập nhật sản phẩm (Admin only)
router.put('/:id', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// DELETE /api/products/:id - Xóa sản phẩm (Admin only)
router.delete('/:id', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// GET /api/products/search - Tìm kiếm sản phẩm
router.get('/search', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

module.exports = router;
