const express = require('express');
const auth = require('../../middleware/auth');
const { Customer, Shop } = require('../../models/User');
const Product = require('../../models/Product');
const router = express.Router();
// Form thêm sản phẩm mới (shop only)
router.get('/shop/products/add', auth.requireShop, (req, res) => {
    res.render('pages/dashboard/add-product', {
        title: 'Thêm sản phẩm mới',
        user: req.session.user,
        error: null,
        success: null
    });
});

// Xử lý submit thêm sản phẩm mới (shop only)
router.post('/shop/products/add', auth.requireShop, async (req, res) => {
    try {
        const { name, description, price, quantity, category } = req.body;
        console.log('[Add Product] Nhận dữ liệu:', { name, description, price, quantity, category, seller: req.session.user?._id });
        // Danh sách category hợp lệ
        const validCategories = [
            'electronics', 'fashion', 'home', 'beauty', 'sports',
            'books', 'automotive', 'gaming', 'food', 'other'
        ];
        if (!name || !description || !price || !quantity || !category) {
            console.warn('[Add Product] Thiếu trường bắt buộc');
            return res.render('pages/dashboard/add-product', {
                title: 'Thêm sản phẩm mới',
                user: req.session.user,
                error: 'Vui lòng nhập đầy đủ thông tin bắt buộc',
                success: null
            });
        }
        if (!validCategories.includes(category)) {
            console.warn('[Add Product] Danh mục không hợp lệ:', category);
            return res.render('pages/dashboard/add-product', {
                title: 'Thêm sản phẩm mới',
                user: req.session.user,
                error: 'Danh mục không hợp lệ. Chọn một trong: ' + validCategories.join(', '),
                success: null
            });
        }
        // Tạo sản phẩm mới
        let product;
        try {
            product = new Product({
            name,
            description,
            shortDescription: description.substring(0, 100),
            price,
            quantity,
            category,
            seller: req.session.user._id,
            images: [], // Cho phép rỗng khi tạo mới
            status: 'active',
            stock: { quantity: Number(quantity) }
        });
            await product.save();
            console.log('[Add Product] Đã lưu sản phẩm thành công:', product._id);
        } catch (err) {
            console.error('[Add Product] Lỗi khi tạo Product instance hoặc lưu:', err);
            return res.render('pages/dashboard/add-product', {
                title: 'Thêm sản phẩm mới',
                user: req.session.user,
                error: 'Lỗi khi lưu sản phẩm: ' + (err.message || err),
                success: null
            });
        }
        res.render('pages/dashboard/add-product', {
            title: 'Thêm sản phẩm mới',
            user: req.session.user,
            error: null,
            success: 'Đã thêm sản phẩm thành công!'
        });
    } catch (error) {
        console.error('Add product error:', error);
        res.render('pages/dashboard/add-product', {
            title: 'Thêm sản phẩm mới',
            user: req.session.user,
            error: 'Có lỗi xảy ra khi thêm sản phẩm',
            success: null
        });
    }
});

// General dashboard (redirects based on role)
router.get('/', auth.requireAuth, (req, res) => {
    console.log('Dashboard - Session user:', req.session.user);
    console.log('Dashboard - Session ID:', req.sessionID);
    const user = req.session.user;

    switch (user.role) {
        case 'admin':
            return res.redirect('/dashboard/admin');
        case 'shop':
            return res.redirect('/dashboard/shop');
        case 'customer':
        default:
            return res.redirect('/dashboard/customer');
    }
});

// Customer Dashboard
router.get('/customer', auth.requireCustomer, async (req, res) => {
    try {
        console.log('Customer dashboard - User session:', req.session.user);
        const customer = await Customer.findById(req.session.user._id);
        console.log('Customer found:', customer ? 'Yes' : 'No');
        if (!customer) {
            console.log('Customer not found, redirecting to login');
            return res.redirect('/auth/login');
        }

        // Update tier if needed
        customer.updateTier();
        await customer.save();

        const tierBenefits = customer.getTierBenefits();

        res.render('pages/dashboard/customer', {
            title: 'Dashboard Khách hàng - Shopoo',
            user: req.session.user,
            customer,
            tierBenefits,
            stats: {
                totalSpent: customer.totalSpent,
                orderCount: customer.orderCount,
                loyaltyPoints: customer.loyaltyPoints,
                tier: customer.tier
            }
        });
    } catch (error) {
        console.error('Customer dashboard error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi hệ thống - Shopoo',
            user: req.session.user,
            error
        });
    }
});

// Shop Dashboard
router.get('/shop', auth.requireShop, async (req, res) => {
    try {
        const shop = await Shop.findById(req.session.user._id); // .populate('featuredProducts');
        if (!shop) {
            return res.redirect('/auth/login');
        }

        const performance = shop.getPerformance();

        res.render('pages/dashboard/shop', {
            title: 'Dashboard Cửa hàng - Shopoo',
            user: req.session.user,
            shop,
            performance,
            stats: {
                totalSales: shop.totalSales,
                productCount: shop.productCount,
                rating: shop.rating.average,
                isVerified: shop.isVerified
            }
        });
    } catch (error) {
        console.error('Shop dashboard error:', error);
        res.status(500).render('pages/error', {
            title: 'Lỗi hệ thống - Shopoo',
            user: req.session.user,
            error
        });
    }
});

// Admin Dashboard
router.get('/admin', auth.requireAdmin, (req, res) => {
    res.render('pages/dashboard/admin', {
        title: 'Dashboard Admin - Shopoo',
        user: req.session.user,
        stats: {
            // TODO: Get real stats from database
            totalUsers: 0,
            totalShops: 0,
            totalOrders: 0,
            totalRevenue: 0
        }
    });
});

module.exports = router;
