# Shopoo - Multi-NoSQL E-commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-✅-success.svg)](https://www.mongodb.com/)
[![Authentication](https://img.shields.io/badge/Authentication-✅-success.svg)](https://bcrypt.com/)
[![Redis](https://img.shields.io/badge/Redis-⚠️%20Ready-orange.svg)](https://redis.io/)
[![Neo4j](https://img.shields.io/badge/Neo4j-⚠️%20Ready-orange.svg)](https://neo4j.com/)
[![Cassandra](https://img.shields.io/badge/Cassandra-⚠️%20Ready-orange.svg)](https://cassandra.apache.org/)

Nền tảng thương mại điện tử với **hệ thống phân quyền hoàn chỉnh** và kiến trúc multi-NoSQL database để thực hành.

## 🔐 Tính năng Authentication mới

### Phân quyền 3 vai trò:
- **👤 Customer**: Mua sắm, tích điểm, hạng thành viên (Bạc, Vàng, Kim cương)
- **🏪 Shop**: Bán hàng, quản lý sản phẩm (cần admin xác thực)  
- **👑 Admin**: Quản lý toàn hệ thống

### Hệ thống hạng khách hàng:
- **Thường**: 0đ (0% giảm giá)
- **🥈 Bạc**: 5M+ (5% giảm giá)
- **🏅 Vàng**: 15M+ (10% giảm giá + free ship)
- **💎 Kim cương**: 50M+ (15% giảm giá + free ship + priority support)

## 🚀 Hướng dẫn khởi chạy nhanh

### 1. Clone repository
```bash
git clone https://github.com/MinhTrietTran/shopoo.git
cd shopoo
```

### 2. Khởi động với Docker (Khuyến nghị)
```bash
# Khởi động tất cả services
docker compose up -d

# Kiểm tra trạng thái containers
docker compose ps

# Xem logs
docker compose logs -f app
```

### 3. Truy cập ứng dụng
- **🌐 Web App**: http://localhost:3000
- **� Đăng nhập**: http://localhost:3000/auth/login
- **📝 Đăng ký**: http://localhost:3000/auth/register  
- **�📊 Health Check**: http://localhost:3000/health
- **🗄️ Mongo Express**: http://localhost:8081

### 4. Test Authentication
```bash
# Tạo admin đầu tiên (trong container)
docker exec -it shopoo-app node -e "
const { Admin } = require('./src/models/User');
const admin = new Admin({
  email: 'admin@shopoo.com',
  password: 'admin123',
  name: 'Super Admin',
  permissions: ['user_management', 'shop_management']
});
admin.save().then(() => console.log('Admin created'));
"
```

### 4. Dừng ứng dụng
```bash
docker compose down
```

## 🎯 Mục tiêu dự án

Dự án này được tối giản hóa để tập trung vào việc học và thực hành với nhiều loại cơ sở dữ liệu NoSQL:
- **MongoDB**: ✅ Database chính + User authentication (đã triển khai)
- **Redis**: ⚠️ Cache và session (sẵn sàng để triển khai)
- **Neo4j**: ⚠️ Đồ thị quan hệ và gợi ý (sẵn sàng để triển khai)
- **Cassandra**: ⚠️ Big data và analytics (sẵn sàng để triển khai)

**🔐 Authentication**: bcrypt + express-session + role-based access control  
**Kiến trúc**: 1 server, nhiều databases để thực hành NoSQL

## 📋 Yêu cầu hệ thống

### Với Docker (Khuyến nghị)
- **Docker** 20.0+
- **Docker Compose** 2.0+
- **RAM**: Tối thiểu 2GB
- **Disk**: 1GB trống

### Chạy local (Alternative)
- **Node.js** 18+
- **MongoDB** 7.0+
- **npm** hoặc **yarn**

## 🏗️ Cấu trúc mã nguồn

```
shopoo/
├── 📁 src/config/databases/     # 🔥 KIẾN TRÚC MULTI-DATABASE
│   ├── index.js                 # Central database manager (quản lý tất cả DB)
│   ├── mongodb.js              # ✅ MongoDB connection manager (đã triển khai)
│   ├── redis.js                # ⚠️ Redis manager (sẵn sàng implement)
│   ├── neo4j.js                # ⚠️ Neo4j manager (sẵn sàng implement)
│   └── cassandra.js            # ⚠️ Cassandra manager (sẵn sàng implement)
├── 📁 src/models/              # 🔐 DATABASE MODELS
│   └── User.js                 # ✅ User authentication với discriminators
├── 📁 src/middleware/          # 🔐 AUTHENTICATION MIDDLEWARE  
│   └── auth.js                 # ✅ Role-based access control
├── 📁 src/routes/web/          # 🌐 WEB ROUTES
│   ├── home.js                 # Trang chủ
│   ├── products.js             # Danh sách sản phẩm
│   ├── auth.js                 # ✅ Login/Register/Logout
│   └── dashboard.js            # ✅ Dashboard theo role
├── 📁 views/                   # EJS TEMPLATES
│   ├── pages/                  # Các trang chính
│   │   ├── index.ejs           # Trang chủ
│   │   ├── products.ejs        # Danh sách sản phẩm
│   │   ├── auth/               # ✅ Authentication pages
│   │   │   ├── login.ejs       # Form đăng nhập
│   │   │   └── register.ejs    # Form đăng ký
│   │   ├── dashboard/          # ✅ Role-based dashboards
│   │   │   ├── customer.ejs    # Dashboard khách hàng
│   │   │   ├── shop.ejs        # Dashboard cửa hàng  
│   │   │   └── admin.ejs       # Dashboard admin
│   │   ├── 404.ejs            # Trang lỗi 404
│   │   └── error.ejs          # Trang lỗi hệ thống
│   └── partials/              # Các components dùng chung
│       ├── header.ejs         # Header với Bootstrap 5
│       ├── navbar.ejs         # Navigation bar
│       └── footer.ejs         # Footer
├── 📁 public/                 # Static files
│   ├── css/main.css           # Styles chính
│   ├── js/main.js             # JavaScript client-side
│   └── images/                # Hình ảnh
├── 📄 server.js               # Entry point với session middleware
├── 📄 package.json            # Dependencies (6 packages chính)
├── 📄 docker-compose.yml      # Container orchestration
├── 📄 Dockerfile              # Node.js app container
└── 📄 .env                    # Environment variables
```

### Giải thích cấu trúc chính:

#### 🔥 Multi-Database Architecture (`src/config/databases/`)
- **`index.js`**: Central manager điều phối tất cả database connections
- **`mongodb.js`**: ✅ Hoàn chỉnh - Connection pooling, health monitoring
- **`redis.js`**: ⚠️ Cấu trúc sẵn sàng - Cần implement caching logic  
- **`neo4j.js`**: ⚠️ Cấu trúc sẵn sàng - Cần implement graph queries
- **`cassandra.js`**: ⚠️ Cấu trúc sẵn sàng - Cần implement big data operations

#### 🌐 Web Layer
- **Routes**: Đơn giản, chỉ home và products
- **Views**: EJS templates với Bootstrap 5
- **Static**: CSS, JS, images cơ bản

## 🔥 Cách sử dụng Multi-Database Architecture

### Cách database managers hoạt động:

```javascript
// Import central database manager
const dbManager = require('./src/config/databases');

// Khởi động tất cả database connections
await dbManager.connectAll();

// Sử dụng từng database riêng biệt
const mongoData = await dbManager.mongo.findProducts();
const cached = await dbManager.redis.get('products');        // Sẽ implement
const recommendations = await dbManager.neo4j.getRecommendations(); // Sẽ implement

// Kiểm tra health của tất cả databases
const status = await dbManager.healthCheck();
```

### Database Status hiện tại:

#### ✅ MongoDB Manager (`mongodb.js`) - ĐÃ TRIỂN KHAI
```javascript
// Features đã có:
- Connection pooling với mongoose
- Health monitoring
- Auto-reconnect
- Graceful shutdown
```

#### ⚠️ Redis Manager (`redis.js`) - SẴN SÀNG IMPLEMENT
```javascript
// Cần implement:
- connect() method với redis client
- Caching operations (get, set, delete)
- Session management
- Real-time pub/sub
```

#### ⚠️ Neo4j Manager (`neo4j.js`) - SẴN SÀNG IMPLEMENT  
```javascript
// Cần implement:
- Graph database connection
- Cypher queries
- Product recommendation algorithms
- Relationship analysis
```

#### ⚠️ Cassandra Manager (`cassandra.js`) - SẴN SÀNG IMPLEMENT
```javascript
// Cần implement:
- Cluster connection
- Time-series data handling
- Analytics queries
- Big data operations
```

## � Docker Compose Setup

### Container Architecture:
```yaml
services:
  app:          # Node.js application (port 3000)
  mongodb:      # MongoDB database (port 27017)  
  mongo-express: # Database admin UI (port 8081)
```

### Các lệnh Docker Compose quan trọng:

```bash
# Khởi động tất cả services
docker compose up -d

# Xem status containers
docker compose ps

# Xem logs real-time
docker compose logs -f app
docker compose logs -f mongodb

# Restart một service cụ thể
docker compose restart app

# Rebuild app container sau khi thay đổi code
docker compose build app
docker compose up -d app

# Dừng tất cả services
docker compose down

# Dừng và xóa volumes (reset database)
docker compose down -v
```

### Health Check & Monitoring:
```bash
# Kiểm tra trạng thái ứng dụng
curl http://localhost:3000/health

# Kết quả mong đợi:
{
  "status": "OK",
  "service": "Shopoo Multi-NoSQL App", 
  "databases": {
    "mongodb": { "connected": true, "status": "healthy" },
    "redis": { "connected": false, "status": "disconnected" },
    "neo4j": { "connected": false, "status": "disconnected" },
    "cassandra": { "connected": false, "status": "disconnected" }
  }
}
```

## � Dependencies & Technology Stack

### Core Dependencies (Đã cập nhật):
```json
{
  "dependencies": {
    "express": "^4.18.2",        // Web framework
    "mongoose": "^8.0.3",        // MongoDB ODM
    "ejs": "^3.1.9",            // Template engine
    "dotenv": "^16.3.1",        // Environment variables
    "bcrypt": "^5.1.1",         // 🔐 Password hashing
    "express-session": "^1.17.3" // 🔐 Session management
  },
  "devDependencies": {
    "nodemon": "^3.0.2"         // Development auto-reload
  }
}
```

### Technology Stack:
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (primary), Redis/Neo4j/Cassandra (ready)
- **Authentication**: bcrypt + express-session + role-based middleware
- **Frontend**: EJS templates + Bootstrap 5
- **Containerization**: Docker + Docker Compose
- **Environment**: dotenv configuration

### Cài đặt dependencies (nếu chạy local):
```bash
# Install packages
npm install

# Development mode
npm run dev

# Production mode  
npm start
```

## 🔧 Development & Troubleshooting

### Debug Commands:
```bash
# Xem logs chi tiết từ app container
docker compose logs -f app

# Exec vào container để debug
docker exec -it shopoo-app sh

# Connect trực tiếp tới MongoDB
docker exec -it shopoo-mongodb mongosh

# Kiểm tra network connectivity
docker compose exec app ping mongodb
```

### Common Issues & Solutions:

#### Port conflicts:
```bash
# Nếu port 3000, 27017, hoặc 8081 đã được sử dụng
# Sửa docker-compose.yml:
ports:
  - "3001:3000"  # Thay vì 3000:3000
```

#### Container startup issues:
```bash
# Rebuild từ đầu
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

#### Database connection issues:
```bash
# Kiểm tra MongoDB logs
docker compose logs mongodb

# Test connection
curl http://localhost:3000/health
```

## 🎯 Roadmap cho Collaborators

### ✅ COMPLETED: Authentication System 
```bash
✅ User models với Mongoose discriminators (Customer, Shop, Admin)
✅ Password hashing với bcrypt
✅ Session-based authentication với express-session
✅ Role-based access control middleware
✅ Customer tier system (Bạc, Vàng, Kim cương)
✅ Login/Register/Logout routes và UI
✅ Dashboard riêng cho từng role
✅ Shop verification system
```

### Phase 1: Redis Implementation (Priority 1)
```bash
# Cần implement:
□ Redis connection trong redis.js
□ Caching layer cho products
□ Session storage với Redis (thay thế memory sessions)
□ Add Redis service vào docker-compose.yml
```

### Phase 2: Neo4j Implementation (Priority 2)  
```bash
# Cần implement:
□ Neo4j connection và Cypher queries
□ Product recommendation engine
□ User behavior tracking
□ Graph visualization features
```

### Phase 3: Cassandra Implementation (Priority 3)
```bash
# Cần implement:  
□ Cassandra cluster setup
□ Analytics data pipeline
□ Time-series data collection
□ Big data processing features
```

### Phase 4: Advanced Features
```bash
# Nice to have:
□ Data synchronization between databases
□ Performance monitoring dashboard
□ Load balancing strategies
□ API documentation
□ Unit testing framework
```

## 🤝 Hướng dẫn Contribute

### Cách thêm database mới:
1. **Tạo manager**: `src/config/databases/newdb.js`
2. **Implement interface**:
   ```javascript
   class NewDBManager {
     async connect() { /* connection logic */ }
     async disconnect() { /* cleanup logic */ }
     isHealthy() { /* health check */ }
   }
   ```
3. **Add vào central manager**: Update `src/config/databases/index.js`
4. **Update docker-compose**: Add service container nếu cần
5. **Test**: Verify qua health endpoint

### Code Style:
- ES6+ async/await
- Clear error handling
- Comprehensive logging
- Simple, readable code

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/MinhTrietTran/shopoo/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/MinhTrietTran/shopoo/discussions)
- **Documentation**: README này + code comments

---

**🎯 Mục tiêu chính**: "1 server nhiều db để thực hành nosql" ✅

**� Authentication**: Complete role-based system ✅

**�🚀 Status**: MongoDB ✅ | Authentication ✅ | Redis ⚠️ | Neo4j ⚠️ | Cassandra ⚠️ 
