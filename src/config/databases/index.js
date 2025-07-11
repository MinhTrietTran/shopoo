// Central Database Manager
const mongoManager = require('./mongodb');
const redisManager = require('./redis');
const neo4jManager = require('./neo4j');
const cassandraManager = require('./cassandra');

class DatabaseManager {
    constructor() {
        this.databases = {
            mongodb: mongoManager,
            redis: redisManager,
            neo4j: neo4jManager,
            cassandra: cassandraManager
        };
        this.activeConnections = new Set();
    }

    async connectAll() {
        console.log('🔄 Connecting to all databases...');

        try {
            // Connect to MongoDB (primary database)
            await this.databases.mongodb.connect();
            this.activeConnections.add('mongodb');

            // Connect to Redis (if implemented)
            await this.databases.redis.connect();

            // Connect to Neo4j (if implemented)
            await this.databases.neo4j.connect();

            // Connect to Cassandra (if implemented)
            await this.databases.cassandra.connect();

            console.log(`✅ Database connections established: ${Array.from(this.activeConnections).join(', ')}`);
        } catch (error) {
            console.error('❌ Database connection error:', error);
            throw error;
        }
    }

    async disconnectAll() {
        console.log('🔄 Disconnecting from all databases...');

        for (const dbName of this.activeConnections) {
            try {
                await this.databases[dbName].disconnect();
                console.log(`✅ Disconnected from ${dbName}`);
            } catch (error) {
                console.error(`❌ Error disconnecting from ${dbName}:`, error);
            }
        }

        this.activeConnections.clear();
    }

    getDatabase(name) {
        if (!this.databases[name]) {
            throw new Error(`Database ${name} not found`);
        }
        return this.databases[name];
    }

    async healthCheck() {
        const status = {};

        for (const [name, db] of Object.entries(this.databases)) {
            try {
                status[name] = {
                    connected: db.isHealthy(),
                    status: db.isHealthy() ? 'healthy' : 'disconnected'
                };
            } catch (error) {
                status[name] = {
                    connected: false,
                    status: 'error',
                    error: error.message
                };
            }
        }

        return status;
    }

    // Convenience methods for each database
    get mongo() {
        return this.databases.mongodb;
    }

    get redis() {
        return this.databases.redis;
    }

    get neo4j() {
        return this.databases.neo4j;
    }

    get cassandra() {
        return this.databases.cassandra;
    }
}

module.exports = new DatabaseManager();
