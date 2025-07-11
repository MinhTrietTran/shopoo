# 🚀 Hướng dẫn Cài đặt Shopoo

## 📋 Yêu cầu hệ thống

- **Node.js** >= 14.0.0
- **NPM** >= 6.0.0 
- **MongoDB** >= 4.4 (hoặc MongoDB Atlas)
- **Docker** & **Docker Compose** (tùy chọn - để chạy môi trường ảo)

## 🐳 Phương pháp 1: Sử dụng Docker (Khuyến nghị)

### Bước 1: Clone repository
```bash
git clone https://github.com/MinhTrietTran/shopoo.git
cd shopoo
git checkout develop
```

### Bước 2: Chạy với Docker Compose
```bash
# Khởi động tất cả services (MongoDB + App + Mongo Express)
docker-compose up -d

# Xem logs
docker-compose logs -f app

# Dừng services
docker-compose down

# Dừng và xóa volumes (reset database)
docker-compose down -v
```

### Bước 3: Truy cập ứng dụng
- **Website**: http://localhost:3000
- **MongoDB Admin**: http://localhost:8081 (admin/admin)
- **MongoDB**: localhost:27017

### Các lệnh Docker hữu ích
```bash
# Rebuild app container
docker-compose build app

# Chạy lệnh trong container
docker-compose exec app npm run seed

# Vào shell của container
docker-compose exec app sh

# Xem logs realtime
docker-compose logs -f app
```

## 💻 Phương pháp 2: Cài đặt Local

### Bước 1: Cài đặt Node.js với NVM (Node Version Manager)

#### Trên macOS/Linux:
```bash
# Cài đặt NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal hoặc chạy:
source ~/.bashrc

# Cài đặt Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Kiểm tra version
node --version
npm --version
```

#### Trên Windows:
```bash
# Sử dụng nvm-windows
# Download từ: https://github.com/coreybutler/nvm-windows

# Cài đặt Node.js
nvm install 18.18.0
nvm use 18.18.0
```

### Bước 2: Cài đặt MongoDB

#### Trên macOS (với Homebrew):
```bash
# Cài đặt MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Khởi động MongoDB
brew services start mongodb/brew/mongodb-community

# Kết nối MongoDB
mongosh
```

#### Trên Ubuntu/Debian:
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Thêm repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Cài đặt
sudo apt-get update
sudo apt-get install -y mongodb-org

# Khởi động
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Trên Windows:
- Download MongoDB Community Server từ: https://www.mongodb.com/try/download/community
- Cài đặt theo wizard
- Khởi động MongoDB Compass (GUI tool)

### Bước 3: Clone và cài đặt project
```bash
# Clone repository
git clone https://github.com/MinhTrietTran/shopoo.git
cd shopoo
git checkout develop

# Cài đặt dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Bước 4: Cấu hình Environment Variables
Chỉnh sửa file `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/shopoo
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_here
ADMIN_EMAIL=admin@shopoo.com
ADMIN_PASSWORD=admin123
```

### Bước 5: Seed dữ liệu mẫu
```bash
# Tạo dữ liệu mẫu
npm run seed
```

### Bước 6: Chạy ứng dụng
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

### Bước 7: Truy cập ứng dụng
- Website: http://localhost:3000

## ☁️ Phương pháp 3: Sử dụng MongoDB Atlas (Cloud)

### Bước 1: Tạo MongoDB Atlas account
1. Đăng ký tại: https://www.mongodb.com/atlas
2. Tạo free cluster
3. Tạo database user
4. Whitelist IP address

### Bước 2: Cấu hình connection string
Cập nhật `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopoo?retryWrites=true&w=majority
```

### Bước 3: Deploy lên cloud platform
```bash
# Ví dụ deploy lên Heroku
heroku create shopoo-app
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_atlas_connection_string
git push heroku develop:main
```

## 🛠️ Development Workflow

### Cài đặt Development Dependencies
```bash
# Cài đặt ESLint, Prettier
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier

# Setup pre-commit hooks (tùy chọn)
npm install --save-dev husky lint-staged
```

### Scripts hữu ích
```bash
# Chạy tests
npm test
npm run test:watch

# Lint code
npm run lint
npm run lint:fix

# Seed dữ liệu mẫu
npm run seed

# Development mode với auto-reload
npm run dev
```

### Debug với VS Code
Tạo file `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Shopoo",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## 🔧 Troubleshooting

### Lỗi thường gặp:

#### 1. MongoDB connection failed
```bash
# Kiểm tra MongoDB đang chạy
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Test connection
mongosh mongodb://localhost:27017/shopoo
```

#### 2. Port 3000 đã được sử dụng
```bash
# Tìm process đang sử dụng port
lsof -i :3000

# Kill process
kill -9 <PID>

# Hoặc thay đổi port trong .env
PORT=3001
```

#### 3. Node modules không tương thích
```bash
# Xóa và cài lại
rm -rf node_modules package-lock.json
npm install
```

#### 4. Permission denied (Linux/macOS)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

## 📚 Tài liệu tham khảo

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra [Issues](https://github.com/MinhTrietTran/shopoo/issues)
2. Tạo issue mới với thông tin chi tiết
3. Liên hệ team qua Discord/Slack

---
**Lưu ý**: Đảm bảo tất cả services đang chạy trước khi test ứng dụng!
