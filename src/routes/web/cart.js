const express = require('express');
const redisClient = require('../../config/databases/redis');
const Product = require('../../models/Product');
const auth = require('../../middleware/auth');
const router = express.Router();

// Hiển thị giỏ hàng
router.get('/', auth.requireAuth, async (req, res) => {
    try {
        const userId = req.session.user._id;
        let cart = await redisClient.get(`cart:${userId}`);
        cart = cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };

        // Lấy thông tin sản phẩm từ MongoDB cho từng item
        const populatedItems = await Promise.all(
            cart.items.map(async item => {
                const product = await Product.findById(item.productId);
                return product
                    ? { ...item, product }
                    : null;
            })
        );
        cart.items = populatedItems.filter(Boolean);

        res.render('pages/cart', {
            title: 'Giỏ hàng - Shopoo',
            user: req.session.user,
            cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).render('pages/error', { title: 'Lỗi hệ thống', error });
    }
});

// Thêm sản phẩm vào giỏ hàng (kiểm tra tồn kho)
router.post('/add', auth.requireAuth, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }

        // Kiểm tra tồn kho
        let addQuantity = parseInt(quantity);
        let cart = await redisClient.get(`cart:${userId}`);
        cart = cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };

        const idx = cart.items.findIndex(item => item.productId === productId);
        let currentQuantity = idx > -1 ? cart.items[idx].quantity : 0;
        if (currentQuantity + addQuantity > product.stock) {
            return res.status(400).json({ error: 'Số lượng vượt quá tồn kho!' });
        }

        if (idx > -1) {
            cart.items[idx].quantity += addQuantity;
        } else {
            cart.items.push({ productId, quantity: addQuantity });
        }

        // Tính lại tổng tiền
        cart.totalPrice = 0;
        for (const item of cart.items) {
            const prod = item.productId === productId ? product : await Product.findById(item.productId);
            if (prod) cart.totalPrice += prod.price * item.quantity;
        }

        await redisClient.set(`cart:${userId}`, JSON.stringify(cart));
        res.json({ success: true, message: 'Đã thêm vào giỏ hàng', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
});

// Xóa sản phẩm khỏi giỏ hàng
router.post('/remove', auth.requireAuth, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { productId } = req.body;

        let cart = await redisClient.get(`cart:${userId}`);
        cart = cart ? JSON.parse(cart) : { items: [], totalPrice: 0 };

        cart.items = cart.items.filter(item => item.productId !== productId);

        // Tính lại tổng tiền
        cart.totalPrice = 0;
        for (const item of cart.items) {
            const prod = await Product.findById(item.productId);
            if (prod) cart.totalPrice += prod.price * item.quantity;
        }

        await redisClient.set(`cart:${userId}`, JSON.stringify(cart));
        res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng', cart });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Lỗi hệ thống' });
    }
});

module.exports = router; 