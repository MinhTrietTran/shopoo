const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('pages/index', {
    title: 'Shopoo - Mua sắm trực tuyến',
    user: req.session.user || null,
    categories: [], // Sẽ load từ database sau
    featuredProducts: [] // Sẽ load từ database sau
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'Giới thiệu - Shopoo',
    user: req.session.user || null
  });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Liên hệ - Shopoo',
    user: req.session.user || null
  });
});

module.exports = router;
