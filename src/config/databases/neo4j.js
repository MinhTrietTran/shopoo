const neo4j = require('neo4j-driver');

class Neo4jManager {
    constructor() {
        this.driver = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.driver = neo4j.driver(
                process.env.NEO4J_URI,
                neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
            );
            await this.driver.verifyConnectivity();
            this.isConnected = true;
            console.log('✅ Connected to Neo4j');
        } catch (err) {
            console.error('❌ Failed to connect to Neo4j:', err);
        }
    }

    async disconnect() {
        if (this.driver) {
            await this.driver.close();
            console.log('🛑 Disconnected from Neo4j');
        }
    }

    isHealthy() {
        return this.isConnected;
    }

    async runQuery(query, params = {}) {
        const session = this.driver.session();
        try {
            const result = await session.run(query, params);
            return result.records;
        } finally {
            await session.close();
        }
    }

    async createNode(label, properties) {
        const props = Object.keys(properties).map(key => `${key}: $${key}`).join(', ');
        const query = `CREATE (n:${label} { ${props} }) RETURN n`;
        return this.runQuery(query, properties);
    }

    async createRelationship(fromId, toId, type, properties = {}) {
        const props = Object.keys(properties).map(k => `${k}: $${k}`).join(', ');
        const query = `
            MATCH (a), (b)
            WHERE id(a) = $fromId AND id(b) = $toId
            CREATE (a)-[r:${type} { ${props} }]->(b)
            RETURN r
        `;
        return this.runQuery(query, { fromId, toId, ...properties });
    }
}

module.exports = new Neo4jManager();
