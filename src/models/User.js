const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema - Base schema cho tất cả user types
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer', 'shop'],
        required: true,
        default: 'customer'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned'],
        default: 'active'
    },
    avatar: {
        type: String,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    discriminatorKey: 'role'
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

// Customer Schema - Extends User
const customerSchema = new mongoose.Schema({
    tier: {
        type: String,
        enum: ['none', 'silver', 'gold', 'diamond'],
        default: 'none'
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    orderCount: {
        type: Number,
        default: 0
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: { type: String, default: 'Vietnam' }
    },
    birthDate: {
        type: Date
    },
    preferences: {
        newsletter: { type: Boolean, default: true },
        notifications: { type: Boolean, default: true }
    }
});

// Method to calculate customer tier based on spending
customerSchema.methods.updateTier = function () {
    const totalSpent = this.totalSpent;

    if (totalSpent >= 50000000) { // 50M VND
        this.tier = 'diamond';
    } else if (totalSpent >= 20000000) { // 20M VND
        this.tier = 'gold';
    } else if (totalSpent >= 5000000) { // 5M VND
        this.tier = 'silver';
    } else {
        this.tier = 'none';
    }

    return this.tier;
};

// Get tier benefits
customerSchema.methods.getTierBenefits = function () {
    const benefits = {
        none: {
            discount: 0,
            freeShipping: false,
            prioritySupport: false
        },
        silver: {
            discount: 5,
            freeShipping: false,
            prioritySupport: false
        },
        gold: {
            discount: 10,
            freeShipping: true,
            prioritySupport: false
        },
        diamond: {
            discount: 15,
            freeShipping: true,
            prioritySupport: true
        }
    };

    return benefits[this.tier] || benefits.none;
};

const Customer = User.discriminator('customer', customerSchema);

// Shop Schema - Extends User
const shopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    businessLicense: {
        type: String,
        trim: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: String,
        zipCode: String,
        country: { type: String, default: 'Vietnam' }
    },
    bankInfo: {
        bankName: String,
        accountNumber: String,
        accountHolder: String
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    totalSales: {
        type: Number,
        default: 0
    },
    productCount: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    featuredProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

// Calculate shop performance
shopSchema.methods.getPerformance = function () {
    return {
        rating: this.rating.average,
        totalSales: this.totalSales,
        productCount: this.productCount,
        isVerified: this.isVerified
    };
};

const Shop = User.discriminator('shop', shopSchema);

// Admin Schema - Extends User (minimal, chỉ cần role admin)
const adminSchema = new mongoose.Schema({
    permissions: [{
        type: String,
        enum: ['user_management', 'shop_management', 'product_management', 'order_management', 'system_settings']
    }],
    lastAction: {
        action: String,
        timestamp: { type: Date, default: Date.now }
    }
});

const Admin = User.discriminator('admin', adminSchema);

module.exports = {
    User,
    Customer,
    Shop,
    Admin
};
