// MongoDB initialization script
// This script runs when MongoDB container starts for the first time

print('🚀 Initializing MongoDB for Shopoo...');

// Switch to shopoo database
db = db.getSiblingDB('shopoo');

// Create user for the application
db.createUser({
    user: 'shopoo_user',
    pwd: 'shopoo_password',
    roles: [
        {
            role: 'readWrite',
            db: 'shopoo'
        }
    ]
});

// Create collections with indexes
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('categories');

// Create indexes for better performance
print('📝 Creating indexes...');

// User indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });

// Product indexes
db.products.createIndex({ "name": "text", "shortDescription": "text", "fullDescription": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "subcategory": 1 });
db.products.createIndex({ "brand": 1 });
db.products.createIndex({ "seller": 1 });
db.products.createIndex({ "featured": 1 });
db.products.createIndex({ "price": 1 });
db.products.createIndex({ "rating.average": -1 });
db.products.createIndex({ "seo.slug": 1 }, { unique: true });
db.products.createIndex({ "createdAt": -1 });

// Order indexes
db.orders.createIndex({ "user": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });

print('✅ MongoDB initialization completed!');
print('📊 Database: shopoo');
print('👤 Application user: shopoo_user');
print('🔍 Indexes created for users, products, and orders collections');
