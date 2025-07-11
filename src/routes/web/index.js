const express = require('express');
const router = express.Router();

// Import web route modules
const homeRoutes = require('./home');
const productRoutes = require('./products');

// Web routes
router.use('/', homeRoutes);
router.use('/products', productRoutes);

module.exports = router;
