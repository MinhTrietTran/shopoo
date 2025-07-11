const mongoose = require('mongoose');
const { User, Customer, Shop, Admin } = require('../src/models/User');

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/shopoo?authSource=admin');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Seed initial data
async function seedData() {
    try {
        console.log('🌱 Starting data seeding...');

        // Clear existing users (optional)
        await User.deleteMany({});
        console.log('🗑️ Cleared existing users');

        // Create Admin
        const admin = new Admin({
            email: 'admin@shopoo.com',
            password: 'admin123',
            name: 'System Administrator',
            phone: '0123456789',
            permissions: ['user_management', 'shop_management', 'product_management', 'order_management', 'system_settings']
        });
        await admin.save();
        console.log('👑 Created admin user');

        // Create Sample Customers
        const customers = [
            {
                email: 'customer1@shopoo.com',
                password: 'customer123',
                name: 'Nguyễn Test User',
                phone: '0987654320',
                totalSpent: 8000000, // 8M -> Silver tier
                orderCount: 3,
                loyaltyPoints: 800
            },
            {
                email: 'customer1@gmail.com',
                password: 'customer123',
                name: 'Nguyễn Văn A',
                phone: '0987654321',
                totalSpent: 15000000, // 15M -> Gold tier
                orderCount: 5,
                loyaltyPoints: 1500
            },
            {
                email: 'customer2@gmail.com',
                password: 'customer123',
                name: 'Trần Thị B',
                phone: '0987654322',
                totalSpent: 60000000, // 60M -> Diamond tier
                orderCount: 12,
                loyaltyPoints: 6000
            },
            {
                email: 'customer3@gmail.com',
                password: 'customer123',
                name: 'Lê Văn C',
                phone: '0987654323',
                totalSpent: 2000000, // 2M -> None tier
                orderCount: 1,
                loyaltyPoints: 200
            }
        ];

        for (const customerData of customers) {
            const customer = new Customer(customerData);
            customer.updateTier(); // Auto calculate tier
            await customer.save();
            console.log(`👤 Created customer: ${customer.name} (${customer.tier} tier)`);
        }

        // Create Sample Shops
        const shops = [
            {
                email: 'shop1@gmail.com',
                password: 'shop123',
                name: 'Nguyễn Shop Owner',
                phone: '0123456781',
                shopName: 'Tech Store Việt Nam',
                description: 'Chuyên bán thiết bị điện tử, máy tính, điện thoại',
                businessLicense: 'BL001234567',
                address: {
                    street: '123 Đường ABC',
                    city: 'Hồ Chí Minh',
                    state: 'Hồ Chí Minh',
                    zipCode: '70000'
                },
                isVerified: true,
                totalSales: 50000000,
                productCount: 25,
                rating: { average: 4.5, count: 120 }
            },
            {
                email: 'shop2@gmail.com',
                password: 'shop123',
                name: 'Trần Shop Owner',
                phone: '0123456782',
                shopName: 'Fashion House',
                description: 'Thời trang nam nữ cao cấp',
                businessLicense: 'BL001234568',
                address: {
                    street: '456 Đường XYZ',
                    city: 'Hà Nội',
                    state: 'Hà Nội',
                    zipCode: '10000'
                },
                isVerified: false, // Chưa xác thực
                totalSales: 0,
                productCount: 0,
                rating: { average: 0, count: 0 }
            }
        ];

        for (const shopData of shops) {
            const shop = new Shop(shopData);
            await shop.save();
            console.log(`🏪 Created shop: ${shop.shopName} (${shop.isVerified ? 'Verified' : 'Unverified'})`);
        }

        console.log('✅ Data seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Admin users: 1`);
        console.log(`- Customer users: ${customers.length}`);
        console.log(`- Shop users: ${shops.length}`);
        console.log(`- Total users: ${1 + customers.length + shops.length}`);

    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
}

// Main execution
async function main() {
    await connectDB();
    await seedData();

    // Show final user count
    const userCount = await User.countDocuments();
    console.log(`\n🎯 Total users in database: ${userCount}`);

    mongoose.connection.close();
    console.log('🔌 Database connection closed');
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { seedData, connectDB };
