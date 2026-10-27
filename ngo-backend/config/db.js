const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ...(process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('render.com')
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    }
  : {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'aidlink_db',
    };

const pool = new Pool(poolConfig);

module.exports = pool;