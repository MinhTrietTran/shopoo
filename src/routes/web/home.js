const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');

// Home page
router.get('/', async (req, res) => {
    try {
        // Load featured products from database
        const featuredProducts = await Product.find({ featured: true })
            .limit(8)
            .sort({ createdAt: -1 })
            .lean();

        res.render('pages/index', {
            title: 'Shopoo - Multi-NoSQL E-commerce Platform',
            user: req.session?.user || null,
            categories: [], // Will load from database later
            featuredProducts: featuredProducts || []
        });
    } catch (error) {
        console.error('Error loading homepage:', error);
        res.render('pages/index', {
            title: 'Shopoo - Multi-NoSQL E-commerce Platform',
            user: req.session?.user || null,
            categories: [],
            featuredProducts: []
        });
    }
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
