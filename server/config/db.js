const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'peblo_db.json');

// Helper to load the JSON database
const loadDb = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], notes: [] }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (error) {
    return { users: [], notes: [] };
  }
};

// Helper to save the JSON database
const saveDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save to mock DB file:', error);
  }
};

// Mock Query Processor
const mockQuery = async (text, params = []) => {
  const db = loadDb();
  const sql = text.trim().replace(/\s+/g, ' ');

  // 0. Handle table and index creation queries
  if (sql.match(/CREATE\s+TABLE/i) || sql.match(/CREATE\s+INDEX/i)) {
    return { rows: [] };
  }

  // 1. SELECT FROM users WHERE id = $1
  if (sql.match(/SELECT.*FROM\s+users\s+WHERE\s+id\s*=\s*\$1/i)) {
    const id = params[0];
    const user = db.users.find(u => u.id === Number(id));
    return { rows: user ? [user] : [] };
  }

  // 2. SELECT FROM users WHERE email = $1
  if (sql.match(/SELECT.*FROM\s+users\s+WHERE\s+email\s*=\s*\$1/i)) {
    const email = params[0]?.toLowerCase();
    const user = db.users.find(u => u.email?.toLowerCase() === email);
    return { rows: user ? [user] : [] };
  }

  // 3. INSERT INTO users ...
  if (sql.match(/INSERT\s+INTO\s+users/i)) {
    const [name, email, password] = params;
    const newUser = {
      id: db.users.length + 1,
      name,
      email,
      password,
      avatar: null,
      bio: '',
      job_title: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDb(db);
    return { rows: [newUser] };
  }

  // 4. UPDATE users ...
  if (sql.match(/UPDATE\s+users\s+SET/i)) {
    const id = params[0];
    const userIdx = db.users.findIndex(u => u.id === Number(id));
    if (userIdx !== -1) {
      const setPart = sql.match(/SET\s+(.*?)\s+WHERE/i)[1];
      const setFields = setPart.split(',').map(s => s.trim().split('=')[0].trim());
      for (let i = 0; i < setFields.length; i++) {
        const fieldName = setFields[i];
        if (fieldName !== 'updated_at') {
          db.users[userIdx][fieldName] = params[i + 1];
        }
      }
      db.users[userIdx].updated_at = new Date().toISOString();
      saveDb(db);
      return { rows: [db.users[userIdx]] };
    }
    return { rows: [] };
  }

  // 5. DELETE FROM users ...
  if (sql.match(/DELETE\s+FROM\s+users\s+WHERE\s+id\s*=\s*\$1/i)) {
    const id = params[0];
    db.users = db.users.filter(u => u.id !== Number(id));
    db.notes = db.notes.filter(n => n.user_id !== Number(id));
    saveDb(db);
    return { rowCount: 1 };
  }

  // 6. SELECT FROM notes WHERE user_id = $1 AND is_archived = false ...
  if (sql.match(/SELECT\s+\*\s+FROM\s+notes\s+WHERE\s+user_id\s*=\s*\$1\s+AND\s+is_archived\s*=\s*false/i)) {
    const userId = Number(params[0]);
    let notes = db.notes.filter(n => n.user_id === userId && !n.is_archived);

    let paramIdx = 1;
    if (sql.includes('ILIKE')) {
      paramIdx++;
      const searchVal = params[paramIdx - 1]?.replace(/%/g, '').toLowerCase();
      if (searchVal) {
        notes = notes.filter(n => 
          n.title?.toLowerCase().includes(searchVal) || 
          n.content?.toLowerCase().includes(searchVal) ||
          n.tags?.some(t => t.toLowerCase().includes(searchVal))
        );
      }
    }
    if (sql.includes('category = $')) {
      paramIdx++;
      const categoryVal = params[paramIdx - 1];
      if (categoryVal && categoryVal !== 'All') {
        notes = notes.filter(n => n.category === categoryVal);
      }
    }
    if (sql.includes('= ANY(tags)')) {
      paramIdx++;
      const tagVal = params[paramIdx - 1];
      if (tagVal) {
        notes = notes.filter(n => n.tags?.includes(tagVal));
      }
    }

    if (sql.includes('ORDER BY title ASC')) {
      notes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sql.includes('ORDER BY title DESC')) {
      notes.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sql.includes('ORDER BY updated_at ASC')) {
      notes.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
    } else {
      notes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    }

    return { rows: notes };
  }

  // 7. SELECT FROM notes WHERE user_id = $1 AND is_archived = true
  if (sql.match(/SELECT\s+\*\s+FROM\s+notes\s+WHERE\s+user_id\s*=\s*\$1\s+AND\s+is_archived\s*=\s*true/i)) {
    const userId = Number(params[0]);
    const notes = db.notes.filter(n => n.user_id === userId && n.is_archived);
    notes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return { rows: notes };
  }

  // 8. SELECT FROM notes WHERE id = $1 AND user_id = $2
  if (sql.match(/SELECT\s+\*\s+FROM\s+notes\s+WHERE\s+id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i)) {
    const [id, userId] = params;
    const note = db.notes.find(n => n.id === Number(id) && n.user_id === Number(userId));
    return { rows: note ? [note] : [] };
  }

  // 9. INSERT INTO notes ...
  if (sql.match(/INSERT\s+INTO\s+notes/i)) {
    const [userId, title, content, tags, category] = params;
    const newNote = {
      id: db.notes.length + 1,
      user_id: Number(userId),
      title: title || 'Untitled Note',
      content: content || '',
      tags: tags || [],
      category: category || 'General',
      summary: '',
      action_items: [],
      suggested_title: '',
      is_archived: false,
      is_public: false,
      share_id: require('crypto').randomUUID(),
      ai_usage_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.notes.push(newNote);
    saveDb(db);
    return { rows: [newNote] };
  }

  // 10. UPDATE notes ...
  if (sql.match(/UPDATE\s+notes\s+SET/i)) {
    const id = params[0];
    const userId = params[1];
    const noteIdx = db.notes.findIndex(n => n.id === Number(id) && n.user_id === Number(userId));
    if (noteIdx !== -1) {
      const setPart = sql.match(/SET\s+(.*?)\s+WHERE/i)[1];
      const setFields = setPart.split(',').map(s => s.trim().split('=')[0].trim());
      for (let i = 0; i < setFields.length; i++) {
        const fieldName = setFields[i];
        if (fieldName !== 'updated_at') {
          db.notes[noteIdx][fieldName] = params[i + 2];
        }
      }
      db.notes[noteIdx].updated_at = new Date().toISOString();
      saveDb(db);
      return { rows: [db.notes[noteIdx]] };
    }
    return { rows: [] };
  }

  // 11. DELETE FROM notes WHERE id = $1 AND user_id = $2
  if (sql.match(/DELETE\s+FROM\s+notes\s+WHERE\s+id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i)) {
    const [id, userId] = params;
    const initialLen = db.notes.length;
    db.notes = db.notes.filter(n => !(n.id === Number(id) && n.user_id === Number(userId)));
    saveDb(db);
    return { rowCount: initialLen - db.notes.length };
  }

  // 12. DELETE FROM notes WHERE user_id = $1
  if (sql.match(/DELETE\s+FROM\s+notes\s+WHERE\s+user_id\s*=\s*\$1/i)) {
    const userId = Number(params[0]);
    db.notes = db.notes.filter(n => n.user_id !== userId);
    saveDb(db);
    return { rowCount: 1 };
  }

  // 13. share_id = $1
  if (sql.includes('share_id = $1')) {
    const shareId = params[0];
    const note = db.notes.find(n => n.share_id === shareId && n.is_public);
    if (note) {
      const user = db.users.find(u => u.id === note.user_id);
      return { rows: [{ ...note, user_name: user ? user.name : 'Unknown User' }] };
    }
    return { rows: [] };
  }

  // 14. SELECT COUNT(*) FROM notes WHERE user_id = $1 AND is_archived = $2
  if (sql.match(/SELECT\s+COUNT\(\*\)\s+FROM\s+notes\s+WHERE\s+user_id\s*=\s*\$1\s+AND\s+is_archived\s*=\s*\$2/i)) {
    const userId = Number(params[0]);
    const archived = params[1] === true || params[1] === 'true';
    const count = db.notes.filter(n => n.user_id === userId && n.is_archived === archived).length;
    return { rows: [{ count: String(count) }] };
  }

  // 15. SUM(ai_usage_count)
  if (sql.match(/SUM\(ai_usage_count\)/i)) {
    const userId = Number(params[0]);
    const total = db.notes
      .filter(n => n.user_id === userId)
      .reduce((sum, n) => sum + (n.ai_usage_count || 0), 0);
    return { rows: [{ total: String(total) }] };
  }

  // 16. unnest(tags)
  if (sql.match(/unnest\(tags\)/i)) {
    const userId = Number(params[0]);
    const limit = Number(params[1]) || 5;
    const tagCounts = {};
    db.notes
      .filter(n => n.user_id === userId)
      .forEach(n => {
        n.tags?.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
    const sortedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count: String(count) }))
      .sort((a, b) => Number(b.count) - Number(a.count))
      .slice(0, limit);
    return { rows: sortedTags };
  }

  // 17. DATE(created_at)
  if (sql.match(/DATE\(created_at\)/i)) {
    const userId = Number(params[0]);
    const dateCounts = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    db.notes
      .filter(n => n.user_id === userId && new Date(n.created_at) >= sevenDaysAgo)
      .forEach(n => {
        const dateStr = new Date(n.created_at).toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
      });

    const sortedDates = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count: String(count) }))
      .sort((a, b) => a.date.localeCompare(b.date));
    return { rows: sortedDates };
  }

  // 18. SELECT title, updated_at, category FROM notes ...
  if (sql.match(/SELECT\s+title,\s+updated_at,\s+category\s+FROM\s+notes/i)) {
    const userId = Number(params[0]);
    const limit = Number(params[1]) || 3;
    const notes = db.notes
      .filter(n => n.user_id === userId && !n.is_archived)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, limit)
      .map(n => ({ title: n.title, updated_at: n.updated_at, category: n.category }));
    return { rows: notes };
  }

  console.warn("Unmatched Mock SQL Query:", sql);
  return { rows: [] };
};

let useMock = false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

pool.on('connect', () => {
  if (!useMock) {
    console.log('🚀 PostgreSQL Connected');
  }
});

pool.on('error', (err) => {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ PostgreSQL Connection Error:', err.message);
    process.exit(1);
  } else {
    if (!useMock) {
      console.log('⚠️ PostgreSQL connection failed. Falling back to local in-memory JSON database.');
      useMock = true;
    }
  }
});

// Wrap the query method to conditionally fall back to the mock database
const originalQuery = pool.query.bind(pool);
pool.query = async function (text, params) {
  if (useMock) {
    return mockQuery(text, params);
  }
  try {
    return await originalQuery(text, params);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && (error.code === 'ECONNREFUSED' || error.message.includes('connect'))) {
      console.log('⚠️ PostgreSQL connection refused. Enabling local in-memory JSON database.');
      useMock = true;
      return mockQuery(text, params);
    }
    throw error;
  }
};

module.exports = pool;
