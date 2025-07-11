const express = require('express');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  // Redirect if already logged in
  if (req.session.user) {
    return res.redirect('/');
  }
  
  res.render('pages/login', {
    title: 'Đăng nhập - Shopoo',
    user: null,
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// Register page
router.get('/register', (req, res) => {
  // Redirect if already logged in
  if (req.session.user) {
    return res.redirect('/');
  }
  
  res.render('pages/register', {
    title: 'Đăng ký - Shopoo',
    user: null,
    error: req.query.error || null,
    success: req.query.success || null
  });
});

// Profile page
router.get('/profile', (req, res) => {
  // Require authentication
  if (!req.session.user) {
    return res.redirect('/auth/login?error=Vui lòng đăng nhập để truy cập trang này');
  }
  
  res.render('pages/profile', {
    title: 'Tài khoản của tôi - Shopoo',
    user: req.session.user,
    activeTab: req.query.tab || 'info'
  });
});

// Orders page
router.get('/orders', (req, res) => {
  // Require authentication
  if (!req.session.user) {
    return res.redirect('/auth/login?error=Vui lòng đăng nhập để xem đơn hàng');
  }
  
  res.render('pages/orders', {
    title: 'Đơn hàng của tôi - Shopoo',
    user: req.session.user,
    orders: [] // Sẽ load từ database sau
  });
});

// Cart page
router.get('/cart', (req, res) => {
  res.render('pages/cart', {
    title: 'Giỏ hàng - Shopoo',
    user: req.session.user || null,
    cartItems: [] // Sẽ load từ database hoặc session sau
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.clearCookie('connect.sid');
    res.redirect('/?success=Đăng xuất thành công');
  });
});

module.exports = router;
