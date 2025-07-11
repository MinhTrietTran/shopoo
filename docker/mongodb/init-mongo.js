// Script khởi tạo MongoDB với user và database cho Shopoo
db = db.getSiblingDB('shopoo');

// Tạo user cho ứng dụng
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

// Tạo các collections ban đầu
db.createCollection('users');
db.createCollection('products');
db.createCollection('categories');
db.createCollection('orders');
db.createCollection('carts');

// Tạo indexes cho performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });
db.orders.createIndex({ "user": 1 });
db.orders.createIndex({ "createdAt": -1 });

// Insert dữ liệu mẫu cho categories
db.categories.insertMany([
    {
        name: "Điện thoại & Phụ kiện",
        slug: "dien-thoai-phu-kien",
        description: "Điện thoại smartphone và phụ kiện",
        image: "/images/categories/phone.jpg",
        isActive: true,
        createdAt: new Date()
    },
    {
        name: "Máy tính & Laptop",
        slug: "may-tinh-laptop",
        description: "Máy tính để bàn, laptop và linh kiện",
        image: "/images/categories/laptop.jpg",
        isActive: true,
        createdAt: new Date()
    },
    {
        name: "Thời trang Nam",
        slug: "thoi-trang-nam",
        description: "Quần áo, giày dép thời trang nam",
        image: "/images/categories/men-fashion.jpg",
        isActive: true,
        createdAt: new Date()
    },
    {
        name: "Thời trang Nữ",
        slug: "thoi-trang-nu",
        description: "Quần áo, giày dép thời trang nữ",
        image: "/images/categories/women-fashion.jpg",
        isActive: true,
        createdAt: new Date()
    },
    {
        name: "Gia dụng & Đời sống",
        slug: "gia-dung-doi-song",
        description: "Đồ gia dụng và vật dụng sinh hoạt",
        image: "/images/categories/household.jpg",
        isActive: true,
        createdAt: new Date()
    }
]);

print('Database initialized successfully!');
