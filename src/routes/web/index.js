const express = require('express');
const router = express.Router();

// Import web route modules
const homeRoutes = require('./home');
const productRoutes = require('./products');
const cartRoutes = require('./cart'); 

// Web routes
router.use('/', homeRoutes);
router.use('/products', productRoutes);
router.use('/auth/cart', cartRoutes); 

module.exports = router;