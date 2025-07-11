const express = require('express');
const router = express.Router();

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/auth/login?error=Không có quyền truy cập');
  }
  next();
};

// Admin dashboard
router.get('/', requireAdmin, (req, res) => {
  res.render('admin/dashboard', {
    title: 'Dashboard - Admin Shopoo',
    user: req.session.user,
    activeMenu: 'dashboard',
    stats: {
      totalOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
      totalRevenue: 0
    }
  });
});

// Products management
router.get('/products', requireAdmin, (req, res) => {
  res.render('admin/products', {
    title: 'Quản lý sản phẩm - Admin Shopoo',
    user: req.session.user,
    activeMenu: 'products',
    products: [], // Sẽ load từ database sau
    currentPage: 1,
    totalPages: 1
  });
});

// Add/Edit product page
router.get('/products/add', requireAdmin, (req, res) => {
  res.render('admin/product-form', {
    title: 'Thêm sản phẩm - Admin Shopoo',
    user: req.session.user,
    activeMenu: 'products',
    product: null,
    categories: [], // Sẽ load từ database sau
    isEdit: false
  });
});

router.get('/products/edit/:id', requireAdmin, (req, res) => {
  const productId = req.params.id;
  
  res.render('admin/product-form', {
    title: 'Sửa sản phẩm - Admin Shopoo',
    user: req.session.user,
    activeMenu: 'products',
    product: null, // Sẽ load từ database sau
    categories: [],
    isEdit: true
  });
});

// Orders management
router.get('/orders', requireAdmin, (req, res) => {
  res.render('admin/orders', {
    title: 'Quản lý đơn hàng - Admin Shopoo',
    user: req.session.user,
    activeMenu: 'orders',
    orders: [], // Sẽ load từ database sau
    currentPage: 1,
    totalPages: 1
  });
});

// Users management
router.get('/users', requireAdmin, (req, res) => {
  res.render('admin/users', {
    title: 'Quản lý người dùng - Admin Shopoo',
    user: req.session.user,
    activeMenu: 'users',
    users: [], // Sẽ load từ database sau
    currentPage: 1,
    totalPages: 1
  });
});

// Categories management
router.get('/categories', requireAdmin, (req, res) => {
  res.render('admin/categories', {
    title: 'Quản lý danh mục - Admin Shopoo',
    user: req.session.user,
    activeMenu: 'categories',
    categories: [] // Sẽ load từ database sau
  });
});

module.exports = router;
