const express = require('express');
const Product = require('../../models/Product');
const mongoose = require('mongoose');
const router = express.Router();

// Products listing page
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const sort = req.query.sort || 'newest';
        const search = req.query.q;

        // Build query
        let query = { status: 'active' };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Build sort options
        let sortOptions = { createdAt: -1 }; // Default: newest first
        switch (sort) {
            case 'price-low':
                sortOptions = { price: 1 };
                break;
            case 'price-high':
                sortOptions = { price: -1 };
                break;
            case 'rating':
                sortOptions = { 'rating.average': -1, 'rating.count': -1 };
                break;
            case 'popular':
                sortOptions = { views: -1, 'sales.total': -1 };
                break;
            case 'newest':
            default:
                sortOptions = { createdAt: -1 };
                break;
        }

        // Execute query with pagination
        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('seller', 'name shopName isVerified')
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);

        // Debug log
        console.log('Products found:', products.length);
        if (products.length > 0) {
            console.log('First product seller:', JSON.stringify(products[0].seller, null, 2));
        }

        // Calculate pagination
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        // Get categories for filter
        const categories = await Product.distinct('category', { status: 'active' });

        res.render('pages/products', {
            title: search ? `Kết quả tìm kiếm: ${search}` : 'Sản phẩm - Shopoo',
            user: req.session?.user || null,
            products,
            categories,
            pagination: {
                current: page,
                total: totalPages,
                hasNext: hasNextPage,
                hasPrev: hasPrevPage,
                limit
            },
            filters: {
                category: category || 'all',
                sort,
                search: search || ''
            },
            total,
            searchQuery: search || ''
        });

    } catch (error) {
        console.error('Products listing error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi hệ thống - Shopoo',
            user: req.session?.user || null,
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Product detail page
router.get('/:slug', async (req, res) => {
    try {
        const slug = req.params.slug;

        // Find product by slug or ID (for backward compatibility)
        let product = await Product.findOne({
            $or: [
                { 'seo.slug': slug },
                { _id: mongoose.Types.ObjectId.isValid(slug) ? slug : null }
            ],
            status: 'active'
        }).populate('seller', 'name shopName isVerified rating address');

        if (!product) {
            return res.status(404).render('pages/404', {
                title: 'Sản phẩm không tìm thấy - Shopoo',
                user: req.session?.user || null
            });
        }

        // Increment view count (async, don't wait)
        Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } }).exec();

        // Get related products (same category, exclude current)
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            status: 'active'
        })
            .populate('seller', 'name shopName')
            .sort({ 'rating.average': -1, views: -1 })
            .limit(8)
            .lean();

        // Get more from same seller
        const moreFromSeller = await Product.find({
            seller: product.seller._id,
            _id: { $ne: product._id },
            status: 'active'
        })
            .populate('seller', 'name shopName')
            .sort({ 'sales.total': -1 })
            .limit(6)
            .lean();

        res.render('pages/product-detail', {
            title: `${product.name} - Shopoo`,
            user: req.session?.user || null,
            product,
            relatedProducts,
            moreFromSeller,
            jsonLd: generateProductJsonLd(product) // For SEO
        });

    } catch (error) {
        console.error('Product detail error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi hệ thống - Shopoo',
            user: req.session?.user || null,
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Search products API (for AJAX)
router.get('/api/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

        let query = { status: 'active' };

        if (q) {
            query.$text = { $search: q };
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        let sortOptions = { createdAt: -1 };
        switch (sort) {
            case 'price-low': sortOptions = { price: 1 }; break;
            case 'price-high': sortOptions = { price: -1 }; break;
            case 'rating': sortOptions = { 'rating.average': -1 }; break;
            case 'popular': sortOptions = { views: -1 }; break;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('seller', 'name shopName')
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Product.countDocuments(query)
        ]);

        res.json({
            success: true,
            products,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });

    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({
            success: false,
            error: 'Lỗi tìm kiếm sản phẩm'
        });
    }
});

// Category products
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.findByCategory(category, {
            limit: parseInt(req.query.limit) || 20,
            sort: req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 }
        });

        res.render('pages/products', {
            title: `${category} - Shopoo`,
            user: req.session?.user || null,
            products,
            currentCategory: category,
            searchQuery: ''
        });

    } catch (error) {
        console.error('Category products error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi hệ thống - Shopoo',
            user: req.session?.user || null,
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Helper function for JSON-LD structured data
function generateProductJsonLd(product) {
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.primaryImage?.url,
        "brand": {
            "@type": "Brand",
            "name": product.brand || product.seller.shopName
        },
        "offers": {
            "@type": "Offer",
            "price": product.discountPrice,
            "priceCurrency": "VND",
            "availability": product.available > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
                "@type": "Organization",
                "name": product.seller.shopName || product.seller.name
            }
        },
        "aggregateRating": product.rating.count > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating.average,
            "reviewCount": product.rating.count
        } : undefined
    };
}

module.exports = router;
