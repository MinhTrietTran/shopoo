# Sử dụng Node.js 18 LTS
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Tạo user non-root để bảo mật
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Chuyển ownership cho user nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js

# Chạy ứng dụng
CMD ["npm", "start"]
