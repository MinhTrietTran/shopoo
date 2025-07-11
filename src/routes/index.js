const express = require('express');
const router = express.Router();

// Import web routes only
const webRoutes = require('./web/index');

// Web routes (for rendered pages)
router.use('/', webRoutes);

module.exports = router;
