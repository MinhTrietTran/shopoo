# 🐳 Shopoo Docker Setup

Hướng dẫn chạy dự án Shopoo bằng Docker để collaborator dễ dàng setup môi trường.

## 📋 Yêu cầu

- Docker Desktop
- Docker Compose V2

## 🚀 Khởi chạy nhanh

### 1. Clone dự án
```bash
git clone https://github.com/MinhTrietTran/shopoo.git
cd shopoo
```

### 2. Chạy toàn bộ stack
```bash
# Build và chạy tất cả services
docker-compose up -d

# Hoặc build lại nếu có thay đổi code
docker-compose up -d --build
```

### 3. Truy cập ứng dụng
- 🌐 **Website**: http://localhost:3000
- 🗄️ **MongoDB Admin**: http://localhost:8081 (admin/admin)
- ❤️ **Health Check**: http://localhost:3000/health

## 📦 Services

| Service | Port | Description |
|---------|------|-------------|
| **app** | 3000 | Node.js Application |
| **mongodb** | 27017 | MongoDB Database |
| **mongo-express** | 8081 | MongoDB Web UI |
| **seeder** | - | Data seeding (runs once) |

## 🔧 Commands hữu ích

### Xem logs
```bash
# Tất cả services
docker-compose logs -f

# Chỉ app
docker-compose logs -f app

# Chỉ database
docker-compose logs -f mongodb
```

### Restart services
```bash
# Restart app
docker-compose restart app

# Restart tất cả
docker-compose restart
```

### Exec vào container
```bash
# Vào app container
docker-compose exec app sh

# Vào MongoDB
docker-compose exec mongodb mongosh
```

### Stop và cleanup
```bash
# Stop services
docker-compose down

# Stop và xóa volumes (data sẽ mất)
docker-compose down -v

# Stop và xóa images
docker-compose down --rmi all
```

## 🌱 Seed dữ liệu

Dữ liệu mẫu sẽ tự động được tạo khi chạy lần đầu. Nếu muốn seed lại:

```bash
# Chạy seeder manually
docker-compose run --rm seeder

# Hoặc exec vào app container
docker-compose exec app node scripts/seedProducts.js
```

## 🔑 Database Credentials

### MongoDB
- **Username**: admin
- **Password**: password123
- **Database**: shopoo
- **URI**: `mongodb://admin:password123@localhost:27017/shopoo?authSource=admin`

### Mongo Express
- **Username**: admin
- **Password**: admin

## 🛠️ Development

### Hot reload
Trong development mode, code thay đổi sẽ tự động reload:

```bash
# Development mode (default)
docker-compose up -d

# Production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Install packages mới
```bash
# Exec vào container và install
docker-compose exec app npm install package-name

# Hoặc rebuild image
docker-compose up -d --build
```

### Debug
```bash
# Xem container status
docker-compose ps

# Xem resource usage
docker stats

# Inspect network
docker network ls
docker network inspect shopoo_shopoo-network
```

## 🚨 Troubleshooting

### Port đã được sử dụng
```bash
# Kiểm tra port nào đang dùng
lsof -i :3000
lsof -i :27017

# Thay đổi port trong docker-compose.yml
```

### Lỗi permission
```bash
# Fix permission cho uploads folder
chmod 755 public/uploads
```

### Container không start
```bash
# Check logs
docker-compose logs service-name

# Rebuild image
docker-compose build --no-cache service-name
```

### Xóa toàn bộ để reset
```bash
# Cleanup everything
docker-compose down -v --rmi all
docker system prune -a

# Chạy lại từ đầu
docker-compose up -d --build
```

## 📝 Environment Variables

Tạo file `.env` để override default values:

```env
# Database
MONGODB_URI=mongodb://admin:password123@mongodb:27017/shopoo?authSource=admin
REDIS_URL=redis://:password123@redis:6379

# App
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-jwt-secret-key

# Upload
UPLOAD_PATH=./public/uploads
MAX_FILE_SIZE=5MB
```

## 🎯 Production Deployment

Để deploy production:

1. Tạo `docker-compose.prod.yml`
2. Sử dụng external volumes cho data
3. Setup reverse proxy (nginx)
4. Enable SSL/TLS
5. Use secrets cho passwords

```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Links hữu ích

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Redis Docker](https://hub.docker.com/_/redis)
