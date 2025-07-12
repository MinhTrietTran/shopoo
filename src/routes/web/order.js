const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');

router.get('/', async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .populate('products.product', 'name price');
    res.render('pages/orders', {
        title: 'Đơn hàng',
        user: req.session?.user || null,
        orders
    });
});

module.exports = router;
