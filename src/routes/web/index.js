const express = require('express');
const router = express.Router();

// Import web route modules
const homeRoutes = require('./home');
const productRoutes = require('./products');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');

// Web routes
router.use('/', homeRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
