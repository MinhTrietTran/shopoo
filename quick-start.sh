#!/bin/bash

# 🚀 Shopoo Quick Start Script
# Script tự động setup và chạy dự án Shopoo với Docker

echo "🎯 Shopoo Quick Start"
echo "====================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is ready"

# Create uploads directory if not exists
if [ ! -d "public/uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p public/uploads
    chmod 755 public/uploads
fi

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start all services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are healthy
echo "🔍 Checking service health..."

# Check MongoDB
echo -n "  MongoDB: "
if docker-compose exec -T mongodb mongosh --quiet --eval "db.runCommand('ping')" >/dev/null 2>&1; then
    echo "✅ Ready"
else
    echo "❌ Not ready"
fi

# Check App
echo -n "  App: "
if curl -s http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Ready"
else
    echo "❌ Not ready (might need more time)"
fi

echo ""
echo "🎉 Shopoo is now running!"
echo ""
echo "📱 Access URLs:"
echo "   Website:      http://localhost:3000"
echo "   MongoDB UI:   http://localhost:8081 (admin/admin)"
echo "   Health Check: http://localhost:3000/health"
echo ""
echo "🔧 Useful commands:"
echo "   View logs:    docker-compose logs -f"
echo "   Stop all:     docker-compose down"
echo "   Restart:      docker-compose restart"
echo ""
echo "📚 Full documentation: DOCKER_SETUP.md"
