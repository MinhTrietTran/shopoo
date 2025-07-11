const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/shopoo?authSource=admin';
        await mongoose.connect(mongoUri);
        console.log('📦 Đã kết nối MongoDB');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        // Retry connection for Docker environment
        console.log('🔄 Thử kết nối lại sau 5 giây...');
        setTimeout(async () => {
            try {
                const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/shopoo?authSource=admin';
                await mongoose.connect(mongoUri);
                console.log('📦 Đã kết nối MongoDB (lần thử lại)');
            } catch (retryError) {
                console.error('❌ Vẫn không thể kết nối MongoDB:', retryError.message);
                process.exit(1);
            }
        }, 5000);
    }
};

const seedProducts = async () => {
    await connectDB();

    try {
        console.log('🌱 Bắt đầu seed dữ liệu sản phẩm...');

        // Clear existing products (only if any exist)
        const existingCount = await Product.countDocuments();
        if (existingCount > 0) {
            await Product.deleteMany({});
            console.log(`🗑️  Đã xóa ${existingCount} sản phẩm cũ`);
        }

        // Create a simple seller account if not exists  
        let seller;
        try {
            seller = await User.findOne({ email: 'seller@shopoo.com' });
            if (!seller) {
                const hashedPassword = await bcrypt.hash('password123', 10);
                seller = await User.create({
                    name: 'Cửa hàng Demo',
                    email: 'seller@shopoo.com',
                    password: hashedPassword,
                    role: 'seller',
                    shopName: 'Shop Demo Store',
                    isVerified: true,
                    profile: {
                        phone: '0901234567',
                        address: {
                            street: '123 Đường Demo',
                            city: 'Hồ Chí Minh',
                            country: 'Việt Nam'
                        }
                    }
                });
                console.log('👤 Đã tạo tài khoản seller demo');
            } else {
                console.log('👤 Sử dụng tài khoản seller có sẵn');
            }
        } catch (userError) {
            console.warn('⚠️  Không thể tạo seller, sử dụng ObjectId giả:', userError.message);
            // Tạo fake ObjectId nếu không thể tạo user
            seller = { _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011') };
        }

        // Sample products data - simplified
        const sampleProducts = [
            {
                name: 'iPhone 15 Pro Max',
                description: 'iPhone 15 Pro Max là chiếc smartphone flagship mới nhất của Apple, được trang bị chip A17 Pro mạnh mẽ, camera chuyên nghiệp và thiết kế titanium cao cấp.',
                shortDescription: 'Smartphone cao cấp mới nhất từ Apple với chip A17 Pro',
                price: 29990000,
                category: 'electronics',
                seller: seller._id,
                status: 'active',
                images: [
                    { url: 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=iPhone+15+Pro', alt: 'iPhone 15 Pro Max' }
                ],
                specifications: [
                    { name: 'Màn hình', value: '6.7 inch Super Retina XDR' },
                    { name: 'Chip', value: 'A17 Pro' }
                ],
                stock: { quantity: 50 },
                featured: true,
                seo: { slug: 'iphone-15-pro-max' }
            },
            {
                name: 'Samsung Galaxy S24 Ultra',
                description: 'Samsung Galaxy S24 Ultra là siêu phẩm Android với camera 200MP, S Pen tích hợp và hiệu năng mạnh mẽ từ chip Snapdragon 8 Gen 3.',
                shortDescription: 'Smartphone Android flagship với S Pen và camera 200MP',
                price: 26990000,
                category: 'electronics',
                seller: seller._id,
                status: 'active',
                seller: seller._id,
                images: [
                    { url: 'https://via.placeholder.com/400x400/0066cc/ffffff?text=Galaxy+S24', alt: 'Samsung Galaxy S24 Ultra' }
                ],
                specifications: [
                    { name: 'Màn hình', value: '6.8 inch Dynamic AMOLED 2X' },
                    { name: 'Camera', value: '200MP + 50MP + 12MP + 10MP' }
                ],
                stock: { quantity: 30 },
                featured: true,
                seo: { slug: 'samsung-galaxy-s24-ultra' }
            },
            {
                name: 'MacBook Air M3',
                description: 'MacBook Air M3 mang đến hiệu năng vượt trội với chip M3, thiết kế mỏng nhẹ và thời lượng pin ấn tượng lên đến 18 giờ.',
                shortDescription: 'Laptop mỏng nhẹ với chip M3 mạnh mẽ',
                price: 28990000,
                category: 'electronics',
                seller: seller._id,
                status: 'active',
                images: [
                    { url: 'https://via.placeholder.com/400x400/c0c0c0/000000?text=MacBook+Air', alt: 'MacBook Air M3' }
                ],
                specifications: [
                    { name: 'Chip', value: 'Apple M3' },
                    { name: 'RAM', value: '8GB' }
                ],
                stock: { quantity: 25 },
                discount: { percentage: 8 },
                seo: { slug: 'macbook-air-m3' }
            },
            {
                name: 'Sony WH-1000XM5',
                description: 'Sony WH-1000XM5 với công nghệ chống ồn tích cực tốt nhất trong phân khúc, chất lượng âm thanh Hi-Res và thời lượng pin 30 giờ.',
                shortDescription: 'Tai nghe chống ồn hàng đầu thế giới',
                price: 7990000,
                category: 'electronics',
                seller: seller._id,
                status: 'active',
                images: [
                    { url: 'https://via.placeholder.com/400x400/000000/ffffff?text=Sony+WH1000XM5', alt: 'Sony WH-1000XM5' }
                ],
                specifications: [
                    { name: 'Driver', value: '30mm' },
                    { name: 'Pin', value: '30 giờ' }
                ],
                stock: { quantity: 40 },
                discount: { percentage: 15 },
                featured: true,
                seo: { slug: 'sony-wh-1000xm5' }
            },
            {
                name: 'Nike Air Force 1',
                description: 'Nike Air Force 1 - đôi giày thể thao kinh điển với thiết kế timeless và độ bền cao, phù hợp cho mọi hoạt động hàng ngày.',
                shortDescription: 'Giày thể thao kinh điển từ Nike',
                price: 2890000,
                category: 'fashion',
                seller: seller._id,
                status: 'active',
                images: [
                    { url: 'https://via.placeholder.com/400x400/ffffff/000000?text=Air+Force+1', alt: 'Nike Air Force 1' }
                ],
                specifications: [
                    { name: 'Chất liệu', value: 'Da thật và synthetic' },
                    { name: 'Công nghệ', value: 'Air Sole' }
                ],
                stock: { quantity: 100 },
                discount: { percentage: 20 },
                featured: true,
                seo: { slug: 'nike-air-force-1' }
            }
        ];

        // Add random views and ratings to products
        const productsWithMetrics = sampleProducts.map(product => ({
            ...product,
            views: Math.floor(Math.random() * 1000) + 100,
            rating: {
                average: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                count: Math.floor(Math.random() * 100) + 10
            }
        }));

        // Insert products
        const insertedProducts = await Product.insertMany(productsWithMetrics);
        console.log(`✅ Đã tạo ${insertedProducts.length} sản phẩm mẫu`);

        // Update products with some sales data
        for (let i = 0; i < insertedProducts.length; i++) {
            const soldCount = Math.floor(Math.random() * 20);
            if (soldCount > 0) {
                await Product.findByIdAndUpdate(insertedProducts[i]._id, {
                    $inc: {
                        'stock.sold': soldCount,
                        'stock.quantity': -soldCount
                    }
                });
            }
        }

        console.log('🎉 Seed dữ liệu sản phẩm hoàn tất!');
        console.log('📊 Thống kê:');
        console.log(`   - Tổng sản phẩm: ${insertedProducts.length}`);
        console.log(`   - Danh mục: Electronics, Fashion, Home, Books`);
        console.log(`   - Sản phẩm nổi bật: ${insertedProducts.filter(p => p.featured).length}`);
        console.log(`   - Sản phẩm có giảm giá: ${insertedProducts.filter(p => p.discount.percentage > 0).length}`);

    } catch (error) {
        console.error('❌ Lỗi khi seed dữ liệu:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Run the seed function
seedProducts();
