const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên sản phẩm là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tên sản phẩm không được vượt quá 200 ký tự']
    },
    description: {
        type: String,
        required: [true, 'Mô tả sản phẩm là bắt buộc'],
        maxlength: [2000, 'Mô tả không được vượt quá 2000 ký tự']
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: [500, 'Mô tả ngắn không được vượt quá 500 ký tự']
    },
    price: {
        type: Number,
        required: [true, 'Giá sản phẩm là bắt buộc'],
        min: [0, 'Giá không thể âm']
    },
    originalPrice: {
        type: Number,
        default: function () {
            return this.price;
        }
    },
    discount: {
        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        amount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    category: {
        type: String,
        required: [true, 'Danh mục sản phẩm là bắt buộc'],
        enum: [
            'electronics', 'fashion', 'home', 'beauty', 'sports',
            'books', 'automotive', 'gaming', 'food', 'other'
        ]
    },
    subcategory: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    specifications: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        value: {
            type: String,
            required: true,
            trim: true
        }
    }],
    stock: {
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        reserved: {
            type: Number,
            default: 0,
            min: 0
        },
        threshold: {
            type: Number,
            default: 10,
            min: 0
        }
    },
    dimensions: {
        weight: Number, // grams
        length: Number, // cm
        width: Number,  // cm
        height: Number  // cm
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'inactive', 'out_of_stock', 'discontinued'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    sales: {
        total: {
            type: Number,
            default: 0,
            min: 0
        },
        monthly: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    seo: {
        slug: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true
        },
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ 'seo.slug': 1 });

// Virtual for availability
productSchema.virtual('available').get(function () {
    return this.stock.quantity - this.stock.reserved;
});

// Virtual for discount price
productSchema.virtual('discountPrice').get(function () {
    if (this.discount.percentage > 0) {
        return Math.round(this.price * (1 - this.discount.percentage / 100));
    }
    if (this.discount.amount > 0) {
        return Math.max(0, this.price - this.discount.amount);
    }
    return this.price;
});

// Virtual for savings
productSchema.virtual('savings').get(function () {
    const discountPrice = this.discountPrice;
    return this.price - discountPrice;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function () {
    const primary = this.images.find(img => img.isPrimary);
    return primary || this.images[0] || null;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
    const available = this.available;
    if (available <= 0) return 'out_of_stock';
    if (available <= this.stock.threshold) return 'low_stock';
    return 'in_stock';
});

// Pre-save middleware to generate slug
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.seo.slug) {
        this.seo.slug = this.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    next();
});

// Methods
productSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

productSchema.methods.updateRating = function (newRating) {
    const totalRating = (this.rating.average * this.rating.count) + newRating;
    this.rating.count += 1;
    this.rating.average = totalRating / this.rating.count;
    return this.save();
};

productSchema.methods.reserveStock = function (quantity) {
    if (this.available < quantity) {
        throw new Error('Không đủ hàng trong kho');
    }
    this.stock.reserved += quantity;
    return this.save();
};

productSchema.methods.releaseStock = function (quantity) {
    this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
    return this.save();
};

productSchema.methods.reduceStock = function (quantity) {
    if (this.stock.quantity < quantity) {
        throw new Error('Không đủ hàng trong kho');
    }
    this.stock.quantity -= quantity;
    this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
    this.sales.total += quantity;
    this.sales.monthly += quantity;

    // Update status if out of stock
    if (this.stock.quantity === 0) {
        this.status = 'out_of_stock';
    }

    return this.save();
};

// Static methods
productSchema.statics.findByCategory = function (category, options = {}) {
    const query = { category, status: 'active' };
    return this.find(query)
        .populate('seller', 'name shopName')
        .sort(options.sort || { createdAt: -1 })
        .limit(options.limit || 20);
};

productSchema.statics.search = function (searchTerm, options = {}) {
    const query = {
        $text: { $search: searchTerm },
        status: 'active'
    };

    if (options.category) {
        query.category = options.category;
    }

    if (options.priceRange) {
        query.price = {
            $gte: options.priceRange.min || 0,
            $lte: options.priceRange.max || Number.MAX_SAFE_INTEGER
        };
    }

    return this.find(query)
        .populate('seller', 'name shopName')
        .sort(options.sort || { score: { $meta: 'textScore' } })
        .limit(options.limit || 20);
};

productSchema.statics.getFeatured = function (limit = 8) {
    return this.find({ featured: true, status: 'active' })
        .populate('seller', 'name shopName')
        .sort({ 'rating.average': -1, views: -1 })
        .limit(limit);
};

productSchema.statics.getTopRated = function (limit = 10) {
    return this.find({ status: 'active', 'rating.count': { $gte: 5 } })
        .populate('seller', 'name shopName')
        .sort({ 'rating.average': -1, 'rating.count': -1 })
        .limit(limit);
};

productSchema.statics.getBestSellers = function (limit = 10) {
    return this.find({ status: 'active' })
        .populate('seller', 'name shopName')
        .sort({ 'sales.total': -1 })
        .limit(limit);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
