const express = require('express');
const router = express.Router();

// Import route modules
const webRoutes = require('./web/index');
const apiRoutes = require('./api/index');

// Web routes (for rendered pages)
router.use('/', webRoutes);

// API routes
router.use('/api', apiRoutes);

module.exports = router;
