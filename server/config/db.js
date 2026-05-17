const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('connect', () => {
  console.log('🚀 PostgreSQL Connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Connection Error:', err.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

module.exports = pool;
