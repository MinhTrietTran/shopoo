require('dotenv').config();
const express = require('express');
const path = require('path');

// Import multi-database manager
const dbManager = require('./src/config/databases');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to all databases
dbManager.connectAll()
    .then(() => console.log('✅ All database connections established'))
    .catch(err => console.error('❌ Database initialization error:', err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./src/routes/web/home'));
app.use('/products', require('./src/routes/web/products'));

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const dbStatus = await dbManager.healthCheck();
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'Shopoo Multi-NoSQL App',
            databases: dbStatus
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            service: 'Shopoo Multi-NoSQL App',
            error: error.message
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).render('pages/404', {
        title: 'Trang không tìm thấy - Shopoo',
        user: null
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/error', {
        title: 'Lỗi hệ thống - Shopoo',
        user: null,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await dbManager.disconnectAll();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await dbManager.disconnectAll();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Shopoo Multi-NoSQL server running on port ${PORT}`);
    console.log(`📱 Web: http://localhost:${PORT}`);
    console.log(`� Health check: http://localhost:${PORT}/health`);
    console.log(`🗄️  Multi-Database Architecture Ready`);
});
