const express = require('express');
const router = express.Router();

// Import API route modules
const authRoutes = require('./auth');
const productRoutes = require('./products');
const cartRoutes = require('./cart');
const orderRoutes = require('./orders');

// API routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

// API health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
