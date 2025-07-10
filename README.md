# 🛍️ Shopoo - Ứng dụng Thương mại Điện tử

Shopoo là một ứng dụng thương mại điện tử đơn giản được phát triển để thực hành ứng dựng các noSQL trong quản lý cơ sở dữ liệu. Ứng dụng lấy cảm hứng từ Shopee nhưng sử dụng tech stack đơn giản và dễ hiểu.

## 🚀 Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: MongoDB, redis, neo4j, cassandra
- **Template Engine**: EJS
- **Authentication**: JWT (JSON Web Tokens)

## 📁 Cấu trúc Dự án

```
shopoo/
├── src/
│   ├── controllers/        # Xử lý logic business
│   ├── models/            # MongoDB schemas với Mongoose
│   ├── routes/            # API routes và web routes
│   ├── middleware/        # Custom middleware (auth, validation...)
│   └── config/           # Cấu hình database và app
├── public/
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── images/           # Hình ảnh tĩnh
├── views/
│   ├── partials/         # EJS partials (header, footer...)
│   └── pages/            # Các trang chính
├── package.json
├── server.js             # Entry point
└── README.md
```

## 🎯 Tính năng Chính

### 👤 Quản lý Người dùng
- [x] Đăng ký tài khoản
- [x] Đăng nhập/Đăng xuất
- [x] Quản lý profile cá nhân
- [x] Authentication với JWT

### 🛒 Quản lý Sản phẩm
- [x] Hiển thị danh sách sản phẩm
- [x] Tìm kiếm sản phẩm
- [x] Lọc theo danh mục
- [x] Chi tiết sản phẩm
- [x] Đánh giá và bình luận

### 🛍️ Giỏ hàng & Đặt hàng
- [x] Thêm/xóa sản phẩm vào giỏ hàng
- [x] Cập nhật số lượng
- [x] Thanh toán đơn hàng
- [x] Lịch sử đơn hàng
- [x] Tracking đơn hàng

### 🏪 Quản lý Cửa hàng (Admin)
- [x] Thêm/sửa/xóa sản phẩm
- [x] Quản lý danh mục
- [x] Quản lý đơn hàng
- [x] Thống kê doanh thu

## 🗄️ Database Schema (MongoDB Collections)

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  phone: String,
  address: {
    street: String,
    city: String,
    district: String,
    ward: String
  },
  role: String, // 'user' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  images: [String],
  category: ObjectId, // ref Categories
  seller: ObjectId,   // ref Users
  stock: Number,
  sold: Number,
  rating: {
    average: Number,
    count: Number
  },
  specifications: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String,
  user: ObjectId,     // ref Users
  items: [{
    product: ObjectId, // ref Products
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  shippingAddress: Object,
  status: String,     // 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'
  paymentMethod: String,
  paymentStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  description: String,
  image: String,
  parentCategory: ObjectId, // ref Categories (for subcategories)
  isActive: Boolean,
  createdAt: Date
}
```

## 🛠️ Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 14.x
- MongoDB >= 4.x
- NPM hoặc Yarn

### Cài đặt
```bash
# Clone repository
git clone https://github.com/MinhTrietTran/shopoo.git
cd shopoo

# Cài đặt dependencies
npm install

# Tạo file environment variables
cp .env.example .env

# Cấu hình MongoDB connection trong .env
MONGODB_URI=mongodb://localhost:27017/shopoo
JWT_SECRET=your_secret_key_here
PORT=3000

# Chạy ứng dụng
npm start

# Hoặc chạy trong development mode
npm run dev
```

### Scripts NPM
- `npm start` - Chạy production server
- `npm run dev` - Chạy development server với nodemon
- `npm run seed` - Seed dữ liệu mẫu vào database
- `npm test` - Chạy tests

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin profile

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Thêm sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Cart & Orders
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm vào giỏ hàng
- `PUT /api/cart/update` - Cập nhật giỏ hàng
- `DELETE /api/cart/remove` - Xóa khỏi giỏ hàng
- `POST /api/orders` - Đặt hàng
- `GET /api/orders` - Lịch sử đơn hàng

