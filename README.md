# Shopoo - Multi-NoSQL E-commerce Platform

Nền tảng thương mại điện tử đơn giản được thiết kế để thực hành với nhiều cơ sở dữ liệu NoSQL khác nhau trong một ứng dụng duy nhất.

## 🎯 Mục tiêu

Dự án này được tối giản hóa để tập trung vào việc học và thực hành với nhiều loại cơ sở dữ liệu NoSQL:
- **MongoDB**: Cơ sở dữ liệu chính cho dữ liệu sản phẩm
- **Redis**: Cache và session (sẵn sàng để triển khai)
- **Neo4j**: Đồ thị quan hệ và gợi ý (sẵn sàng để triển khai)
- **Cassandra**: Big data và analytics (sẵn sàng để triển khai)

## 🏗️ Cấu trúc Source Code

```
shopoo/
├── docker-compose.yml          # Container orchestration
├── Dockerfile                  # Node.js app container
├── package.json               # Dependencies (4 packages chính)
├── server.js                  # Entry point chính
├── .env                       # Environment variables
├── src/
│   ├── config/
│   │   └── databases/         # 🔥 KIẾN TRÚC MULTI-DATABASE
│   │       ├── index.js       # Central database manager
│   │       ├── mongodb.js     # MongoDB connection manager
│   │       ├── redis.js       # Redis manager (stub)
│   │       ├── neo4j.js       # Neo4j manager (stub)
│   │       └── cassandra.js   # Cassandra manager (stub)
│   └── routes/
│       └── web/               # Web routes đơn giản
│           ├── home.js        # Trang chủ
│           └── products.js    # Danh sách sản phẩm
├── views/                     # EJS templates
│   ├── layouts/
│   │   └── main.ejs          # Layout chính với Bootstrap 5
│   └── pages/
│       ├── home.ejs          # Trang chủ
│       ├── products.ejs      # Danh sách sản phẩm
│       ├── 404.ejs           # Trang lỗi 404
│       └── error.ejs         # Trang lỗi hệ thống
└── public/                    # Static files
    ├── css/
    ├── js/
    └── images/
```

## 🔥 Kiến trúc Multi-Database

### Database Manager (`src/config/databases/index.js`)
Trung tâm quản lý tất cả kết nối database:
```javascript
const dbManager = require('./src/config/databases');

// Kết nối tất cả databases
await dbManager.connectAll();

// Sử dụng specific database
const mongoData = await dbManager.mongo.findProducts();
const cached = await dbManager.redis.get('products');
const recommendations = await dbManager.neo4j.getRecommendations();
```

### MongoDB Manager (`mongodb.js`)
- ✅ **Đã triển khai**: Connection pooling, health monitoring
- 🎯 **Sử dụng cho**: Dữ liệu sản phẩm, đơn hàng, users

### Redis Manager (`redis.js`)
- ⚠️ **Sẵn sàng triển khai**: Cấu trúc đã sẵn sàng
- 🎯 **Sẽ sử dụng cho**: Cache, sessions, real-time data

### Neo4j Manager (`neo4j.js`)
- ⚠️ **Sẵn sàng triển khai**: Cấu trúc đã sẵn sàng
- 🎯 **Sẽ sử dụng cho**: Recommendations, social graphs, relationships

### Cassandra Manager (`cassandra.js`)
- ⚠️ **Sẵn sàng triển khai**: Cấu trúc đã sẵn sàng
- 🎯 **Sẽ sử dụng cho**: Analytics, time-series data, big data

## 🚀 Khởi chạy dự án

### Yêu cầu
- Docker và Docker Compose
- Node.js 18+ (nếu chạy local)

### 1. Clone và khởi động
```bash
git clone <repo-url>
cd shopoo
docker-compose up -d
```

### 2. Kiểm tra trạng thái
- **Web Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Mongo Express**: http://localhost:8081

### 3. Containers
```bash
# Kiểm tra containers
docker-compose ps

# Xem logs
docker-compose logs -f app
```

## 📊 Health Monitoring

Endpoint `/health` cung cấp thông tin về trạng thái tất cả databases:
```json
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

## 🛠️ Development

### Dependencies tối giản
```json
{
  "express": "Webserver framework",
  "mongoose": "MongoDB ODM",
  "ejs": "Template engine",
  "dotenv": "Environment variables"
}
```

### Thêm database mới
1. Tạo manager trong `src/config/databases/`
2. Implement interface: `connect()`, `disconnect()`, `isHealthy()`
3. Thêm vào `index.js`
4. Update Docker Compose nếu cần

## 🎯 Roadmap để mở rộng

### Phase 1: Redis Implementation
- [ ] Implement Redis connection
- [ ] Add caching layer
- [ ] Session management

### Phase 2: Neo4j Implementation
- [ ] Setup Neo4j container
- [ ] Product relationship graphs
- [ ] Recommendation engine

### Phase 3: Cassandra Implementation
- [ ] Setup Cassandra cluster
- [ ] Analytics data pipeline
- [ ] Time-series data handling

### Phase 4: Advanced Features
- [ ] Data synchronization between DBs
- [ ] Performance monitoring
- [ ] Load balancing strategies

## 🐛 Troubleshooting

### Container issues
```bash
# Restart containers
docker-compose down && docker-compose up -d

# Rebuild app container
docker-compose build app
```

### Database connection issues
- Kiểm tra logs: `docker-compose logs mongo`
- Verify health endpoint: `curl http://localhost:3000/health`

## 📝 Notes

- UI framework: Bootstrap 5
- Template engine: EJS
- Database strategy: Single server, multiple databases
- Architecture: Microservices-ready với database abstraction

---
**Mục tiêu**: "1 server nhiều db để thực hành nosql" 
