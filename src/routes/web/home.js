const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('pages/index', {
        title: 'Shopoo - Multi-NoSQL E-commerce Platform',
        user: req.session?.user || null, // Use session user
        categories: [], // Will load from database later
        featuredProducts: [] // Will load from database later
    });
});

// About page
router.get('/about', (req, res) => {
    res.render('pages/about', {
        title: 'Giới thiệu - Shopoo Multi-NoSQL',
        user: req.session?.user || null
    });
});

// Contact page
router.get('/contact', (req, res) => {
    res.render('pages/contact', {
        title: 'Liên hệ - Shopoo Multi-NoSQL',
        user: req.session?.user || null
    });
});

module.exports = router;
