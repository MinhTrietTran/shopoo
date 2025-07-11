const express = require('express');
const router = express.Router();

// Auth API endpoints - sẽ implement sau khi có controllers

// POST /api/auth/register - Đăng ký
router.post('/register', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// POST /api/auth/login - Đăng nhập
router.post('/login', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// POST /api/auth/logout - Đăng xuất
router.post('/logout', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// GET /api/auth/profile - Lấy thông tin profile
router.get('/profile', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

// PUT /api/auth/profile - Cập nhật profile
router.put('/profile', (req, res) => {
  res.json({
    success: false,
    message: 'API chưa được implement'
  });
});

module.exports = router;
