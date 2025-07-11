const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

cartSchema.pre('save', async function (next) {
    // Calculate total price before saving
    const productIds = this.items.map(item => item.product);
    const products = await mongoose.model('Product').find({ _id: { $in: productIds } });

    this.totalPrice = this.items.reduce((total, item) => {
        const product = products.find(p => p._id.equals(item.product));
        return total + (product.price * item.quantity);
    }, 0);

    next();
});

module.exports = mongoose.model('Cart', cartSchema);