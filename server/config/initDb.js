const pool = require('./db');

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar TEXT DEFAULT NULL,
        bio VARCHAR(200) DEFAULT '',
        job_title VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        content TEXT DEFAULT '',
        summary TEXT DEFAULT '',
        action_items TEXT[] DEFAULT '{}',
        suggested_title VARCHAR(200) DEFAULT '',
        tags TEXT[] DEFAULT '{}',
        category VARCHAR(100) DEFAULT 'General',
        is_archived BOOLEAN DEFAULT false,
        is_public BOOLEAN DEFAULT false,
        share_id UUID DEFAULT gen_random_uuid() UNIQUE,
        ai_usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
      CREATE INDEX IF NOT EXISTS idx_notes_share_id ON notes(share_id);
    `);
    console.log('✅ Database tables ready');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = initDB;
