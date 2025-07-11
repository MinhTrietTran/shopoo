// MongoDB Connection Manager
const mongoose = require('mongoose');

class MongoDBManager {
    constructor() {
        this.connection = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.connection = await mongoose.connect(process.env.MONGODB_URI);
            this.isConnected = true;
            console.log('✅ MongoDB Connected:', this.connection.connection.host);
            console.log('📊 Database:', this.connection.connection.name);
            return this.connection;
        } catch (error) {
            console.error('❌ MongoDB Connection Error:', error);
            process.exit(1);
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('📴 MongoDB Disconnected');
        }
    }

    getConnection() {
        return this.connection;
    }

    isHealthy() {
        return this.isConnected && mongoose.connection.readyState === 1;
    }
}

module.exports = new MongoDBManager();
