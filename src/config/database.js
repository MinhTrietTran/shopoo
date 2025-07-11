const mongoose = require('mongoose');
const neo4j = require('./databases/neo4j')

/**
 * Kết nối MongoDB database
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Mongoose 6+ không cần useNewUrlParser và useUnifiedTopology
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

        // Lắng nghe các events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });

        // Kết nối Neo4j
        await neo4j.connect();

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

/**
 * Đóng kết nối database
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');

        await neo4j.disconnect();
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
};

module.exports = {
    connectDB,
    disconnectDB
};
