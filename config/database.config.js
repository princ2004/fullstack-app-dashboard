const mysql = require('mysql2/promise');
const { MongoClient } = require('mongodb');
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// MySQL Configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'fullstack_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// MongoDB Configuration
const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack_app',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  }
};

// PostgreSQL Configuration
const postgresConfig = {
  host: process.env.POSTGRESQL_HOST || 'localhost',
  user: process.env.POSTGRESQL_USER || 'postgres',
  password: process.env.POSTGRESQL_PASSWORD || 'password',
  database: process.env.POSTGRESQL_DATABASE || 'fullstack_app',
  port: process.env.POSTGRESQL_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// SQLite Configuration (for development)
const sqliteConfig = {
  filename: path.join(__dirname, '../data/app.db')
};

class DatabaseManager {
  constructor() {
    this.connections = {
      mysql: null,
      mongodb: null,
      postgresql: null,
      sqlite: null
    };
  }

  // MySQL Connection
  async connectMySQL() {
    try {
      this.connections.mysql = mysql.createPool(mysqlConfig);
      
      // Test connection
      const connection = await this.connections.mysql.getConnection();
      await connection.ping();
      connection.release();
      
      console.log('✅ MySQL connected successfully');
      return this.connections.mysql;
    } catch (error) {
      console.error('❌ MySQL connection failed:', error.message);
      return null;
    }
  }

  // MongoDB Connection
  async connectMongoDB() {
    try {
      this.connections.mongodb = new MongoClient(mongoConfig.uri, mongoConfig.options);
      await this.connections.mongodb.connect();
      
      // Test connection
      await this.connections.mongodb.db().admin().ping();
      
      console.log('✅ MongoDB connected successfully');
      return this.connections.mongodb;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      return null;
    }
  }

  // PostgreSQL Connection
  async connectPostgreSQL() {
    try {
      this.connections.postgresql = new Pool(postgresConfig);
      
      // Test connection
      const client = await this.connections.postgresql.connect();
      await client.query('SELECT NOW()');
      client.release();
      
      console.log('✅ PostgreSQL connected successfully');
      return this.connections.postgresql;
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error.message);
      return null;
    }
  }

  // SQLite Connection
  async connectSQLite() {
    try {
      return new Promise((resolve, reject) => {
        this.connections.sqlite = new sqlite3.Database(sqliteConfig.filename, (err) => {
          if (err) {
            console.error('❌ SQLite connection failed:', err.message);
            reject(err);
          } else {
            console.log('✅ SQLite connected successfully');
            resolve(this.connections.sqlite);
          }
        });
      });
    } catch (error) {
      console.error('❌ SQLite connection failed:', error.message);
      return null;
    }
  }

  // Initialize all databases
  async initializeAll() {
    console.log('🔄 Initializing database connections...');
    
    const results = await Promise.allSettled([
      this.connectMySQL(),
      this.connectMongoDB(),
      this.connectPostgreSQL(),
      this.connectSQLite()
    ]);

    const status = {
      mysql: results[0].status === 'fulfilled' && results[0].value !== null,
      mongodb: results[1].status === 'fulfilled' && results[1].value !== null,
      postgresql: results[2].status === 'fulfilled' && results[2].value !== null,
      sqlite: results[3].status === 'fulfilled' && results[3].value !== null
    };

    console.log('📊 Database connection status:', status);
    return status;
  }

  // Get connection by type
  getConnection(type) {
    return this.connections[type];
  }

  // Close all connections
  async closeAll() {
    console.log('🔄 Closing database connections...');
    
    try {
      if (this.connections.mysql) {
        await this.connections.mysql.end();
        console.log('✅ MySQL connection closed');
      }
      
      if (this.connections.mongodb) {
        await this.connections.mongodb.close();
        console.log('✅ MongoDB connection closed');
      }
      
      if (this.connections.postgresql) {
        await this.connections.postgresql.end();
        console.log('✅ PostgreSQL connection closed');
      }
      
      if (this.connections.sqlite) {
        this.connections.sqlite.close();
        console.log('✅ SQLite connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing connections:', error.message);
    }
  }

  // Database health check
  async healthCheck() {
    const health = {
      mysql: false,
      mongodb: false,
      postgresql: false,
      sqlite: false,
      timestamp: new Date().toISOString()
    };

    // MySQL health check
    try {
      if (this.connections.mysql) {
        const connection = await this.connections.mysql.getConnection();
        await connection.ping();
        connection.release();
        health.mysql = true;
      }
    } catch (error) {
      console.error('MySQL health check failed:', error.message);
    }

    // MongoDB health check
    try {
      if (this.connections.mongodb) {
        await this.connections.mongodb.db().admin().ping();
        health.mongodb = true;
      }
    } catch (error) {
      console.error('MongoDB health check failed:', error.message);
    }

    // PostgreSQL health check
    try {
      if (this.connections.postgresql) {
        const client = await this.connections.postgresql.connect();
        await client.query('SELECT 1');
        client.release();
        health.postgresql = true;
      }
    } catch (error) {
      console.error('PostgreSQL health check failed:', error.message);
    }

    // SQLite health check
    try {
      if (this.connections.sqlite) {
        await new Promise((resolve, reject) => {
          this.connections.sqlite.get('SELECT 1', (err) => {
            if (err) reject(err);
            else resolve(true);
          });
        });
        health.sqlite = true;
      }
    } catch (error) {
      console.error('SQLite health check failed:', error.message);
    }

    return health;
  }
}

// Export singleton instance
const dbManager = new DatabaseManager();

module.exports = {
  DatabaseManager,
  dbManager,
  configs: {
    mysql: mysqlConfig,
    mongodb: mongoConfig,
    postgresql: postgresConfig,
    sqlite: sqliteConfig
  }
};
