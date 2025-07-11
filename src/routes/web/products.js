const express = require('express');
const router = express.Router();

// Products listing page
router.get('/', (req, res) => {
    res.render('pages/products', {
        title: 'Sản phẩm - Shopoo Multi-NoSQL',
        user: null,
        products: [], // Will load from database later
        categories: [],
        currentCategory: null,
        searchQuery: req.query.search || '',
        currentPage: 1,
        totalPages: 1
    });
});

// Product detail page
router.get('/:id', (req, res) => {
    const productId = req.params.id;

    // TODO: Load product from database
    res.render('pages/product-detail', {
        title: 'Chi tiết sản phẩm - Shopoo Multi-NoSQL',
        user: null,
        product: null, // Will load from database later
        relatedProducts: []
    });
});

// Search products
router.get('/search', (req, res) => {
    const searchQuery = req.query.q || '';
    const category = req.query.category || '';

    res.render('pages/products', {
        title: `Kết quả tìm kiếm: ${searchQuery} - Shopoo Multi-NoSQL`,
        user: null,
        products: [], // Will load from database later
        categories: [],
        currentCategory: category,
        searchQuery: searchQuery,
        currentPage: 1,
        totalPages: 1
    });
});

module.exports = router;
