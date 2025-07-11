@echo off
:: 🚀 Shopoo Quick Start Script for Windows
:: Script tự động setup và chạy dự án Shopoo với Docker

echo 🎯 Shopoo Quick Start
echo =====================

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

:: Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ docker-compose not found. Please install Docker Compose.
    pause
    exit /b 1
)

echo ✅ Docker is ready

:: Create uploads directory if not exists
if not exist "public\uploads" (
    echo 📁 Creating uploads directory...
    mkdir public\uploads
)

:: Stop existing containers if running
echo 🛑 Stopping existing containers...
docker-compose down >nul 2>&1

:: Build and start all services
echo 🔨 Building and starting services...
docker-compose up -d --build

:: Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 >nul

:: Check service health
echo 🔍 Checking service health...

:: Check MongoDB
echo|set /p="  MongoDB: "
docker-compose exec -T mongodb mongosh --quiet --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ready
) else (
    echo ❌ Not ready
)

:: Check App
echo|set /p="  App: "
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ready
) else (
    echo ❌ Not ready ^(might need more time^)
)

echo.
echo 🎉 Shopoo is now running!
echo.
echo 📱 Access URLs:
echo    Website:      http://localhost:3000
echo    MongoDB UI:   http://localhost:8081 ^(admin/admin^)
echo    Health Check: http://localhost:3000/health
echo.
echo 🔧 Useful commands:
echo    View logs:    docker-compose logs -f
echo    Stop all:     docker-compose down
echo    Restart:      docker-compose restart
echo.
echo 📚 Full documentation: DOCKER_SETUP.md

pause
